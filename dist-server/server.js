var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// server.ts
import "reflect-metadata";
import Fastify from "fastify";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import middie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

// src/lib/logger.ts
var Logger = class _Logger {
  constructor() {
    this.isDevelopment = typeof process !== "undefined" && process.env.NODE_ENV !== "production" || typeof import.meta.env !== "undefined" && import.meta.env.DEV;
  }
  static getInstance() {
    if (!_Logger.instance) {
      _Logger.instance = new _Logger();
    }
    return _Logger.instance;
  }
  generateTraceId() {
    return Math.random().toString(36).substring(2, 15);
  }
  log(entry) {
    const context = entry.context || {};
    if (context.error instanceof Error) {
      context.error = {
        message: context.error.message,
        stack: context.error.stack,
        name: context.error.name,
        code: context.error.code
      };
    }
    const fullEntry = {
      severity: entry.level.toUpperCase(),
      // Google Cloud standard
      level: entry.level,
      message: entry.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      traceId: entry.traceId || this.generateTraceId(),
      userId: entry.userId,
      ...context
    };
    if (this.isDevelopment) {
      const color = {
        info: "\x1B[32m",
        // Green
        warn: "\x1B[33m",
        // Yellow
        error: "\x1B[31m",
        // Red
        debug: "\x1B[34m"
        // Blue
      }[entry.level];
      console.log(
        `${color}[${entry.level.toUpperCase()}]\x1B[0m [${fullEntry.timestamp}] ${entry.message}`,
        entry.context ? "\nContext:" : "",
        entry.context || ""
      );
    } else {
      try {
        console.log(JSON.stringify(fullEntry));
      } catch (err) {
        console.log(JSON.stringify({
          severity: "ERROR",
          level: "error",
          message: "Failed to stringify log entry",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          originalMessage: entry.message
        }));
      }
    }
  }
  info(message, context, userId) {
    this.log({ level: "info", message, context, userId });
  }
  warn(message, context, userId) {
    this.log({ level: "warn", message, context, userId });
  }
  error(message, context, userId) {
    this.log({ level: "error", message, context, userId });
  }
  debug(message, context, userId) {
    this.log({ level: "debug", message, context, userId });
  }
};
var logger = Logger.getInstance();

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "aimee-db9b3",
  appId: "1:317073273380:web:c87faeeaf141201e5c1eb1",
  apiKey: "AIzaSyDk69QVZqrm_qhMpynlQ41NoVMvrjF2HGo",
  authDomain: "aimee-db9b3.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-a42d197f-b2fd-4ea3-b5d9-b3b02ea6b201",
  storageBucket: "aimee-db9b3.firebasestorage.app",
  messagingSenderId: "317073273380",
  measurementId: ""
};

// src/lib/config.ts
var isServer = typeof window === "undefined";
function getEnv(key, defaultValue = "") {
  if (isServer) {
    return process.env[key] || defaultValue;
  }
  return import.meta.env[key] || window.process?.env?.[key] || defaultValue;
}
function getViteEnv(key, defaultValue = "") {
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  if (isServer) {
    return process.env[viteKey] || process.env[key] || defaultValue;
  }
  return import.meta.env[viteKey] || defaultValue;
}
var isValidKey = (key) => {
  if (!key) return false;
  const k = key.trim();
  const lowerK = k.toLowerCase();
  return k.length > 10 && !lowerK.includes("your-") && !lowerK.includes("chave-") && !lowerK.includes("placeholder");
};
var rawGeminiKey = getEnv("GEMINI_API_KEY")?.trim();
var rawDeepseekKey = getEnv("DEEPSEEK_API_KEY")?.trim();
var rawOpenaiKey = getEnv("OPENAI_API_KEY")?.trim();
var rawAnthropicKey = getEnv("ANTHROPIC_API_KEY")?.trim();
var config = {
  env: getEnv("NODE_ENV", "development"),
  isProduction: getEnv("NODE_ENV") === "production",
  isDevelopment: getEnv("NODE_ENV") !== "production",
  geminiApiKey: isValidKey(rawGeminiKey) ? rawGeminiKey : "",
  deepseekApiKey: isValidKey(rawDeepseekKey) ? rawDeepseekKey : "",
  openaiApiKey: isValidKey(rawOpenaiKey) ? rawOpenaiKey : "",
  anthropicApiKey: isValidKey(rawAnthropicKey) ? rawAnthropicKey : "",
  firebase: {
    apiKey: getViteEnv("FIREBASE_API_KEY") || firebase_applet_config_default.apiKey || "",
    authDomain: getViteEnv("FIREBASE_AUTH_DOMAIN") || firebase_applet_config_default.authDomain || "",
    projectId: getViteEnv("FIREBASE_PROJECT_ID") || firebase_applet_config_default.projectId || "",
    storageBucket: getViteEnv("FIREBASE_STORAGE_BUCKET") || firebase_applet_config_default.storageBucket || "",
    messagingSenderId: getViteEnv("FIREBASE_MESSAGING_SENDER_ID") || firebase_applet_config_default.messagingSenderId || "",
    appId: getViteEnv("FIREBASE_APP_ID") || firebase_applet_config_default.appId || "",
    measurementId: getViteEnv("FIREBASE_MEASUREMENT_ID") || firebase_applet_config_default.measurementId || "",
    databaseId: getViteEnv("FIREBASE_DATABASE_ID") || firebase_applet_config_default.firestoreDatabaseId || ""
  },
  firebaseAdmin: {
    projectId: getEnv("FIREBASE_PROJECT_ID") || firebase_applet_config_default.projectId || "",
    clientEmail: getEnv("FIREBASE_CLIENT_EMAIL") || "",
    privateKey: getEnv("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n") || ""
  },
  appUrl: getEnv("APP_URL", "http://localhost:3000"),
  port: parseInt(getEnv("PORT", "3000"), 10),
  email: {
    host: getEnv("SMTP_HOST", "smtp.gmail.com"),
    port: parseInt(getEnv("SMTP_PORT", "587"), 10),
    user: getEnv("SMTP_USER"),
    pass: getEnv("SMTP_PASS"),
    adminEmail: getEnv("ADMIN_EMAIL")
  },
  google: {
    clientId: getEnv("GOOGLE_OAUTH_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    redirectUri: getEnv("GOOGLE_OAUTH_REDIRECT_URI"),
    mapsApiKey: getViteEnv("GOOGLE_MAPS_API_KEY")
  }
};
function validateConfig() {
  const missingCritical = [];
  const missingRecommended = [];
  const hasAnyAiKey = config.geminiApiKey || config.deepseekApiKey || config.openaiApiKey || config.anthropicApiKey;
  if (!hasAnyAiKey && isServer) {
    missingCritical.push("GEMINI_API_KEY ou OPENAI_API_KEY ou DEEPSEEK_API_KEY");
  }
  if (!config.firebase.apiKey) missingCritical.push("FIREBASE_API_KEY");
  if (!config.firebase.projectId) missingCritical.push("FIREBASE_PROJECT_ID");
  if (isServer) {
    if (!config.email.user) missingCritical.push("SMTP_USER");
    if (!config.email.pass) missingCritical.push("SMTP_PASS");
    if (!config.email.adminEmail) missingCritical.push("ADMIN_EMAIL");
  }
  if (missingCritical.length > 0) {
    const errorDetail = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      missing: missingCritical,
      context: isServer ? "BACKEND" : "FRONTEND",
      remediation: isServer ? "Verifique o arquivo .env ou as vari\xE1veis de ambiente do seu provedor de nuvem." : "Verifique se as vari\xE1veis VITE_* est\xE3o corretamente definidas e expostas."
    };
    logger.error("\u26A0\uFE0F FALHA NA CONFIGURA\xC7\xC3O (AVISO) \u26A0\uFE0F", errorDetail);
    if (config.isProduction || isServer) {
      console.warn("\n\n" + "!".repeat(50));
      console.warn("CONFIGURA\xC7\xC3O INCOMPLETA: O sistema pode apresentar falhas em algumas funcionalidades.");
      console.warn(JSON.stringify(errorDetail, null, 2));
      console.warn("!".repeat(50) + "\n\n");
    }
    return false;
  }
  if (!config.google.mapsApiKey) {
    logger.warn("Google Maps API Key missing. Nearby markets feature will be disabled.");
  }
  if (missingRecommended.length > 0) {
    logger.warn("Recommended configuration missing", { missingVars: missingRecommended, isServer });
  }
  logger.info("Configuration validated successfully", { env: config.env, isServer });
  return true;
}

// src/infrastructure/server/middlewares.ts
import { z } from "zod";
var validateRequest = (schema) => {
  return async (req) => {
    try {
      await schema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw {
          statusCode: 400,
          error: "Erro de valida\xE7\xE3o",
          details: error.issues.map((e) => ({ path: e.path, message: e.message }))
        };
      }
      throw error;
    }
  };
};
var requestLogger = async (req, reply) => {
  const start = Date.now();
  reply.raw.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
};
var globalErrorHandler = (error, req, reply) => {
  const statusCode = error.statusCode || 500;
  logger.error("Server Error", {
    error: error.message,
    statusCode,
    path: req.url,
    method: req.method,
    stack: error.stack
  });
  reply.status(statusCode).send({
    error: statusCode === 500 ? "Internal Server Error" : error.message,
    details: error.details
  });
};

// src/models/index.ts
import { z as z2 } from "zod";
var TabEnum = z2.enum(["chat", "finance", "shopping", "routines", "settings"]);
var PeriodEnum = z2.enum(["7d", "30d", "all", "custom"]);
var FinancialGoalCategory = {
  TRAVEL: "travel",
  RENOVATION: "renovation",
  EDUCATION: "education",
  EMERGENCY: "emergency",
  OTHER: "other"
};
var FinancialGoalSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string(),
  title: z2.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio").max(100),
  targetAmount: z2.number().positive("Valor alvo deve ser positivo"),
  currentAmount: z2.number().min(0, "Valor atual n\xE3o pode ser negativo"),
  deadline: z2.string().optional(),
  category: z2.nativeEnum(FinancialGoalCategory),
  createdAt: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data de cria\xE7\xE3o inv\xE1lida" })
});
var UserRole = { ADMIN: "admin", USER: "user" };
var UserStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  BLOCKED: "blocked"
};
var AIRecommendedPersona = {
  FUNNY: "funny",
  ANALYTICAL: "analytical",
  FRUGAL: "frugal"
};
var AimeeSuggestionSchema = z2.object({
  id: z2.string(),
  type: z2.enum(["shopping", "finance", "routine"]),
  title: z2.string(),
  description: z2.string().optional(),
  actionValue: z2.string(),
  icon: z2.string().optional()
});
var UserProfileSchema = z2.object({
  uid: z2.string(),
  displayName: z2.string().min(1, "Nome \xE9 obrigat\xF3rio"),
  email: z2.string().email("Email inv\xE1lido"),
  username: z2.string().optional(),
  nickname: z2.string().optional(),
  displayPreference: z2.enum(["fullName", "nickname"]).optional(),
  pendingNameChange: z2.object({
    newName: z2.string(),
    requestedAt: z2.string(),
    status: z2.enum(["pending", "approved", "rejected"])
  }).optional().nullable(),
  bio: z2.string().max(500).optional(),
  role: z2.nativeEnum(UserRole).optional(),
  status: z2.nativeEnum(UserStatus),
  blockedUntil: z2.string().optional(),
  selectedPersona: z2.nativeEnum(AIRecommendedPersona).optional(),
  avatarUrl: z2.string().optional().or(z2.literal("")),
  photoUrl: z2.string().optional().or(z2.literal("")),
  theme: z2.enum(["light", "dark", "system"]).optional(),
  themeColor: z2.enum(["blue", "rose", "emerald", "violet", "amber", "neutral"]).optional(),
  preferences: z2.object({
    currency: z2.string(),
    notificationsEnabled: z2.boolean()
  }),
  gamification: z2.object({
    points: z2.number().min(0),
    level: z2.number().min(1),
    badges: z2.array(z2.string()),
    weeklyGoal: z2.number().optional(),
    currentWeeklySpending: z2.number().min(0)
  }),
  healthGoals: z2.object({
    dietType: z2.enum(["balanced", "low-sugar", "vegan", "keto", "none"]),
    focus: z2.array(z2.string())
  }).optional(),
  location: z2.object({
    city: z2.string(),
    region: z2.string()
  }).optional(),
  calendarConnected: z2.boolean().optional(),
  googleCalendarEmail: z2.string().optional(),
  aimeeMetadata: z2.object({
    lastStrategicInsightAt: z2.string().optional(),
    suggestions: z2.array(AimeeSuggestionSchema)
  }).optional()
});
var TransactionType = { INCOME: "income", EXPENSE: "expense" };
var TransactionSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string().optional(),
  amount: z2.number().min(0, "O valor n\xE3o pode ser negativo").optional().default(0),
  type: z2.nativeEnum(TransactionType),
  category: z2.string().min(1, "Categoria \xE9 obrigat\xF3ria").optional().default("others"),
  description: z2.string().max(200).optional().or(z2.literal("")),
  date: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Formato de data inv\xE1lido" }).optional(),
  createdAt: z2.string().optional()
});
var ItemUrgency = { LOW: "low", MEDIUM: "medium", HIGH: "high" };
var ShoppingItemSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string().optional(),
  name: z2.string().min(1, "Nome \xE9 obrigat\xF3rio"),
  quantity: z2.number().min(0).optional().default(1),
  unit: z2.string().optional().default("un"),
  category: z2.string().optional().default("grocery"),
  purchased: z2.boolean().optional().default(false),
  lastPrice: z2.number().optional(),
  lastPurchasedAt: z2.string().optional(),
  lastDepletedAt: z2.string().optional(),
  urgency: z2.nativeEnum(ItemUrgency).optional().default(ItemUrgency.MEDIUM),
  isStock: z2.boolean().optional().default(false),
  frequency: z2.number().optional(),
  isEcoFriendly: z2.boolean().optional(),
  latitude: z2.number().optional(),
  longitude: z2.number().optional(),
  locationName: z2.string().optional(),
  createdAt: z2.string().optional()
});
var ChatRole = { USER: "user", ASSISTANT: "assistant" };
var ChatMessageSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string(),
  role: z2.nativeEnum(ChatRole),
  content: z2.string(),
  timestamp: z2.string(),
  agentType: z2.string().optional(),
  isInsight: z2.boolean().optional(),
  read: z2.boolean().optional(),
  status: z2.enum(["sending", "sent", "error"]).optional(),
  error: z2.string().optional(),
  actions: z2.array(z2.object({
    id: z2.string(),
    label: z2.string(),
    value: z2.string(),
    type: z2.enum(["button", "link"])
  })).optional()
});
var ShareStatus = { PENDING: "pending", ACCEPTED: "accepted", DECLINED: "declined" };
var PermissionLevel = { NONE: "none", READ: "read", WRITE: "write" };
var ShareSchema = z2.object({
  id: z2.string().optional(),
  ownerId: z2.string(),
  ownerEmail: z2.string(),
  sharedWithEmail: z2.string(),
  sharedWithId: z2.string().optional(),
  permissions: z2.object({
    finance: z2.nativeEnum(PermissionLevel),
    shopping: z2.nativeEnum(PermissionLevel),
    routines: z2.nativeEnum(PermissionLevel)
  }),
  status: z2.nativeEnum(ShareStatus),
  upgradeRequested: z2.boolean().optional(),
  createdAt: z2.string()
});
var TaskCategory = { CLEANING: "cleaning", MAINTENANCE: "maintenance", ERRAND: "errand", OTHER: "other" };
var TaskStatus = { TODO: "todo", DONE: "done" };
var RecurrenceType = { DAILY: "daily", WEEKLY: "weekly", MONTHLY: "monthly", ANNUAL: "annual" };
var TaskRecurrenceSchema = z2.object({
  type: z2.nativeEnum(RecurrenceType),
  interval: z2.number().optional().nullable(),
  daysOfWeek: z2.array(z2.number().min(0).max(6)).optional().nullable(),
  daysOfMonth: z2.array(z2.number().min(1).max(31)).optional().nullable(),
  month: z2.number().min(0).max(11).optional().nullable(),
  endTime: z2.string().optional(),
  isInfinite: z2.boolean().optional().nullable()
});
var HouseholdTaskSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string(),
  title: z2.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio").max(200, "O t\xEDtulo deve ter no m\xE1ximo 200 caracteres"),
  description: z2.string().optional(),
  category: z2.nativeEnum(TaskCategory),
  status: z2.nativeEnum(TaskStatus),
  dueDate: z2.string().optional(),
  time: z2.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora inv\xE1lido (HH:mm)").optional(),
  isAllDay: z2.boolean().optional().default(false),
  assignedTo: z2.string().optional().nullable(),
  participants: z2.array(z2.string()).optional(),
  recurrence: TaskRecurrenceSchema.optional().nullable(),
  recurrenceId: z2.string().optional(),
  originalDueDate: z2.string().optional(),
  note: z2.string().optional(),
  createdAt: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data de cria\xE7\xE3o da tarefa inv\xE1lida" }).optional()
});
var EventType = { SOCIAL: "social", HOLIDAY: "holiday", APPOINTMENT: "appointment" };
var FamilyEventSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string(),
  title: z2.string().min(1, "T\xEDtulo do evento \xE9 obrigat\xF3rio"),
  description: z2.string().optional(),
  date: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data do evento inv\xE1lida" }),
  type: z2.nativeEnum(EventType),
  googleEventId: z2.string().optional(),
  createdAt: z2.string().optional()
});
var AIProvider = { GEMINI: "gemini", DEEPSEEK: "deepseek" };
var NotificationType = { REQUEST: "request", APPROVE: "approve", REJECT: "reject", BLOCK: "block" };
var NotificationPayloadSchema = z2.object({
  type: z2.nativeEnum(NotificationType),
  email: z2.string().email(),
  name: z2.string(),
  days: z2.number().optional()
});
var GlobalConfigSchema = z2.object({
  aiProvider: z2.nativeEnum(AIProvider),
  aimeeAvatarUrl: z2.string().optional(),
  calendarIntegrationEnabled: z2.boolean().optional(),
  updatedAt: z2.string(),
  updatedBy: z2.string()
});
var LLMUsageSchema = z2.object({
  id: z2.string().optional(),
  userId: z2.string(),
  model: z2.string(),
  promptTokens: z2.number().int().min(0),
  completionTokens: z2.number().int().min(0),
  totalTokens: z2.number().int().min(0),
  timestamp: z2.string(),
  context: z2.string().optional()
});
var notificationSchema = z2.object({
  type: z2.nativeEnum(NotificationType),
  email: z2.string().email("E-mail inv\xE1lido"),
  name: z2.string().min(2, "Nome muito curto"),
  days: z2.number().optional()
});
var aiRequestSchema = z2.object({
  prompt: z2.string().min(1, "O prompt n\xE3o pode estar vazio"),
  history: z2.array(z2.any()).default([]),
  persona: z2.string().default("funny"),
  provider: z2.enum(["gemini", "deepseek", "openai"]).optional(),
  userId: z2.string().optional(),
  contextType: z2.string().optional(),
  context: z2.object({
    tasks: z2.array(z2.any()).optional(),
    events: z2.array(z2.any()).optional(),
    user: z2.any().optional(),
    finance: z2.array(z2.any()).optional(),
    shopping: z2.array(z2.any()).optional()
  }).default({}),
  audio: z2.object({
    data: z2.string(),
    mimeType: z2.string()
  }).optional()
});
var supportSchema = z2.object({
  email: z2.string().email("E-mail inv\xE1lido"),
  message: z2.string().min(5, "A mensagem deve ter pelo menos 5 caracteres").max(100, "A mensagem deve ter no m\xE1ximo 100 caracteres")
});

// src/services/EmailService.ts
import "reflect-metadata";
import nodemailer from "nodemailer";
import { singleton } from "tsyringe";
var EmailService = class {
  constructor() {
    this.APP_URL = config.appUrl;
    this.styles = `
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;
    this.headerStyle = `
    font-size: 24px;
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 20px;
  `;
    this.footerStyle = `
    font-size: 14px;
    color: #6b7280;
    margin-top: 40px;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  `;
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }
  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent successfully", {
        messageId: info.messageId,
        recipient: mailOptions.to,
        subject: mailOptions.subject
      });
      return info;
    } catch (error) {
      logger.error("Failed to send email", {
        error: error.message,
        recipient: mailOptions.to,
        subject: mailOptions.subject
      });
      throw error;
    }
  }
  async sendRegistrationRequestEmail(userEmail, userName) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: "Solicita\xE7\xE3o de Registro Recebida \u{1F48C}",
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Ol\xE1, ${userName}! \u2728</h1>
          <p>Recebi sua solicita\xE7\xE3o para fazer parte da nossa jornada inteligente!</p>
          <p>Sou a <strong>Aimee</strong>, e estou muito ansiosa para te ajudar a organizar sua vida financeira, casa e agenda de um jeito leve e proativo.</p>
          <p>Agora, sua solicita\xE7\xE3o foi encaminhada para aprova\xE7\xE3o do administrador do sistema. Assim que tudo for revisado, eu te envio outro e-mail com as boas-vindas oficiais.</p>
          <p>Seja paciente, logo logo estaremos conversando!</p>
          <div style="${this.footerStyle}">
            Com carinho,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `
    };
    return this.sendEmail(mailOptions);
  }
  async sendApprovalEmail(userEmail, userName) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: "Boas-vindas \xE0 Aimee! \u{1F680}",
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Seja bem-vindo(a), ${userName}! \u{1F389}</h1>
          <p>Tenho uma \xF3tima not\xEDcia: sua solicita\xE7\xE3o foi <strong>aprovada</strong> pela nossa equipe!</p>
          <p>Agora voc\xEA j\xE1 pode acessar todo o potencial da Aimee para gerir seu mundo.</p>
          <div style="margin: 30px 0;">
            <a href="${this.APP_URL}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Come\xE7ar agora</a>
          </div>
          <p>Espero por voc\xEA no chat!</p>
          <div style="${this.footerStyle}">
            Com carinho,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `
    };
    return this.sendEmail(mailOptions);
  }
  async sendRejectionEmail(userEmail, userName) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: "Sobre sua solicita\xE7\xE3o de acesso \u{1F4CB}",
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Ol\xE1, ${userName}</h1>
          <p>Analisamos sua solicita\xE7\xE3o e, no momento, ela n\xE3o p\xF4de ser aprovada.</p>
          <p>Geralmente isso acontece quando os dados est\xE3o incompletos ou n\xE3o conseguimos verificar a identidade.</p>
          <p>Mas n\xE3o se preocupe! Voc\xEA pode tentar novamente a qualquer momento, garantindo que todas as informa\xE7\xF5es estejam corretas e reais.</p>
          <div style="margin: 30px 0;">
            <a href="${this.APP_URL}" style="color: #4f46e5; font-weight: 600;">Tentar registro novamente</a>
          </div>
          <div style="${this.footerStyle}">
            Atenciosamente,<br>
            <strong>Aimee - Seu Agente Pessoal</strong>
          </div>
        </div>
      `
    };
    return this.sendEmail(mailOptions);
  }
  async sendSupportEmail(userEmail, message) {
    const adminEmail = config.email.adminEmail || "felipeteixeirams@gmail.com";
    const mailOptions = {
      from: `"Aimee Support" <${config.email.user}>`,
      to: adminEmail,
      subject: `\u{1F6A8} ALERTA DE SISTEMA: Mensagem de Suporte de ${userEmail}`,
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Nova Mensagem de Suporte \u{1F198}</h1>
          <p>O sistema detectou um problema de depend\xEAncia cr\xEDtica ou um usu\xE1rio solicitou suporte atrav\xE9s do fluxo de indisponibilidade.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; font-weight: 600; color: #374151;">Mensagem:</p>
            <p style="margin: 10px 0 0 0; font-size: 16px;">"${message}"</p>
          </div>
          <p><strong>Usu\xE1rio:</strong> ${userEmail}</p>
          <p><strong>Timestamp:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}</p>
          <div style="${this.footerStyle}">
            Este e-mail foi gerado automaticamente pelo n\xFAcleo de resili\xEAncia da Aimee.
          </div>
        </div>
      `
    };
    return this.sendEmail(mailOptions);
  }
  async sendBlockedEmail(userEmail, userName, days) {
    const mailOptions = {
      from: `"Aimee" <${config.email.user}>`,
      to: userEmail,
      subject: "Status da sua conta \u{1F512}",
      html: `
        <div style="${this.styles}">
          <h1 style="${this.headerStyle}">Ol\xE1, ${userName}</h1>
          <p>Sentimos informar, mas sua solicita\xE7\xE3o de registro foi recusada e seu acesso foi temporariamente suspenso.</p>
          <p>Voc\xEA poder\xE1 tentar uma nova solicita\xE7\xE3o em <strong>${days} dias</strong>.</p>
          <p>Agradecemos a compreens\xE3o.</p>
          <div style="${this.footerStyle}">
            Atenciosamente,<br>
            <strong>Aimee - Equipe de Seguran\xE7a</strong>
          </div>
        </div>
      `
    };
    return this.sendEmail(mailOptions);
  }
};
EmailService = __decorateClass([
  singleton()
], EmailService);

// src/infrastructure/llm/AimeeOrchestrator.ts
import "reflect-metadata";
import { singleton as singleton2 } from "tsyringe";

// src/infrastructure/tools/AimeeTools.ts
import { Type } from "@google/genai";
var addTransactionFn = {
  name: "addTransaction",
  description: "Adiciona uma nova transa\xE7\xE3o financeira (gasto ou ganho).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: "Valor da transa\xE7\xE3o" },
      type: { type: Type.STRING, enum: ["income", "expense"], description: "Tipo: income (ganho) ou expense (gasto)" },
      description: { type: Type.STRING, description: "Descri\xE7\xE3o do que foi a transa\xE7\xE3o" },
      category: { type: Type.STRING, description: "Categoria (ex: Alimenta\xE7\xE3o, Lazer)" }
    },
    required: ["amount", "type", "description"]
  }
};
var addShoppingItemsFn = {
  name: "addShoppingItems",
  description: "Adiciona um ou mais itens \xE0 lista de compras ou ao estoque dom\xE9stico.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: "Lista de itens para adicionar",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nome do item" },
            quantity: { type: Type.NUMBER, description: "Quantidade" },
            category: { type: Type.STRING, description: "Categoria do item" },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Urg\xEAncia do item" },
            isStock: { type: Type.BOOLEAN, description: "Se true, adiciona ao estoque dom\xE9stico. Se false, adiciona \xE0 lista de compras." }
          },
          required: ["name"]
        }
      }
    },
    required: ["items"]
  }
};
var updateShoppingItemsFn = {
  name: "updateShoppingItems",
  description: "Atualiza itens da lista de compras ou estoque (ex: marcar como comprado, mover para estoque, mudar urg\xEAncia).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      updates: {
        type: Type.ARRAY,
        description: "Lista de atualiza\xE7\xF5es",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID do item" },
            name: { type: Type.STRING, description: "Nome do item" },
            quantity: { type: Type.NUMBER },
            category: { type: Type.STRING },
            purchased: { type: Type.BOOLEAN },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
            isStock: { type: Type.BOOLEAN, description: "Mover entre lista de compras e estoque" }
          },
          required: ["name"]
        }
      }
    },
    required: ["updates"]
  }
};
var removeShoppingItemsFn = {
  name: "removeShoppingItems",
  description: "Remove um ou mais itens da lista de compras.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: "Lista de itens para remover",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID do item no banco de dados" },
            name: { type: Type.STRING, description: "Nome do item" }
          },
          required: ["name"]
        }
      }
    },
    required: ["items"]
  }
};
var addFinancialGoalFn = {
  name: "addFinancialGoal",
  description: "Cria um novo objetivo financeiro (ex: poupar para viagem, reforma).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "T\xEDtulo do objetivo (ex: Viagem para o Jap\xE3o)" },
      targetAmount: { type: Type.NUMBER, description: "Valor total do objetivo" },
      currentAmount: { type: Type.NUMBER, description: "Valor j\xE1 poupado", default: 0 },
      category: { type: Type.STRING, enum: ["travel", "renovation", "education", "emergency", "other"], description: "Categoria do objetivo" },
      deadline: { type: Type.STRING, description: "Data limite (ISO 8601)" }
    },
    required: ["title", "targetAmount", "category"]
  }
};
var updateFinancialGoalFn = {
  name: "updateFinancialGoal",
  description: "Atualiza o progresso ou detalhes de um objetivo financeiro.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do objetivo" },
      currentAmount: { type: Type.NUMBER, description: "Novo valor total poupado" },
      targetAmount: { type: Type.NUMBER, description: "Novo valor alvo" },
      title: { type: Type.STRING, description: "Novo t\xEDtulo" }
    },
    required: ["id"]
  }
};
var addHouseholdTaskFn = {
  name: "addHouseholdTask",
  description: "Adiciona uma tarefa dom\xE9stica (limpeza, manuten\xE7\xE3o, recado).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "T\xEDtulo da tarefa" },
      description: { type: Type.STRING, description: "Detalhes da tarefa" },
      category: { type: Type.STRING, enum: ["cleaning", "maintenance", "errand", "other"], description: "Categoria" },
      dueDate: { type: Type.STRING, description: "Data limite (ISO 8601)" },
      assignedTo: { type: Type.STRING, description: "Nome da pessoa respons\xE1vel" }
    },
    required: ["title", "category"]
  }
};
var updateHouseholdTaskFn = {
  name: "updateHouseholdTask",
  description: "Atualiza o status ou detalhes de uma tarefa dom\xE9stica.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID da tarefa" },
      status: { type: Type.STRING, enum: ["todo", "done"], description: "Novo status" },
      title: { type: Type.STRING },
      assignedTo: { type: Type.STRING }
    },
    required: ["id"]
  }
};
var addFamilyEventFn = {
  name: "addFamilyEvent",
  description: "Adiciona um evento \xE0 agenda familiar. IMPORTANTE: Antes de adicionar, verifique na lista de eventos se j\xE1 existe um com o mesmo nome. Se o nome for igual mas a data diferente, sugira atualizar o existente em vez de criar um novo. Se o nome for 80% semelhante, questione o usu\xE1rio se n\xE3o \xE9 o mesmo evento antes de prosseguir.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "T\xEDtulo do evento" },
      description: { type: Type.STRING },
      date: { type: Type.STRING, description: "Data do evento (ISO 8601)" },
      type: { type: Type.STRING, enum: ["social", "holiday", "appointment"], description: "Tipo de evento" }
    },
    required: ["title", "date", "type"]
  }
};
var removeFamilyEventFn = {
  name: "removeFamilyEvent",
  description: "Remove um evento da agenda familiar pelo seu ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do evento a ser removido" }
    },
    required: ["id"]
  }
};
var updateFamilyEventFn = {
  name: "updateFamilyEvent",
  description: "Atualiza detalhes de um evento existente na agenda (data, t\xEDtulo, descri\xE7\xE3o, tipo).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do evento a ser atualizado" },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      date: { type: Type.STRING, description: "Nova data do evento (ISO 8601)" },
      type: { type: Type.STRING, enum: ["social", "holiday", "appointment"] }
    },
    required: ["id"]
  }
};
var getFinancialInsightsFn = {
  name: "getFinancialInsights",
  description: "Solicita uma an\xE1lise profunda dos gastos e sugere economias baseadas no contexto financeiro atual.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      focus: { type: Type.STRING, enum: ["savings", "overspending", "trends"], description: "Foco da an\xE1lise." }
    }
  }
};
var allAimeeTools = [
  addTransactionFn,
  addShoppingItemsFn,
  updateShoppingItemsFn,
  removeShoppingItemsFn,
  addFinancialGoalFn,
  updateFinancialGoalFn,
  addHouseholdTaskFn,
  updateHouseholdTaskFn,
  addFamilyEventFn,
  removeFamilyEventFn,
  updateFamilyEventFn,
  getFinancialInsightsFn
];

// src/infrastructure/llm/GeminiAdapter.ts
import { GoogleGenAI } from "@google/genai";

// src/domain/intelligence/AimeePrompts.ts
var getAimeeSystemInstruction = (persona = "funny", currentDate) => {
  const base = `Seu nome \xE9 **Aimee**. Voc\xEA \xE9 uma Assistente Pessoal e Consultora Financeira Ultra-Eficiente.

**Data/Hora Atual:** ${currentDate}

**\u{1F525} REGRAS DE OURO (MUITO IMPORTANTE):**
1. **CONCIS\xC3O EXTREMA:** Suas respostas devem ser curtas (m\xE1ximo 2 frases). Nunca mande blocos grandes de texto ou tabelas.
2. **FIDELIDADE TOTAL:** Nunca afirme que "Adicionou" ou "Fez" se n\xE3o tiver disparado a ferramenta (tool call) correspondente no mesmo turno.
3. **FERRAMENTAS PRIMEIRO:** Se o usu\xE1rio pediu para anotar, comprar ou registrar, voc\xEA DEVE usar a ferramenta antes de qualquer texto.
4. **DIRETO AO PONTO:** Elimine sauda\xE7\xF5es excessivas e conclus\xF5es longas.
5. **DADOS REAIS:** Nunca invente gastos ou estimativas. Se n\xE3o houver registro financeiro, apenas relate o que existe (Ex: "Itens adicionados, mas n\xE3o encontrei o gasto correspondente").

**Diretrizes:**
- **Financeiro:** Registre transa\xE7\xF5es (\`addTransaction\`).
- **Compras:** Gerencie a lista (\`addShoppingItems\`).

**Tom de Voz:**`;
  const personalities = {
    funny: `
**Engra\xE7ada e Direta:** Humor de uma linha, seco e divertido.`,
    analytical: `
**Factual e Rob\xF3tica:** Extremamente curta e baseada em dados.`,
    frugal: `
**Vigilante do Dinheiro:** Direta e protetora das economias do usu\xE1rio.`
  };
  return base + (personalities[persona] || personalities.funny) + "\n\nResponda sempre em Portugu\xEAs do Brasil.";
};

// src/infrastructure/llm/GeminiAdapter.ts
var GeminiAdapter = class {
  constructor() {
    this.id = "gemini";
    if (config.geminiApiKey) {
      this.genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }
  isAvailable() {
    return !!this.genAI && !!config.geminiApiKey;
  }
  async generateResponse(request) {
    if (!this.genAI) throw new Error("Gemini API Key n\xE3o configurada.");
    const model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: getAimeeSystemInstruction(request.persona, (/* @__PURE__ */ new Date()).toLocaleString())
    });
    const formattedHistory = request.history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));
    const parts = [{ text: request.prompt }];
    const result = await model.generateContent({
      contents: [...formattedHistory, { role: "user", parts }],
      tools: request.tools ? [{ functionDeclarations: request.tools }] : []
    });
    const response = await result.response;
    const functionCalls = response.functionCalls()?.map((fc) => ({
      name: fc.name,
      args: fc.args
    }));
    return {
      content: response.text(),
      functionCalls,
      provider: this.id,
      usage: response.usageMetadata ? {
        promptTokens: response.usageMetadata.promptTokenCount || 0,
        completionTokens: response.usageMetadata.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata.totalTokenCount || 0,
        model: "gemini-flash-latest"
      } : void 0
    };
  }
};

// src/infrastructure/llm/OpenAICompatibleAdapter.ts
import OpenAI from "openai";
var OpenAICompatibleAdapter = class {
  constructor(id, apiKey, baseURL, modelName) {
    this.id = id;
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.modelName = modelName;
    this.client = null;
    if (apiKey) {
      this.client = new OpenAI({ apiKey, baseURL });
    }
  }
  isAvailable() {
    return !!this.client && !!this.apiKey;
  }
  async generateResponse(request) {
    if (!this.client) throw new Error(`${this.id} API Key n\xE3o configurada.`);
    const systemMessage = {
      role: "system",
      content: getAimeeSystemInstruction(request.persona, (/* @__PURE__ */ new Date()).toLocaleString())
    };
    const messages = [
      systemMessage,
      ...request.history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      })),
      { role: "user", content: request.prompt }
    ];
    const tools = request.tools?.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: this.normalizeSchema(tool.parameters)
      }
    }));
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages,
      tools,
      tool_choice: "auto"
    });
    const choice = response.choices[0].message;
    const functionCalls = choice.tool_calls?.map((tc) => {
      if (tc.type === "function") {
        return {
          name: tc.function.name,
          args: JSON.parse(tc.function.arguments)
        };
      }
      return null;
    }).filter((f) => !!f);
    return {
      content: choice.content || "",
      functionCalls,
      provider: this.id,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
        model: this.modelName
      } : void 0
    };
  }
  normalizeSchema(schema) {
    if (!schema || typeof schema !== "object") return schema;
    const newSchema = { ...schema };
    if (typeof newSchema.type === "string") newSchema.type = newSchema.type.toLowerCase();
    if (newSchema.properties) {
      const newProps = {};
      for (const [key, value] of Object.entries(newSchema.properties)) {
        newProps[key] = this.normalizeSchema(value);
      }
      newSchema.properties = newProps;
    }
    if (newSchema.items) newSchema.items = this.normalizeSchema(newSchema.items);
    return newSchema;
  }
};

// src/infrastructure/llm/DeepSeekAdapter.ts
var DeepSeekAdapter = class extends OpenAICompatibleAdapter {
  constructor() {
    super(
      "deepseek",
      config.deepseekApiKey,
      "https://api.deepseek.com",
      "deepseek-chat"
    );
  }
};

// src/infrastructure/repositories/BaseRepository.ts
import {
  collection,
  doc as doc2,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc as getDoc2,
  getDocs,
  query,
  serverTimestamp
} from "firebase/firestore";

// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  signInWithPopup as signInWithPopup2,
  signOut as signOut2,
  onAuthStateChanged as onAuthStateChanged2,
  GoogleAuthProvider as GoogleAuthProvider2,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
var firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app, config.firebase.databaseId || void 0);
var auth = getAuth(app);
isSupported().then((yes) => yes && getAnalytics(app));
var googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.events.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");
googleProvider.setCustomParameters({
  prompt: "consent"
});

// src/infrastructure/repositories/BaseRepository.ts
import { z as z3 } from "zod";
var BaseRepository = class {
  constructor(collectionPath, schema) {
    this.collectionPath = collectionPath;
    this.schema = schema;
  }
  handleFirestoreError(error, operationType, path2) {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified
      },
      operationType,
      path: path2
    };
    console.error(`Firestore Error [${operationType}] at ${path2}:`, JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  sanitizeData(data) {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === void 0) {
        delete sanitized[key];
      }
    });
    return sanitized;
  }
  async create(data, customUserId) {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usu\xE1rio n\xE3o autenticado para criar documento.");
    if (this.schema) {
      try {
        const validatedData = this.schema.parse({ ...data, userId, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      } catch (error) {
        if (error instanceof z3.ZodError) {
          throw new Error(`Erro de Valida\xE7\xE3o: ${error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
        }
        throw error;
      }
    }
    const path2 = this.collectionPath.replace("{userId}", userId);
    try {
      const docRef = await addDoc(collection(db, path2), {
        ...this.sanitizeData(data),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      this.handleFirestoreError(error, "create" /* CREATE */, path2);
      return "";
    }
  }
  async update(id, data, customUserId) {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usu\xE1rio n\xE3o autenticado para atualizar documento.");
    if (this.schema) {
      try {
        this.schema.partial().parse(data);
      } catch (error) {
        if (error instanceof z3.ZodError) {
          throw new Error(`Erro de Valida\xE7\xE3o (Update): ${error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
        }
        throw error;
      }
    }
    const path2 = this.collectionPath.replace("{userId}", userId);
    const docRef = doc2(db, path2, id);
    try {
      await updateDoc(docRef, {
        ...this.sanitizeData(data),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.handleFirestoreError(error, "update" /* UPDATE */, `${path2}/${id}`);
    }
  }
  async delete(id, customUserId) {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usu\xE1rio n\xE3o autenticado para deletar documento.");
    const path2 = this.collectionPath.replace("{userId}", userId);
    const docRef = doc2(db, path2, id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      this.handleFirestoreError(error, "delete" /* DELETE */, `${path2}/${id}`);
    }
  }
  async getById(id, customUserId) {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usu\xE1rio n\xE3o autenticado.");
    const path2 = this.collectionPath.replace("{userId}", userId);
    const docRef = doc2(db, path2, id);
    try {
      const docSnap = await getDoc2(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      this.handleFirestoreError(error, "get" /* GET */, `${path2}/${id}`);
      return null;
    }
  }
  async list(constraints = [], customUserId) {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usu\xE1rio n\xE3o autenticado.");
    const path2 = this.collectionPath.replace("{userId}", userId);
    try {
      const q = query(collection(db, path2), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc6) => ({ id: doc6.id, ...doc6.data() }));
    } catch (error) {
      this.handleFirestoreError(error, "list" /* LIST */, path2);
      return [];
    }
  }
};

// src/infrastructure/repositories/UsageRepository.ts
var UsageRepository = class extends BaseRepository {
  constructor() {
    super("llm_usage", LLMUsageSchema);
  }
  // Override create to handle the fact that llm_usage is a top-level collection
  // and we don't want to enforce {userId} in the path but we want to store it in data.
  async logUsage(usage) {
    return this.create({
      ...usage,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, usage.userId);
  }
};
var usageRepository = new UsageRepository();

// src/infrastructure/llm/AimeeOrchestrator.ts
import { LRUCache } from "lru-cache";
var AimeeOrchestrator = class {
  constructor() {
    this.providers = /* @__PURE__ */ new Map();
    this.cache = new LRUCache({
      max: 100,
      // Armazena até 100 respostas
      ttl: 1e3 * 60 * 5
      // 5 minutos de cache
    });
    this.initializeProviders();
  }
  initializeProviders() {
    const gemini = new GeminiAdapter();
    if (gemini.isAvailable()) this.providers.set("gemini", gemini);
    const deepseek = new DeepSeekAdapter();
    if (deepseek.isAvailable()) this.providers.set("deepseek", deepseek);
    const openai = new OpenAICompatibleAdapter(
      "openai",
      config.openaiApiKey,
      "https://api.openai.com/v1",
      "gpt-4o"
    );
    if (openai.isAvailable()) this.providers.set("openai", openai);
  }
  async checkHealth() {
    const available = Array.from(this.providers.values()).filter((p) => p.isAvailable()).map((p) => p.id);
    return {
      providers: available,
      ok: available.length > 0
    };
  }
  async processRequest(prompt, history = [], persona = "funny", audio, preferredProvider, userId = "system", contextType = "chat") {
    const cacheKey = JSON.stringify({ prompt, history, persona, preferredProvider });
    if (!audio && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      logger.info("Orchestrator: Cache hit!", { prompt: prompt.substring(0, 30) });
      return {
        content: cached.content,
        usage: { ...cached.usage, cached: true }
      };
    }
    const providersToTry = this.getOrderedProviders(preferredProvider);
    if (providersToTry.length === 0) {
      throw new Error("Nenhum provedor de IA dispon\xEDvel e configurado.");
    }
    let lastError = null;
    for (const providerId of providersToTry) {
      const provider = this.providers.get(providerId);
      if (!provider) continue;
      try {
        logger.info(`Orchestrator: Tentando ${providerId}`);
        const request = {
          prompt,
          history: this.normalizeHistory(history),
          persona,
          tools: allAimeeTools
        };
        const response = await provider.generateResponse(request);
        if (!response.functionCalls || response.functionCalls.length === 0) {
          const cacheKey2 = JSON.stringify({ prompt, history, persona, preferredProvider });
          this.cache.set(cacheKey2, {
            content: response.content,
            usage: response.usage
          });
        }
        if (response.usage && typeof window === "undefined") {
        } else if (response.usage && typeof window !== "undefined") {
          usageRepository.logUsage({
            userId,
            model: response.usage.model,
            promptTokens: response.usage.promptTokens,
            completionTokens: response.usage.completionTokens,
            totalTokens: response.usage.totalTokens,
            context: contextType
          }).catch((err) => logger.error("Falha ao registrar auditoria de tokens", { err }));
        }
        return {
          content: response.content,
          functionCalls: response.functionCalls,
          usage: response.usage
        };
      } catch (error) {
        lastError = error;
        logger.warn(`Orchestrator: Falha em ${providerId}.`, { error: error.message });
      }
    }
    throw lastError || new Error("Falha ao processar com todos os provedores.");
  }
  getOrderedProviders(preferred) {
    const order = /* @__PURE__ */ new Set();
    if (preferred && this.providers.has(preferred)) {
      order.add(preferred);
    }
    ["gemini", "deepseek", "openai"].forEach((id) => {
      if (this.providers.has(id)) order.add(id);
    });
    return Array.from(order);
  }
  normalizeHistory(history) {
    return history.map((h) => ({
      role: h.role === "model" || h.role === "assistant" ? "assistant" : "user",
      content: typeof h.parts?.[0]?.text === "string" ? h.parts[0].text : h.content || ""
    }));
  }
};
AimeeOrchestrator = __decorateClass([
  singleton2()
], AimeeOrchestrator);

// src/infrastructure/container.ts
import "reflect-metadata";
import { container as container2 } from "tsyringe";

// src/infrastructure/repositories/TaskRepository.ts
var TaskRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/tasks", HouseholdTaskSchema);
  }
};
var taskRepository = new TaskRepository();

// src/infrastructure/repositories/TransactionRepository.ts
var TransactionRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/transactions", TransactionSchema);
  }
};
var transactionRepository = new TransactionRepository();

// src/infrastructure/repositories/ShoppingRepository.ts
var ShoppingRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/shoppingList", ShoppingItemSchema);
  }
};
var shoppingRepository = new ShoppingRepository();

// src/infrastructure/repositories/ChatRepository.ts
var ChatRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/chatHistory");
  }
};
var chatRepository = new ChatRepository();

// src/infrastructure/repositories/ProfileRepository.ts
import { doc as doc3, getDoc as getDoc3 } from "firebase/firestore";
var ProfileRepository = class extends BaseRepository {
  constructor() {
    super("users", UserProfileSchema);
  }
  async getProfile(uid) {
    return this.getById(uid, uid);
  }
  async updateProfile(uid, updates) {
    return this.update(uid, updates, uid);
  }
  async getGoogleCredentials(uid) {
    const docRef = doc3(db, "users", uid, "private", "credentials_google");
    const snap = await getDoc3(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  }
};
var profileRepository = new ProfileRepository();

// src/infrastructure/repositories/EventRepository.ts
var EventRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/events", FamilyEventSchema);
  }
};
var eventRepository = new EventRepository();

// src/infrastructure/repositories/ConfigRepository.ts
import { doc as doc4, setDoc } from "firebase/firestore";
var ConfigRepository = class extends BaseRepository {
  constructor() {
    super("config");
  }
  async updateGlobal(updates, updatedBy) {
    const docRef = doc4(db, "config", "global");
    await setDoc(docRef, {
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedBy: updatedBy || "system"
    }, { merge: true });
  }
};
var configRepository = new ConfigRepository();

// src/domain/services/ValidationService.ts
import { z as z4 } from "zod";
var ValidationService = class {
  /**
   * Valida uma transação financeira
   */
  static validateTransaction(data) {
    try {
      TransactionSchema.parse(data);
      if (data.amount <= 0) return "O valor da transa\xE7\xE3o deve ser maior que zero.";
      return null;
    } catch (error) {
      if (error instanceof z4.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join(".")}: ${issue.message}`;
      }
      return "Dados da transa\xE7\xE3o inv\xE1lidos";
    }
  }
  /**
   * Valida uma tarefa doméstica
   */
  static validateTask(data) {
    try {
      HouseholdTaskSchema.parse(data);
      return null;
    } catch (error) {
      if (error instanceof z4.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join(".")}: ${issue.message}`;
      }
      return "Dados da tarefa inv\xE1lidos";
    }
  }
  /**
   * Valida um item de compra
   */
  static validateShoppingItem(data) {
    try {
      ShoppingItemSchema.parse(data);
      if (data.quantity < 0) return "A quantidade n\xE3o pode ser negativa.";
      return null;
    } catch (error) {
      if (error instanceof z4.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join(".")}: ${issue.message}`;
      }
      return "Dados do item inv\xE1lidos";
    }
  }
};

// src/domain/skills/FinanceSkill.ts
var FinanceSkill = class {
  /**
   * Registra uma transação e realiza ações secundárias (como atualizar metas ou alertar orçamentos)
   */
  async recordTransaction(userId, data) {
    logger.info("FinanceSkill: Recording transaction", { userId, amount: data.amount });
    const error = ValidationService.validateTransaction(data);
    if (error) throw new Error(error);
    const transactionId = await transactionRepository.create({
      amount: data.amount || 0,
      type: data.type || "expense",
      description: data.description || "Sem descri\xE7\xE3o",
      category: data.category || "others",
      date: (/* @__PURE__ */ new Date()).toISOString()
    }, userId);
    return transactionId;
  }
  async getSummary(userId) {
    const transactions = await transactionRepository.list([], userId);
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + (t.amount || 0), 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + (t.amount || 0), 0);
    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactionCount: transactions.length
    };
  }
  async getCategoryBreakdown(userId) {
    const transactions = await transactionRepository.list([], userId);
    const expenses = transactions.filter((t) => t.type === "expense");
    const breakdown = {};
    expenses.forEach((t) => {
      const cat = t.category || "others";
      breakdown[cat] = (breakdown[cat] || 0) + (t.amount || 0);
    });
    return breakdown;
  }
  async getSavingsRate(userId) {
    const summary = await this.getSummary(userId);
    if (summary.totalIncome === 0) return 0;
    return summary.balance / summary.totalIncome * 100;
  }
};
var financeSkill = new FinanceSkill();

// src/domain/skills/ShoppingSkill.ts
var ShoppingSkill = class {
  /**
   * Adiciona itens à lista garantindo que duplicados sejam tratados ou incrementados
   */
  async addItems(userId, items) {
    const existingList = await shoppingRepository.list([], userId);
    for (const item of items) {
      const error = ValidationService.validateShoppingItem(item);
      if (error) {
        logger.warn("ShoppingSkill: Skipping invalid item", { item, error });
        continue;
      }
      const existing = existingList.find((i) => i.name.toLowerCase() === item.name?.toLowerCase());
      if (existing && existing.id) {
        await shoppingRepository.update(existing.id, {
          quantity: (existing.quantity || 0) + (item.quantity || 1),
          purchased: false
        }, userId);
      } else {
        await shoppingRepository.create({
          ...item,
          name: item.name || "Item sem nome",
          quantity: item.quantity || 1,
          purchased: false,
          category: item.category || "Outros",
          isStock: item.isStock || false
        }, userId);
      }
    }
  }
  /**
   * Finaliza uma compra, movendo itens para o estoque
   */
  async finalizeShopping(userId) {
    const items = await shoppingRepository.list([], userId);
    const purchased = items.filter((i) => i.purchased && !i.isStock);
    await Promise.all(purchased.map((i) => i.id && shoppingRepository.update(i.id, {
      isStock: true,
      purchased: false,
      lastPurchasedAt: (/* @__PURE__ */ new Date()).toISOString()
    }, userId)));
  }
  async getStockReport(userId) {
    const items = await shoppingRepository.list([], userId);
    const inStock = items.filter((i) => i.isStock);
    const missing = items.filter((i) => !i.isStock && !i.purchased);
    return {
      stockCount: inStock.length,
      missingCount: missing.length,
      criticalItems: inStock.filter((i) => (i.quantity || 0) <= 1)
    };
  }
};
var shoppingSkill = new ShoppingSkill();

// src/lib/recurrenceUtils.ts
import { addDays, addWeeks, addMonths, addYears, isAfter, endOfMonth, setDate, isValid, parseISO } from "date-fns";
function generateRecurrenceInstances(startDateStr, recurrence, limit = 50) {
  const instances = [];
  let current = parseISO(startDateStr);
  if (!isValid(current)) current = /* @__PURE__ */ new Date();
  const endDate = recurrence.endTime ? parseISO(recurrence.endTime) : addYears(current, 1);
  const maxInstances = limit;
  let count = 0;
  while (count < maxInstances && !isAfter(current, endDate)) {
    if (recurrence.type === "daily") {
      instances.push({ dueDate: current.toISOString() });
      current = addDays(current, recurrence.interval || 1);
    } else if (recurrence.type === "weekly") {
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        const weekStart = current;
        for (let i = 0; i < 7; i++) {
          const day = addDays(weekStart, i);
          if (recurrence.daysOfWeek.includes(day.getDay()) && !isAfter(day, endDate)) {
            instances.push({ dueDate: day.toISOString() });
          }
        }
        current = addWeeks(current, 1);
      } else {
        instances.push({ dueDate: current.toISOString() });
        current = addWeeks(current, recurrence.interval || 1);
      }
    } else if (recurrence.type === "monthly") {
      const daysToProcess = recurrence.daysOfMonth && recurrence.daysOfMonth.length > 0 ? recurrence.daysOfMonth : [current.getDate()];
      for (const day of daysToProcess) {
        let targetDate = setDate(current, day);
        const lastDay = endOfMonth(current);
        let note;
        let originalDueDate;
        if (day > lastDay.getDate()) {
          originalDueDate = targetDate.toISOString();
          targetDate = lastDay;
          note = `Data ajustada para o \xFAltimo dia do m\xEAs (originalmente dia ${day})`;
        }
        if (!isAfter(targetDate, endDate)) {
          instances.push({
            dueDate: targetDate.toISOString(),
            originalDueDate,
            note
          });
        }
      }
      current = addMonths(current, recurrence.interval || 1);
    } else if (recurrence.type === "annual") {
      instances.push({ dueDate: current.toISOString() });
      current = addYears(current, recurrence.interval || 1);
    }
    count++;
    if (recurrence.type === "weekly" || recurrence.type === "daily" || recurrence.type === "monthly" || recurrence.type === "annual") {
    } else {
      break;
    }
  }
  return instances.filter((v, i, a) => a.findIndex((t) => t.dueDate === v.dueDate) === i).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

// src/domain/skills/RoutineSkill.ts
var RoutineSkill = class {
  /**
   * Cria uma tarefa, lidando com recorrência se necessário
   */
  async addTask(userId, task) {
    logger.info("RoutineSkill: Adding task", { userId, title: task.title });
    const error = ValidationService.validateTask(task);
    if (error) throw new Error(error);
    if (task.recurrence) {
      const recurrenceId = crypto.randomUUID();
      const startDate = task.dueDate || (/* @__PURE__ */ new Date()).toISOString();
      const instances = generateRecurrenceInstances(startDate, task.recurrence);
      await Promise.all(instances.map((inst) => taskRepository.create({
        ...task,
        dueDate: inst.dueDate,
        originalDueDate: inst.originalDueDate || null,
        note: inst.note || null,
        recurrenceId,
        status: "todo"
      }, userId)));
    } else {
      await taskRepository.create({
        ...task,
        status: "todo"
      }, userId);
    }
  }
  async updateTask(userId, taskId, updates) {
    logger.info("RoutineSkill: Updating task", { userId, taskId });
    await taskRepository.update(taskId, updates, userId);
  }
  async addEvent(userId, event) {
    logger.info("RoutineSkill: Adding event", { userId, title: event.title });
    await eventRepository.create(event, userId);
  }
  async removeEvent(userId, eventId) {
    logger.info("RoutineSkill: Removing event", { userId, eventId });
    await eventRepository.delete(eventId, userId);
  }
  async updateEvent(userId, eventId, updates) {
    logger.info("RoutineSkill: Updating event", { userId, eventId });
    await eventRepository.update(eventId, updates, userId);
  }
  /**
   * Remove tarefas baseadas no escopo (única, seguintes, todas)
   */
  async deleteTaskWithScope(userId, taskId, scope) {
    const taskData = await taskRepository.getById(taskId, userId);
    if (!taskData) return;
    if (scope === "single" || !taskData.recurrenceId) {
      await taskRepository.delete(taskId, userId);
    } else {
      const allTasks = await taskRepository.list([], userId);
      const toDelete = allTasks.filter((t) => {
        if (t.recurrenceId !== taskData.recurrenceId) return false;
        if (scope === "following" && t.dueDate && taskData.dueDate) {
          return new Date(t.dueDate) >= new Date(taskData.dueDate);
        }
        return true;
      });
      await Promise.all(toDelete.map((t) => t.id && taskRepository.delete(t.id, userId)));
    }
  }
  async getRoutineHealth(userId) {
    const tasks = await taskRepository.list([], userId);
    const completed = tasks.filter((t) => t.status === "done");
    const overdue = tasks.filter((t) => t.status === "todo" && t.dueDate && new Date(t.dueDate) < /* @__PURE__ */ new Date());
    return {
      completionRate: tasks.length > 0 ? completed.length / tasks.length * 100 : 0,
      overdueCount: overdue.length,
      totalPending: tasks.filter((t) => t.status === "todo").length
    };
  }
};
var routineSkill = new RoutineSkill();

// src/services/calendarService.ts
import { doc as doc5, setDoc as setDoc2, deleteDoc as deleteDoc2 } from "firebase/firestore";
var calendarService = {
  async fetchGoogleCalendarEvents(accessToken) {
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const apiKey = config.firebase.apiKey;
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime&key=${apiKey}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        const errorBody = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorBody);
        } catch (e) {
          parsedError = { error: { message: errorBody } };
        }
        const serverMsg = parsedError.error?.message || errorBody;
        logger.error("Google Calendar API Error", { status: response.status, serverMsg, details: parsedError });
        throw new Error(`Erro do Google Calendar (${response.status}): ${serverMsg}`);
      }
      const data = await response.json();
      return (data.items || []).map((item) => ({
        title: item.summary || "Evento sem t\xEDtulo",
        description: item.description || "",
        date: item.start.dateTime || item.start.date,
        type: "appointment",
        googleEventId: item.id
      }));
    } catch (error) {
      logger.error("Calendar Service Fetch Error", { error: error.message });
      throw error;
    }
  },
  async saveGoogleCredentials(userId, tokens) {
    try {
      const credRef = doc5(db, "users", userId, "private", "credentials_google");
      await setDoc2(credRef, {
        ...tokens,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }, { merge: true });
      logger.info("CalendarService: Saved Google credentials", { userId });
      return true;
    } catch (error) {
      logger.error("CalendarService: Error saving credentials", { userId, error: error.message });
      throw error;
    }
  },
  async disconnectGoogle(userId) {
    try {
      const credRef = doc5(db, "users", userId, "private", "credentials_google");
      await deleteDoc2(credRef);
      logger.info("CalendarService: Disconnected Google account", { userId });
      return true;
    } catch (error) {
      logger.error("CalendarService: Error disconnecting", { userId, error: error.message });
      throw error;
    }
  },
  async syncEventToGoogle(tokens, event) {
    const response = await fetch("/api/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens, event })
    });
    if (!response.ok) throw new Error("Falha ao sincronizar com Google Calendar");
    return await response.json();
  },
  async updateEventInGoogle(tokens, googleEventId, event) {
    const response = await fetch(`/api/calendar/events/${googleEventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens, event })
    });
    if (!response.ok) throw new Error("Falha ao atualizar no Google Calendar");
    return await response.json();
  },
  async deleteEventFromGoogle(tokens, googleEventId) {
    const response = await fetch(`/api/calendar/events/${googleEventId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens })
    });
    if (!response.ok) throw new Error("Falha ao excluir do Google Calendar");
    return await response.json();
  }
};
var fetchGoogleCalendarEvents = calendarService.fetchGoogleCalendarEvents;

// src/infrastructure/container.ts
container2.registerSingleton(EmailService);
container2.registerSingleton(AimeeOrchestrator);
container2.registerInstance("ChatRepository", chatRepository);
container2.registerInstance("TaskRepository", taskRepository);
container2.registerInstance("TransactionRepository", transactionRepository);
container2.registerInstance("ShoppingRepository", shoppingRepository);
container2.registerInstance("ProfileRepository", profileRepository);
container2.registerInstance("EventRepository", eventRepository);
container2.registerInstance("ConfigRepository", configRepository);
container2.registerInstance("UsageRepository", usageRepository);
container2.registerInstance("FinanceSkill", financeSkill);
container2.registerInstance("ShoppingSkill", shoppingSkill);
container2.registerInstance("RoutineSkill", routineSkill);
container2.registerInstance("CalendarService", calendarService);

// src/infrastructure/server/googleAuth.ts
import { google } from "googleapis";
var oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);
var GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];

// src/infrastructure/server/routes.ts
import { google as google2 } from "googleapis";
async function routes_default(fastify) {
  fastify.get("/health", async (req, reply) => {
    try {
      logger.info("Health check requested");
      const orchestrator = container2.resolve(AimeeOrchestrator);
      const health = await orchestrator.checkHealth();
      return {
        status: health.ok ? "healthy" : "unhealthy",
        providers: health.providers,
        env: config.env,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      logger.error("Health Check Failure", {
        message: error.message,
        stack: error.stack,
        config: {
          env: config.env,
          hasGemini: !!config.geminiApiKey,
          hasFirebase: !!config.firebase.projectId
        }
      });
      reply.status(500).send({
        error: "Internal Server Error during health check",
        details: error.message
      });
    }
  });
  fastify.get("/auth/google/url", async () => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_CALENDAR_SCOPES,
      prompt: "consent"
    });
    return { url };
  });
  fastify.get("/auth/google/callback", async (req, reply) => {
    const { code } = req.query;
    if (!code) {
      reply.status(400).send("C\xF3digo n\xE3o fornecido");
      return;
    }
    try {
      const { tokens } = await oauth2Client.getToken(code);
      reply.type("text/html").send(`
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
            <p>Autentica\xE7\xE3o do Google Calendar conclu\xEDda com sucesso. Esta janela fechar\xE1 automaticamente.</p>
          </body>
        </html>
      `);
    } catch (error) {
      logger.error("OAuth Callback Error", { error: error.message });
      reply.status(500).send("Erro na autentica\xE7\xE3o");
    }
  });
  fastify.post("/notify", { preHandler: validateRequest(notificationSchema) }, async (req, reply) => {
    const { type, email, name, days } = req.body;
    try {
      const emailService = container2.resolve(EmailService);
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
    } catch (error) {
      logger.error("Email API Error", { error: error.message, recipient: email, type });
      reply.status(500).send({ success: false, error: "Failed to send email notification" });
    }
  });
  fastify.get("/config/ai", async () => {
    const orchestrator = container2.resolve(AimeeOrchestrator);
    const health = await orchestrator.checkHealth();
    return {
      availableProviders: health.providers,
      defaultProvider: health.providers.includes("deepseek") ? "deepseek" : health.providers[0] || null
    };
  });
  fastify.post("/ai", {
    preHandler: validateRequest(aiRequestSchema),
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute"
      }
    }
  }, async (req, reply) => {
    const { prompt, history, persona, context, audio, provider, userId, contextType } = req.body;
    try {
      const orchestrator = container2.resolve(AimeeOrchestrator);
      const contextString = `
[CONTEXTO ATUAL]
Tarefas: ${JSON.stringify(context.tasks || [])}
Finan\xE7as: ${JSON.stringify(context.finance || [])}
Compras: ${JSON.stringify(context.shopping || [])}
`;
      const fullPrompt = `${prompt}

${contextString}`;
      const result = await orchestrator.processRequest(fullPrompt, history, persona, audio, provider, userId, contextType);
      return result;
    } catch (error) {
      logger.error("Server AI Error", {
        message: error.message,
        stack: error.stack
      });
      reply.status(500).send({ error: error.message || "Internal AI Error" });
    }
  });
  fastify.get("/location/nearby-markets", async (req, reply) => {
    const { lat, lng } = req.query;
    const apiKey = config.google.mapsApiKey;
    if (!lat || !lng) {
      reply.status(400).send({ error: "Latitude e longitude s\xE3o obrigat\xF3rias." });
      return;
    }
    if (!apiKey) {
      logger.warn("Google Maps API Key missing in request to /location/nearby-markets");
      reply.status(403).send({ error: "Servi\xE7o de localiza\xE7\xE3o n\xE3o configurado (chave ausente)." });
      return;
    }
    try {
      const radius = 5e3;
      const type = "supermarket";
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "ZERO_RESULTS") {
        return { results: [] };
      }
      if (data.status !== "OK") {
        const errorMsg = data.error_message || data.status;
        logger.error("Google Maps API Error", { status: data.status, message: errorMsg });
        if (data.status === "REQUEST_DENIED") {
          reply.status(403).send({ error: "Acesso negado \xE0 API do Google Maps. Verifique se a chave \xE9 v\xE1lida e se a Places API est\xE1 ativada." });
          return;
        }
        throw new Error(`Google Maps API Error: ${data.status}`);
      }
      const results = data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        placeId: place.place_id,
        location: place.geometry?.location,
        distance: "Pr\xF3ximo"
      }));
      return { results };
    } catch (error) {
      logger.error("Nearby Markets Exception", { error: error.message, stack: error.stack });
      reply.status(500).send({ error: "Erro interno ao buscar mercados pr\xF3ximos." });
    }
  });
  fastify.post("/calendar/events", async (req, reply) => {
    const { tokens, event } = req.body;
    if (!tokens || !event) {
      reply.status(400).send("Faltam par\xE2metros");
      return;
    }
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google2.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: event.title,
          description: event.description,
          start: { dateTime: event.date },
          end: { dateTime: new Date(new Date(event.date).getTime() + 36e5).toISOString() }
        }
      });
      return response.data;
    } catch (error) {
      logger.error("Calendar Insert Error", { error: error.message });
      reply.status(500).send({ error: error.message });
    }
  });
  fastify.put("/calendar/events/:id", async (req, reply) => {
    const { tokens, event } = req.body;
    const { id } = req.params;
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google2.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendar.events.update({
        calendarId: "primary",
        eventId: id,
        requestBody: {
          summary: event.title,
          description: event.description,
          start: { dateTime: event.date },
          end: { dateTime: new Date(new Date(event.date).getTime() + 36e5).toISOString() }
        }
      });
      return response.data;
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });
  fastify.delete("/calendar/events/:id", async (req, reply) => {
    const { tokens } = req.body;
    const { id } = req.params;
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google2.calendar({ version: "v3", auth: oauth2Client });
      await calendar.events.delete({ calendarId: "primary", eventId: id });
      return { success: true };
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });
  fastify.post("/logs", async (req, reply) => {
    const { level, message, details, errorId } = req.body;
    const logData = {
      clientMessage: message,
      details,
      errorId,
      userAgent: req.headers["user-agent"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (level === "error") {
      logger.error("Client Side Error", logData);
    } else {
      logger.info("Client Side Log", logData);
    }
    return { success: true };
  });
}

// server.ts
dotenv.config();
validateConfig();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const fastify = Fastify({
    logger: false
    // Usamos nosso próprio logger
  });
  await fastify.register(cors);
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: (req, context) => ({
      error: "Muitas requisi\xE7\xF5es",
      message: `Limite de requisi\xE7\xF5es excedido. Tente novamente em ${context.after}.`
    })
  });
  await fastify.register(middie);
  fastify.addHook("preHandler", requestLogger);
  fastify.setErrorHandler(globalErrorHandler);
  await fastify.register(routes_default, { prefix: "/api" });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    await fastify.use(vite.middlewares);
  } else {
    const clientPath = path.join(process.cwd(), "dist");
    await fastify.register(fastifyStatic, {
      root: clientPath,
      prefix: "/"
    });
    fastify.setNotFoundHandler(async (req, reply) => {
      if (req.url.startsWith("/api")) {
        reply.status(404).send({ error: "API Route Not Found" });
        return;
      }
      return reply.sendFile("index.html");
    });
  }
  return fastify;
}
var serverPromise = startServer();
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  serverPromise.then(async (fastify) => {
    const PORT = Number(process.env.PORT) || 3e3;
    try {
      await fastify.listen({ port: PORT, host: "0.0.0.0" });
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode`, {
        port: PORT,
        host: "0.0.0.0"
      });
      console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
      logger.error("Failed to start server", { error: err });
      process.exit(1);
    }
  });
}
var server_default = async (req, res) => {
  const fastify = await serverPromise;
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
export {
  server_default as default
};
