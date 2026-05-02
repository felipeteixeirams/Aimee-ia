import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";
import { logger } from "./src/lib/logger.ts";
import { config, validateConfig } from "./src/lib/config.ts";
import { NotificationType, type NotificationPayload } from "./src/types/index.ts";

dotenv.config();

// Centralized configuration and validation
validateConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

import { google } from "googleapis";

// Google OAuth Configuration
const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

// Auth URL Route
app.get("/api/auth/google/url", (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces showing the consent screen to get refresh_token
  });

  res.json({ url });
});

// OAuth Callback Route
app.get(["/api/auth/google/callback", "/api/auth/google/callback/"], async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Código não fornecido");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    
    // Send success message to parent window and close popup
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                source: 'google_calendar',
                tokens: ${JSON.stringify(tokens)} 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Autenticação do Google Calendar concluída com sucesso. Esta janela fechará automaticamente.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    logger.error("OAuth Callback Error", { error: error.message });
    res.status(500).send("Erro na autenticação");
  }
});

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
  const { prompt, history, persona, context, audio } = req.body;

  try {
    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada." });
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
    
    const result = await orchestrator.processRequest(fullPrompt, history, persona, audio);
    res.json(result);
  } catch (error: any) {
    logger.error("Server AI Error", { error: error.message });
    res.status(500).json({ error: error.message || "Internal AI Error" });
  }
});

// Google Places Proxy Route
app.get("/api/location/nearby-markets", async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = config.google.mapsApiKey;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave da API do Google Maps não configurada." });
  }

  try {
    const radius = 2000; // 2km
    const type = "supermarket";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Maps API Error: ${data.status} ${data.error_message || ""}`);
    }

    const results = data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      placeId: place.place_id,
      distance: "Calcular"
    }));

    res.json({ results });
  } catch (error: any) {
    logger.error("Nearby Markets Error", { error: error.message });
    res.status(500).json({ error: "Erro ao buscar mercados próximos." });
  }
});

// Calendar Management Routes
app.post("/api/calendar/events", async (req, res) => {
  const { tokens, event } = req.body;
  if (!tokens || !event) return res.status(400).send("Faltam parâmetros");

  try {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description,
        start: { dateTime: event.date },
        end: { dateTime: new Date(new Date(event.date).getTime() + 3600000).toISOString() }, // Default 1h
      },
    });

    res.json(response.data);
  } catch (error: any) {
    logger.error("Calendar Insert Error", { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/calendar/events/:id", async (req, res) => {
  const { tokens, event } = req.body;
  const { id } = req.params;
  
  try {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: id,
      requestBody: {
        summary: event.title,
        description: event.description,
        start: { dateTime: event.date },
        end: { dateTime: new Date(new Date(event.date).getTime() + 3600000).toISOString() },
      },
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/calendar/events/:id", async (req, res) => {
  const { tokens } = req.body;
  const { id } = req.params;
  
  try {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    await calendar.events.delete({ calendarId: 'primary', eventId: id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
