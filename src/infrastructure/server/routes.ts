import { Router } from "express";
import { logger } from "../../lib/logger.ts";
import { config } from "../../lib/config.ts";
import { NotificationType, type NotificationPayload } from "../../types/index.ts";
import { 
  sendRegistrationRequestEmail, 
  sendApprovalEmail, 
  sendRejectionEmail, 
  sendBlockedEmail 
} from "../../services/emailService.ts";
import { AimeeOrchestrator } from "../../infrastructure/llm/AimeeOrchestrator.ts";
import { oauth2Client, GOOGLE_CALENDAR_SCOPES } from "./googleAuth.ts";
import { google } from "googleapis";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Google OAuth Configuration
router.get("/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_CALENDAR_SCOPES,
    prompt: 'consent'
  });
  res.json({ url });
});

router.get(["/auth/google/callback", "/auth/google/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Código não fornecido");

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
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

// Email Notification Route
router.post("/notify", async (req, res) => {
  const { type, email, name, days } = req.body as NotificationPayload;
  
  if (!email || !type || !name) {
    logger.warn('Invalid notification payload received', { payload: req.body });
    return res.status(400).json({ error: "Missing required fields: email, type, and name are required." });
  }

  try {
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
        return res.status(400).json({ error: "Invalid notification type" });
    }
    res.json({ success: true });
  } catch (error: any) {
    logger.error("Email API Error", { error: error.message, recipient: email, type });
    res.status(500).json({ success: false, error: "Failed to send email notification" });
  }
});

// AI Route
router.post("/ai", async (req, res) => {
  const { prompt, history, persona, context, audio } = req.body;

  try {
    const apiKey = config.geminiApiKey;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY não configurada." });

    const orchestrator = new AimeeOrchestrator(apiKey);
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
router.get("/location/nearby-markets", async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = config.google.mapsApiKey;

  if (!apiKey) return res.status(500).json({ error: "Chave da API do Google Maps não configurada." });

  try {
    const radius = 2000;
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
router.post("/calendar/events", async (req, res) => {
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
        end: { dateTime: new Date(new Date(event.date).getTime() + 3600000).toISOString() },
      },
    });

    res.json(response.data);
  } catch (error: any) {
    logger.error("Calendar Insert Error", { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put("/calendar/events/:id", async (req, res) => {
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

router.delete("/calendar/events/:id", async (req, res) => {
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

export default router;
