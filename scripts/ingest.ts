import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { VertexAIEmbeddings } from "@langchain/google-vertexai";
import { createClient } from "@supabase/supabase-js";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

async function ingestData() {
  try {
    console.log("1. Initializing Database and Enterprise Vertex AI...");
    
    // Explicitly load key to ensure authentication
    const gcpKey = JSON.parse(fs.readFileSync("./gcp-key.json", "utf8"));
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
    
    const embeddings = new VertexAIEmbeddings({
      model: "text-embedding-004", 
      authOptions: { credentials: gcpKey },
      projectId: process.env.GOOGLE_CLOUD_PROJECT, // Fixed property name
      maxConcurrency: 5, 
      maxRetries: 3,     
    });

    const schemeUrls = [
      "https://www.myscheme.gov.in/schemes/pm-kisan", // Fixed URL with hyphen
    ];

    console.log("2. Booting up Headless Chrome (Puppeteer)...");
    
    for (const url of schemeUrls) {
      console.log(`Navigating to: ${url}`);
      
      const loader = new PuppeteerWebBaseLoader(url, {
        gotoOptions: { waitUntil: "networkidle2" },
        evaluate: async (page) => {
          return await page.evaluate(() => document.body.innerText);
        },
      });

      const docs = await loader.load();

      console.log("3. Chunking the dynamic document...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      
      const splitDocs = await textSplitter.splitDocuments(docs);
      
      const docsWithMetadata = splitDocs.map((doc) => ({
        ...doc,
        metadata: { ...doc.metadata, source: url, scheme: url.split('/').pop() },
      }));

      console.log(`Created ${docsWithMetadata.length} chunks. Pushing to Vector DB...`);

      await SupabaseVectorStore.fromDocuments(
        docsWithMetadata,
        embeddings,
        {
          client,
          tableName: "scheme_documents",
          queryName: "match_scheme_documents",
        }
      );
    }

    console.log("✅ Successfully ingested data with Vertex AI!");
    process.exit(0); 
  } catch (error) {
    console.error("❌ Error ingesting data:", error);
    process.exit(1);
  }
}

ingestData();