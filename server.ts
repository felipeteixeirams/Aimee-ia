import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Email Notification Route
app.post("/api/notify", async (req, res) => {
  const { type, email, name, days } = req.body;
  
  try {
    const { 
      sendRegistrationRequestEmail, 
      sendApprovalEmail, 
      sendRejectionEmail, 
      sendBlockedEmail 
    } = await import("./src/services/emailService.ts");

    switch (type) {
      case 'request':
        await sendRegistrationRequestEmail(email, name);
        break;
      case 'approve':
        await sendApprovalEmail(email, name);
        break;
      case 'reject':
        await sendRejectionEmail(email, name);
        break;
      case 'block':
        await sendBlockedEmail(email, name, days || 5);
        break;
      default:
        return res.status(400).json({ error: "Invalid notification type" });
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Email API Error:", error);
    // Even if email fails, we don't want to break the app flow
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Route
app.post("/api/ai", async (req, res) => {
  const { prompt, history, persona, provider, tools } = req.body;

  try {
    if (provider === "deepseek") {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: persona },
            ...history,
            { role: "user", content: prompt }
          ],
          tools: tools,
          tool_choice: "auto"
        })
      });

      const data = await response.json();
      res.json(data.choices[0].message);
    } else {
      res.status(400).json({ error: "Gemini deve ser chamado pelo frontend." });
    }
  } catch (error: any) {
    console.error("Server AI Error:", error);
    res.status(500).json({ error: error.message || "Internal AI Error" });
  }
});

async function setupVite() {
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
}

async function startServer() {
  try {
    await setupVite();
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
