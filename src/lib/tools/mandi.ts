import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const mandiPriceTool = tool(
  async ({ commodity, state, market }) => {
    const apiKey = process.env.OGD_API_KEY;
    const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
    
    // Build the query with filters
    let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;
    
    if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    if (state) url += `&filters[state]=${encodeURIComponent(state)}`;
    if (market) url += `&filters[market]=${encodeURIComponent(market)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.records || data.records.length === 0) {
        return "No current price data found for those filters. Try a different market or state.";
      }

      // Format the result for the AI to read
      return JSON.stringify(data.records.slice(0, 5).map((r: any) => ({
        market: r.market,
        commodity: r.commodity,
        variety: r.variety,
        arrival_date: r.arrival_date,
        min_price: r.min_price,
        max_price: r.max_price,
        modal_price: r.modal_price
      })));
    } catch (error) {
      return "Failed to fetch live Mandi prices. Please try again later.";
    }
  },
  {
    name: "get_mandi_prices",
    description: "Fetches live daily wholesale market (Mandi) prices for agricultural commodities in India.",
    schema: z.object({
      commodity: z.string().optional().describe("The name of the crop, e.g., 'Wheat', 'Rice', 'Potato'"),
      state: z.string().optional().describe("The Indian state, e.g., 'Maharashtra'"),
      market: z.string().optional().describe("Specific Mandi name, e.g., 'Nashik'"),
    }),
  }
);