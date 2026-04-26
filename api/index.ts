import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";
import { logger } from "../src/lib/logger.js";

dotenv.config();

// Validate critical environment variables
const criticalEnvVars = [
  'GEMINI_API_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'ADMIN_EMAIL'
];

const missingEnvVars = criticalEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  logger.warn('Missing server-side environment variables', { missingEnvVars });
} else {
  logger.info('Server environment variables validated');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Email Notification Route
app.post("/api/notify", async (req, res) => {
  const { type, email, name, days } = req.body;
  
  logger.info('Email notification requested', { type, recipient: email });
  
  try {
    const { 
      sendRegistrationRequestEmail, 
      sendApprovalEmail, 
      sendRejectionEmail, 
      sendBlockedEmail 
    } = await import("../src/services/emailService.ts");

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
    // Only serve static files if NOT on Vercel (Vercel provides its own static serving)
    if (!process.env.VERCEL) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        res.sendFile(indexPath);
      });
    }
  }
}

async function startServer() {
  try {
    await setupVite();
    
    // In Vercel, we don't need to call listen, it's handled by the serverless wrapper
    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 3000;
      app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}

startServer();

export default app;
