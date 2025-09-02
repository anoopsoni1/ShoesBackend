import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Asynchandler } from "../utils/Asynchandler.js";
import {ApiResponse} from "../utils/Apiresponse.js"
import {ApiError} from "../utils/Apierror.js"

dotenv.config();

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Chatbot = Asynchandler(async (req, res) => {
  const { question, products, user} = req.body;

  try {
    const prompt =  `
You are a helpful AI for a shoe website. 
Here is the logged-in user: ${JSON.stringify(user)}
Here is the product catalog: ${JSON.stringify(products)}
User asked: "${question}"

Rules:
- If the question is about products → answer only using the catalog.
- If the question is about delivery → answer using the orders data (4day).
- If the user asks for order status → return the status from the orders data.
- If asked for their name → use the user object.
- If the question is outside this scope → politely decline.
- if the question is about the owner of this website ->  return the name Anoop soni
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
