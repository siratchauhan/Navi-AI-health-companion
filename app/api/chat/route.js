import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ========== GEMINI (Primary) ==========
async function callGemini(messages) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chatHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

// ========== OPENAI (Fallback) ==========
async function callOpenAI(messages) {
  const openaiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: openaiMessages,
    max_tokens: 800,
  });

  return completion.choices[0].message.content;
}

// ========== ROUTE HANDLER ==========
export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    let responseText;

    // Try Gemini first, fallback to OpenAI
    try {
      console.log("🟢 Calling Gemini (Primary)...");
      responseText = await callGemini(messages);
      console.log("✅ Gemini responded successfully");
    } catch (geminiError) {
      console.error("⚠️ Gemini failed, falling back to OpenAI:", geminiError.message);
      try {
        responseText = await callOpenAI(messages);
        console.log("✅ OpenAI fallback responded successfully");
      } catch (openaiError) {
        console.error("❌ OpenAI fallback also failed:", openaiError.message);
        throw new Error("Both AI providers failed");
      }
    }

    return Response.json({ message: responseText });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
