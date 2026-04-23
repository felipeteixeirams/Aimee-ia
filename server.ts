import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // AI Route
  app.post("/api/ai", async (req, res) => {
    const { prompt, history, persona, provider, tools } = req.body;

    try {
      if (provider === "deepseek") {
        const deepseek = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: "https://api.deepseek.com",
        });

        const response = await deepseek.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: persona },
            ...history,
            { role: "user", content: prompt }
          ],
          tools: tools,
          tool_choice: "auto"
        });

        res.json(response.choices[0].message);
      } else {
        res.status(400).json({ error: "Gemini deve ser chamado pelo frontend." });
      }
    } catch (error: any) {
      console.error("Server AI Error:", error);
      const status = error?.status || 500;
      const message = error?.message || "Internal AI Error";
      
      // If balance is insufficient, return a 402 with the specific message
      if (status === 402 || message.includes("Insufficient Balance")) {
        return res.status(402).json({ error: "Insufficient Balance: O provedor está sem créditos." });
      }
      
      res.status(status).json({ error: message });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
