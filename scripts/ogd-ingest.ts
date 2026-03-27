import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function discoverSchemes() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
  const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });

  // 1. Search keywords to broaden your project scope
  const categories = ["Farmer", "Health", "Scholarship", "Women"];
  
  for (const category of categories) {
    console.log(`🔍 Searching OGD for ${category} schemes...`);
    
    // OGD Catalog Search API
    const searchUrl = `https://api.data.gov.in/lists/datasets?api-key=${process.env.OGD_API_KEY}&format=json&filters[title]=${category}`;
    
    const response = await fetch(searchUrl);
    const result = await response.json();
    const datasets = result.datasets || [];

    for (const data of datasets.slice(0, 5)) {
      const infoText = `
        Scheme/Dataset: ${data.title}
        Ministry: ${data.org[0]}
        Sector: ${data.sector[0]}
        Description: ${data.description}
        Source: https://data.gov.in/dataset/${data.id}
      `;

      // Convert this structured metadata into a Vector Document
      await SupabaseVectorStore.fromTexts(
        [infoText],
        [{ source: data.id, type: "OGD_METADATA", category }],
        embeddings,
        { client: supabase, tableName: "scheme_documents" }
      );
    }
  }
  console.log("✅ OGD metadata discovery complete!");
}

discoverSchemes();