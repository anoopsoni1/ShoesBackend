import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Asynchandler } from "../utils/Asynchandler.js";
import {ApiResponse} from "../utils/Apiresponse.js"

dotenv.config();

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Chatbot = Asynchandler(async (req, res) => {
  const { question, products } = req.body;
  try {
    const prompt = `
You are a helpful AI for a shoe website.
Here is the product catalog: ${JSON.stringify(products)}
User asked: "${question}"
Provide recommendations based only on this catalog.
    `
    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

const text = result.candidates[0].content.parts[0].text;
res.json( new ApiResponse(200 , {
  text
}, 
 "Gemini called succesfully "
)
)

  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ answer: "Error fetching from AI" });
  }
});
export { Chatbot };
