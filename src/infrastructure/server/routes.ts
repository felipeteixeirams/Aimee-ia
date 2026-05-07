import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { logger } from "../../lib/logger.js";
import { config } from "../../lib/config.js";
import { NotificationType, type NotificationPayload } from "../../types/index.js";
import { EmailService } from "../../services/EmailService.js";
import { AimeeOrchestrator } from "../../infrastructure/llm/AimeeOrchestrator.js";
import { container } from "../../infrastructure/container.js";
import { validateRequest } from "./middlewares.js";
import { aiRequestSchema, notificationSchema, supportSchema } from "../../types/schemas.js";
import { oauth2Client, GOOGLE_CALENDAR_SCOPES } from "./googleAuth.js";
import { google } from "googleapis";

export default async function (fastify: FastifyInstance) {
  // Health check endpoint
  fastify.get("/health", async () => {
    const orchestrator = container.resolve(AimeeOrchestrator);
    const health = await orchestrator.checkHealth();
    return { 
      status: health.ok ? "healthy" : "unhealthy", 
      providers: health.providers,
      timestamp: new Date().toISOString() 
    };
  });

  // Google OAuth Configuration
  fastify.get("/auth/google/url", async () => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_CALENDAR_SCOPES,
      prompt: 'consent'
    });
    return { url };
  });

  fastify.get("/auth/google/callback", async (req: FastifyRequest<{ Querystring: { code: string } }>, reply: FastifyReply) => {
    const { code } = req.query;
    if (!code) {
      reply.status(400).send("Código não fornecido");
      return;
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      reply.type('text/html').send(`
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
      reply.status(500).send("Erro na autenticação");
    }
  });

  // Email Notification Route
  fastify.post("/notify", { preHandler: validateRequest(notificationSchema) }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { type, email, name, days } = req.body as any;
    
    try {
      const emailService = container.resolve(EmailService);
      switch (type) {
        case NotificationType.REQUEST:
          await emailService.sendRegistrationRequestEmail(email, name);
          break;
        case NotificationType.APPROVE:
          await emailService.sendApprovalEmail(email, name);
          break;
        case NotificationType.REJECT:
          await emailService.sendRejectionEmail(email, name);
          break;
        case NotificationType.BLOCK:
          await emailService.sendBlockedEmail(email, name, days || 5);
          break;
        default:
          reply.status(400).send({ error: "Invalid notification type" });
          return;
      }
      return { success: true };
    } catch (error: any) {
      logger.error("Email API Error", { error: error.message, recipient: email, type });
      reply.status(500).send({ success: false, error: "Failed to send email notification" });
    }
  });

  // AI Route
  fastify.post("/ai", { preHandler: validateRequest(aiRequestSchema) }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { prompt, history, persona, context, audio, provider } = req.body as any;

    try {
      const orchestrator = container.resolve(AimeeOrchestrator);
      const contextString = `
[CONTEXTO ATUAL]
Tarefas: ${JSON.stringify(context.tasks || [])}
Finanças: ${JSON.stringify(context.finance || [])}
Compras: ${JSON.stringify(context.shopping || [])}
`;
      
      const fullPrompt = `${prompt}\n\n${contextString}`;
      const result = await orchestrator.processRequest(fullPrompt, history, persona, audio, provider);
      return result;
    } catch (error: any) {
      logger.error("Server AI Error", { 
        message: error.message,
        stack: error.stack 
      });
      reply.status(500).send({ error: error.message || "Internal AI Error" });
    }
  });

  // Google Places Proxy Route
  fastify.get("/location/nearby-markets", async (req: FastifyRequest<{ Querystring: { lat: string, lng: string } }>, reply: FastifyReply) => {
    const { lat, lng } = req.query;
    const apiKey = config.google.mapsApiKey;

    if (!apiKey) {
      reply.status(500).send({ error: "Chave da API do Google Maps não configurada." });
      return;
    }

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

      return { results };
    } catch (error: any) {
      logger.error("Nearby Markets Error", { error: error.message });
      reply.status(500).send({ error: "Erro ao buscar mercados próximos." });
    }
  });

  // Calendar Management Routes
  fastify.post("/calendar/events", async (req: FastifyRequest, reply: FastifyReply) => {
    const { tokens, event } = req.body as any;
    if (!tokens || !event) {
      reply.status(400).send("Faltam parâmetros");
      return;
    }

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

      return response.data;
    } catch (error: any) {
      logger.error("Calendar Insert Error", { error: error.message });
      reply.status(500).send({ error: error.message });
    }
  });

  fastify.put("/calendar/events/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const { tokens, event } = req.body as any;
    const { id } = req.params as any;
    
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

      return response.data;
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete("/calendar/events/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const { tokens } = req.body as any;
    const { id } = req.params as any;
    
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      await calendar.events.delete({ calendarId: 'primary', eventId: id });
      return { success: true };
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Support Route
  fastify.post("/support/message", { preHandler: validateRequest(supportSchema) }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, message } = req.body as any;
    
    try {
      const emailService = container.resolve(EmailService);
      await emailService.sendSupportEmail(email, message.substring(0, 100));
      return { success: true };
    } catch (error: any) {
      logger.error("Support API Error", { error: error.message });
      reply.status(500).send({ error: "Erro ao enviar mensagem de suporte." });
    }
  });
}
