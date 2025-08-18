import { Asynchandler } from "../utils/Asynchandler.js";
import fetch from "node-fetch";

const API_KEY = "AIzaSyDgBxl2WWzYga2trUd1SEgOqFTujFKrZBQ"; 

const Chatbot = Asynchandler(async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage?key=${API_KEY}
`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a chatbot for a shoe website. Only answer questions about shoes, orders, or payments. User: ${userMessage}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    
     console.log(data);
     

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.json({ success: true, reply });
    } else {
      return res.json({ success: true, reply: "Sorry, I couldn't understand that." });
    }
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ success: false, message: "Something went wrong with Gemini API." });
  }
});

export { Chatbot };
