import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";
import { logger } from "./src/lib/logger.ts";
import { NotificationType, type NotificationPayload } from "./src/types/index.ts";

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
  const { type, email, name, days } = req.body as NotificationPayload;
  
  if (!email || !type || !name) {
    logger.warn('Invalid notification payload received', { payload: req.body });
    return res.status(400).json({ error: "Missing required fields: email, type, and name are required." });
  }

  logger.info('Email notification requested', { type, recipient: email });
  
  try {
    const { 
      sendRegistrationRequestEmail, 
      sendApprovalEmail, 
      sendRejectionEmail, 
      sendBlockedEmail 
    } = await import("./src/services/emailService.ts");

    switch (type) {
      case NotificationType.REQUEST:
        await sendRegistrationRequestEmail(email, name);
        break;
      case NotificationType.APPROVE:
        await sendApprovalEmail(email, name);
        break;
      case NotificationType.REJECT:
        await sendRejectionEmail(email, name);
        break;
      case NotificationType.BLOCK:
        await sendBlockedEmail(email, name, days || 5);
        break;
      default:
        logger.error('Unhandled notification type', { type });
        return res.status(400).json({ error: "Invalid notification type" });
    }
    res.json({ success: true });
  } catch (error: any) {
    logger.error("Email API Error", { error: error.message, recipient: email, type });
    res.status(500).json({ success: false, error: "Failed to send email notification" });
  }
});

// AI Route
app.post("/api/ai", async (req, res) => {
  const { prompt, history, persona, context } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no configured." });
    }

    const { AimeeOrchestrator } = await import("./src/infrastructure/llm/AimeeOrchestrator.ts");
    const orchestrator = new AimeeOrchestrator(apiKey);

    // Enriquecer o prompt com o contexto recebido
    const contextString = `
[CONTEXTO ATUAL]
Tarefas: ${JSON.stringify(context.tasks || [])}
Finanças: ${JSON.stringify(context.finance || [])}
Compras: ${JSON.stringify(context.shopping || [])}
`;
    
    const fullPrompt = `${prompt}\n\n${contextString}`;
    
    const result = await orchestrator.processRequest(fullPrompt, history, persona);
    res.json(result);
  } catch (error: any) {
    logger.error("Server AI Error", { error: error.message });
    res.status(500).json({ error: error.message || "Internal AI Error" });
  }
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Server Error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: "Internal Server Error" });
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
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath);
    });
  }
}

async function startServer() {
  try {
    await setupVite();
    
    const PORT = process.env.PORT || 3000;
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
