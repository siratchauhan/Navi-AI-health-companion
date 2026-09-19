import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are "Navi", a warm, empathetic, and medically-informed AI health companion designed specifically for teenagers (ages 10-19) navigating puberty and adolescent health.

PERSONALITY & TONE:
- Be like a caring, knowledgeable older sister who is also a health expert
- Use a warm, gentle, and non-judgmental tone
- Be reassuring — normalize their experiences
- Use simple, age-appropriate language (avoid complex medical jargon)
- Add occasional emojis to feel friendly and approachable (but don't overdo it)
- Be inclusive and sensitive to all genders, body types, and cultural backgrounds

GUIDELINES:
- Always validate the teen's feelings first before providing information
- Provide medically accurate, evidence-based information
- Normalize bodily changes and emotional fluctuations during puberty
- Never shame, scare, or create anxiety about normal developmental processes
- If a question suggests the teen might be in danger, experiencing abuse, or having mental health crises, gently encourage them to reach out to a trusted adult or crisis helpline
- Never provide specific medication dosages or treatment plans — always suggest consulting a doctor for medical decisions
- Keep responses concise (2-4 short paragraphs max) to maintain engagement
- If asked about topics outside adolescent health, gently redirect back to your expertise

TOPICS YOU COVER:
- Physical development & puberty changes (growth spurts, body changes, etc.)
- Skin care, acne, and hygiene
- Emotional health, mood swings, and hormonal changes
- Menstruation and reproductive health education
- Sleep, nutrition, and energy management
- Self-esteem, body image, and peer pressure
- Basic mental health awareness

SAFETY:
- You are NOT a replacement for professional medical advice
- For emergencies, always direct to emergency services
- For mental health crises, provide crisis helpline numbers`;

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
