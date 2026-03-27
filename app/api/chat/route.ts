import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";

export async function POST(req: NextRequest) {
  try {
    const { message, language, userProfile } = await req.json(); // Receive language

    // 1. Setup Tools: The Mandi Price Tool
    const mandiTool = tool(
      async ({ commodity, state, market }) => {
        const apiKey = process.env.OGD_API_KEY;
        const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
        let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;
        if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
        if (state) url += `&filters[state]=${encodeURIComponent(state)}`;
        if (market) url += `&filters[market]=${encodeURIComponent(market)}`;

        const res = await fetch(url);
        const data = await res.json();
        return JSON.stringify(data.records?.slice(0, 3) || "No live data found.");
      },
      {
        name: "get_mandi_prices",
        description: "Fetch live wholesale market prices for crops in India.",
        schema: z.object({
          commodity: z.string().optional(),
          state: z.string().optional(),
          market: z.string().optional(),
        }),
      }
    );

    // 2. Setup RAG: The Scheme Knowledge Tool
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: "scheme_documents",
      queryName: "match_scheme_documents",
    });

    const knowledgeTool = tool(
      async ({ query }) => {
        const docs = await vectorStore.similaritySearch(query, 3);
        return docs.map(d => d.pageContent).join("\n\n");
      },
      {
        name: "search_schemes",
        description: "Search for government scheme details, eligibility, and benefits.",
        schema: z.object({ query: z.string() }),
      }
    );

  // 3. Initialize the Agent with the Stable Flash model
// 3. Initialize the Agent with the correct TypeScript-approved structure
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-3-flash-preview", 
  temperature: 0,
});

    const tools = [mandiTool, knowledgeTool];
    const agent = createReactAgent({
      llm: model,
      tools,
      checkpointSaver: new MemorySaver(), // Optional: adds short-term memory
    });

    // 4. Run the Agent with a System Prompt
   

  const systemMessage = `
    You are LokSeva Mitra, a helpful government assistant.
    IMPORTANT: You must respond ONLY in the ${language} language.
    If the language is 'hi', use Hindi (Devanagari script).
    If the language is 'mr', use Marathi (Devanagari script).
  
  FORMATTING RULES:
  1. Use Markdown for structure. Use # for main headers and ## for sub-headers.
  2. Use ALL CAPS for headers (e.g., ELIGIBILITY RULES).
  3. Use plain numbered lists (1., 2., 3.) for steps.
  4. Keep the tone formal, helpful, and clear. 
  5. Use **bold** for emphasis on key terms or amounts.
  6. Use bullet points or numbered lists for readability.
  7. Always provide full, clickable URLs starting with https://.
  8. Do not let raw symbols leak; ensure proper Markdown syntax.
  
  USER CONTEXT: ${JSON.stringify(userProfile || "Unknown")}
  ... (rest of your existing rules)
`;

    const result = await agent.invoke(
      { messages: [["system", systemMessage], ["user", message]] },
      { configurable: { thread_id: "user_session_1" } }
    );

    const lastMessage = result.messages[result.messages.length - 1];
    return NextResponse.json({ reply: lastMessage.content });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: "System encountered an issue." }, { status: 500 });
  }
}