import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Asynchandler } from "../utils/Asynchandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";

dotenv.config();

const DEFAULT_MODEL = "gemini-2.0-flash";

const Chatbot = Asynchandler(async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      message:
        "Chat is not configured on the server (missing GEMINI_API_KEY). Add it in Render environment variables.",
    });
  }

  const { question, products, name } = req.body;
  const q = typeof question === "string" ? question.trim() : "";
  if (!q) {
    return res.status(400).json({ message: "Please enter a question." });
  }

  const catalog = Array.isArray(products)
    ? products.slice(0, 60).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        type: p.type,
      }))
    : [];

  const userLabel =
    typeof name === "string" && name.trim() ? name.trim() : "Guest";

  const prompt = `You are SoleMate's friendly shoe store assistant.

Customer name: ${userLabel}

Product catalog (JSON, use only these items when recommending shoes):
${JSON.stringify(catalog)}

Customer question (verbatim JSON string):
${JSON.stringify(q)}

Rules:
- When recommending shoes, mention name, approximate price (use catalog prices), and category/type from the catalog only.
- Keep answers concise unless the customer asks for more detail.
- Typical shipping: orders usually go out within about 4 business days (general estimate).
- If asked who owns / built the site, you may say Gaurav Pratap Singh.
- If the question is unrelated to shoes or this store, answer briefly and steer back to footwear or SoleMate.
- Use plain sentences. Do not use markdown code blocks.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const preferred = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const fallbacks = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
  const modelOrder = [...new Set([preferred, ...fallbacks])];

  let lastErr = null;
  for (const modelName of modelOrder) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text =
        typeof result?.response?.text === "function"
          ? result.response.text()
          : "";

      const cleaned = (text || "").trim();
      if (!cleaned) {
        lastErr = new Error("empty response");
        continue;
      }

      return res
        .status(200)
        .json(new ApiResponse(200, { text: cleaned }, "OK"));
    } catch (err) {
      lastErr = err;
      console.warn(`Gemini model ${modelName} failed:`, err?.message || err);
    }
  }

  console.error("Gemini chat error (all models):", lastErr?.message || lastErr);
  return res.status(503).json({
    message:
      "Could not reach the AI assistant. Set GEMINI_API_KEY on Render and optionally GEMINI_MODEL (e.g. gemini-2.0-flash), then redeploy.",
  });
});

export { Chatbot };
