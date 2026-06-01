import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Google GenAI safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not defined or is placeholder. Using fallback static responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Route: Post Draft generator
app.post("/api/gemini/draft-post", async (req, res) => {
  const { topic } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback if API key is not yet set
    const fallbackText = `Here's a high-impact framework on "${topic || 'Coaching Values'}":\n\n🎯 THE CHALLENGE: Most direct clients focus on inputs instead of outcomes. They monitor hours rather than breakthroughs.\n\n💡 THE FIX: Pivot to value-based alignment. Give them a robust blueprint.\n\n👇 Repost or Comment 'GROWTH' below, and I'll send you my complete 5-step playbook index directly tomorrow morning!`;
    return res.json({ text: fallbackText });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft a professional viral coaching post on the topic "${topic || 'mindset and execution'}". It must include a hook, an educational segment with bullet points, and an auto-responder "DM CTA" or keyword comment offer (e.g. comment 'READY' or 'PLAYBOOK' to trigger automation). keep it inspiring, clear, and ready to go for linkedin organic outbound.`,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error in draft-post:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// API Route: Session Notes synthesis
app.post("/api/gemini/summarize", async (req, res) => {
  const { clientName } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Beautiful fallback if API key is not yet set
    const fallbackText = `• Reviewed direct growth targets for ${clientName || 'the client'} with major milestone updates.\n• Finalized organization playbook outlining team alignment timelines by mid-month.\n• Action Item: Onboard three executive directors using the personalized onboarding kit.\n• Action Item: Map out calendar sequences with clear feedback markers before the next session.`;
    return res.json({ notes: fallbackText });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a concise and highly professional coaching session summary and action items list for the client named "${clientName || 'Client'}". Focus on realistic business parameters, goals discussed, and clear chronological action checkpoints. Keep it formatted with clean bullet points.`,
    });

    res.json({ notes: response.text });
  } catch (error) {
    console.error("Gemini API Error in summarize:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Setup Vite Dev Server / Static Asset Flow
async function initializeApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CoachOS Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

initializeApp().catch((err) => {
  console.error("Failed to start CoachOS server:", err);
});
