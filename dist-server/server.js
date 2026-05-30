var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/lib/logger.ts
var Logger, logger;
var init_logger = __esm({
  "src/lib/logger.ts"() {
    Logger = class _Logger {
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
    logger = Logger.getInstance();
  }
});

// firebase-applet-config.json
var firebase_applet_config_default;
var init_firebase_applet_config = __esm({
  "firebase-applet-config.json"() {
    firebase_applet_config_default = {
      projectId: "aimee-db9b3",
      appId: "1:317073273380:web:c87faeeaf141201e5c1eb1",
      apiKey: "AIzaSyDk69QVZqrm_qhMpynlQ41NoVMvrjF2HGo",
      authDomain: "aimee-db9b3.firebaseapp.com",
      firestoreDatabaseId: "ai-studio-a42d197f-b2fd-4ea3-b5d9-b3b02ea6b201",
      storageBucket: "aimee-db9b3.firebasestorage.app",
      messagingSenderId: "317073273380",
      measurementId: ""
    };
  }
});

// src/lib/config.ts
function getEnv(key, defaultValue = "") {
  let val = "";
  if (isServer) {
    val = process.env[key] || defaultValue;
  } else {
    val = import.meta.env[key] || window.process?.env?.[key] || defaultValue;
  }
  if (val) {
    val = val.trim();
    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
  }
  return val;
}
function getViteEnv(key, defaultValue = "") {
  const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  let val = "";
  if (isServer) {
    val = process.env[viteKey] || process.env[key] || defaultValue;
  } else {
    val = import.meta.env[viteKey] || defaultValue;
  }
  if (val) {
    val = val.trim();
    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
  }
  return val;
}
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
    if (!config.firebaseAdmin.projectId) missingCritical.push("FIREBASE_PROJECT_ID");
    if (!config.firebaseAdmin.clientEmail) missingCritical.push("FIREBASE_CLIENT_EMAIL");
    if (!config.firebaseAdmin.privateKey) missingCritical.push("FIREBASE_PRIVATE_KEY");
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
var isServer, isValidKey, rawGeminiKey, rawDeepseekKey, rawOpenaiKey, rawAnthropicKey, config;
var init_config = __esm({
  "src/lib/config.ts"() {
    init_logger();
    init_firebase_applet_config();
    isServer = typeof window === "undefined";
    isValidKey = (key) => {
      if (!key) return false;
      const k = key.trim();
      const lowerK = k.toLowerCase();
      return k.length > 10 && !lowerK.includes("your-") && !lowerK.includes("chave-") && !lowerK.includes("placeholder");
    };
    rawGeminiKey = getEnv("GEMINI_API_KEY")?.trim();
    rawDeepseekKey = getEnv("DEEPSEEK_API_KEY")?.trim();
    rawOpenaiKey = getEnv("OPENAI_API_KEY")?.trim();
    rawAnthropicKey = getEnv("ANTHROPIC_API_KEY")?.trim();
    config = {
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
  }
});

// src/models/index.ts
import { z as z2 } from "zod";
var TabEnum, PeriodEnum, FinancialGoalCategory, FinancialGoalSchema, UserRole, UserStatus, AIRecommendedPersona, AimeeSuggestionSchema, UserProfileSchema, TransactionType, TransactionSchema, ItemUrgency, ShoppingItemSchema, ChatRole, ChatMessageSchema, ShareStatus, PermissionLevel, ShareSchema, TaskCategory, TaskStatus, RecurrenceType, TaskRecurrenceSchema, HouseholdTaskSchema, EventType, FamilyEventSchema, AIProvider, NotificationType, NotificationPayloadSchema, GlobalConfigSchema, LLMUsageSchema, MonitorEventSchema, EventMonitorConfigSchema, notificationSchema, aiRequestSchema, supportSchema;
var init_models = __esm({
  "src/models/index.ts"() {
    TabEnum = z2.enum(["chat", "finance", "shopping", "routines", "settings"]);
    PeriodEnum = z2.enum(["7d", "30d", "all", "custom"]);
    FinancialGoalCategory = {
      TRAVEL: "travel",
      RENOVATION: "renovation",
      EDUCATION: "education",
      EMERGENCY: "emergency",
      OTHER: "other"
    };
    FinancialGoalSchema = z2.object({
      id: z2.string().optional(),
      userId: z2.string(),
      title: z2.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio").max(100),
      targetAmount: z2.number().positive("Valor alvo deve ser positivo"),
      currentAmount: z2.number().min(0, "Valor atual n\xE3o pode ser negativo"),
      deadline: z2.string().optional(),
      category: z2.nativeEnum(FinancialGoalCategory),
      createdAt: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data de cria\xE7\xE3o inv\xE1lida" })
    });
    UserRole = { ADMIN: "admin", USER: "user" };
    UserStatus = {
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
      BLOCKED: "blocked"
    };
    AIRecommendedPersona = {
      FUNNY: "funny",
      ANALYTICAL: "analytical",
      FRUGAL: "frugal"
    };
    AimeeSuggestionSchema = z2.object({
      id: z2.string(),
      type: z2.enum(["shopping", "finance", "routine"]),
      title: z2.string(),
      description: z2.string().optional(),
      actionValue: z2.string(),
      icon: z2.string().optional()
    });
    UserProfileSchema = z2.object({
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
    TransactionType = { INCOME: "income", EXPENSE: "expense" };
    TransactionSchema = z2.object({
      id: z2.string().optional(),
      userId: z2.string().optional(),
      amount: z2.number().min(0, "O valor n\xE3o pode ser negativo").optional().default(0),
      type: z2.nativeEnum(TransactionType),
      category: z2.string().min(1, "Categoria \xE9 obrigat\xF3ria").optional().default("others"),
      description: z2.string().max(200).optional().or(z2.literal("")),
      date: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Formato de data inv\xE1lido" }).optional(),
      createdAt: z2.string().optional()
    });
    ItemUrgency = { LOW: "low", MEDIUM: "medium", HIGH: "high" };
    ShoppingItemSchema = z2.object({
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
    ChatRole = { USER: "user", ASSISTANT: "assistant" };
    ChatMessageSchema = z2.object({
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
    ShareStatus = { PENDING: "pending", ACCEPTED: "accepted", DECLINED: "declined" };
    PermissionLevel = { NONE: "none", READ: "read", WRITE: "write" };
    ShareSchema = z2.object({
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
    TaskCategory = { CLEANING: "cleaning", MAINTENANCE: "maintenance", ERRAND: "errand", OTHER: "other" };
    TaskStatus = { TODO: "todo", DONE: "done" };
    RecurrenceType = { DAILY: "daily", WEEKLY: "weekly", MONTHLY: "monthly", ANNUAL: "annual" };
    TaskRecurrenceSchema = z2.object({
      type: z2.nativeEnum(RecurrenceType),
      interval: z2.number().optional().nullable(),
      daysOfWeek: z2.array(z2.number().min(0).max(6)).optional().nullable(),
      daysOfMonth: z2.array(z2.number().min(1).max(31)).optional().nullable(),
      month: z2.number().min(0).max(11).optional().nullable(),
      endTime: z2.string().optional(),
      isInfinite: z2.boolean().optional().nullable()
    });
    HouseholdTaskSchema = z2.object({
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
    EventType = { SOCIAL: "social", HOLIDAY: "holiday", APPOINTMENT: "appointment" };
    FamilyEventSchema = z2.object({
      id: z2.string().optional(),
      userId: z2.string(),
      title: z2.string().min(1, "T\xEDtulo do evento \xE9 obrigat\xF3rio"),
      description: z2.string().optional(),
      date: z2.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data do evento inv\xE1lida" }),
      type: z2.nativeEnum(EventType),
      googleEventId: z2.string().optional(),
      createdAt: z2.string().optional()
    });
    AIProvider = { GEMINI: "gemini", DEEPSEEK: "deepseek" };
    NotificationType = { REQUEST: "request", APPROVE: "approve", REJECT: "reject", BLOCK: "block" };
    NotificationPayloadSchema = z2.object({
      type: z2.nativeEnum(NotificationType),
      email: z2.string().email(),
      name: z2.string(),
      days: z2.number().optional()
    });
    GlobalConfigSchema = z2.object({
      aiProvider: z2.nativeEnum(AIProvider),
      aimeeAvatarUrl: z2.string().optional(),
      calendarIntegrationEnabled: z2.boolean().optional(),
      updatedAt: z2.string(),
      updatedBy: z2.string()
    });
    LLMUsageSchema = z2.object({
      id: z2.string().optional(),
      userId: z2.string(),
      model: z2.string(),
      promptTokens: z2.number().int().min(0),
      completionTokens: z2.number().int().min(0),
      totalTokens: z2.number().int().min(0),
      timestamp: z2.string(),
      context: z2.string().optional()
    });
    MonitorEventSchema = z2.object({
      id: z2.string().optional(),
      hash: z2.string(),
      title: z2.string(),
      summary: z2.string(),
      categories: z2.array(z2.string()),
      targetAudience: z2.string().optional().nullable(),
      startDate: z2.string().optional().nullable(),
      endDate: z2.string().optional().nullable(),
      time: z2.string().optional().nullable(),
      format: z2.enum(["presencial", "online", "hibrido", "desconhecido"]),
      location: z2.string().optional().nullable(),
      language: z2.string().optional().nullable(),
      cost: z2.number().optional().nullable(),
      currency: z2.string().optional().nullable(),
      registrationLink: z2.string().optional().nullable(),
      sourceLink: z2.string().optional().nullable(),
      organizer: z2.string().optional().nullable(),
      source: z2.string(),
      freeTextTags: z2.array(z2.string()),
      mentionedTechs: z2.array(z2.string()),
      techFocus: z2.array(z2.string()),
      collectedAt: z2.string(),
      confidence: z2.number().min(0).max(1),
      rawExcerpt: z2.string().optional()
    });
    EventMonitorConfigSchema = z2.object({
      id: z2.string().optional(),
      userId: z2.string(),
      active: z2.boolean().default(false),
      frequency: z2.enum(["daily", "weekly"]),
      interests: z2.array(z2.string()),
      // From the TAXONOMY
      preferences: z2.object({
        freeOnly: z2.boolean().default(false),
        onlineOnly: z2.boolean().default(false),
        languages: z2.array(z2.string()).default(["pt", "en"])
      }),
      lastNotifiedAt: z2.string().optional()
    });
    notificationSchema = z2.object({
      type: z2.nativeEnum(NotificationType),
      email: z2.string().email("E-mail inv\xE1lido"),
      name: z2.string().min(2, "Nome muito curto"),
      days: z2.number().optional()
    });
    aiRequestSchema = z2.object({
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
    supportSchema = z2.object({
      email: z2.string().email("E-mail inv\xE1lido"),
      message: z2.string().min(5, "A mensagem deve ter pelo menos 5 caracteres").max(100, "A mensagem deve ter no m\xE1ximo 100 caracteres")
    });
  }
});

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
var firebaseConfig, app, db, auth, googleProvider;
var init_firebase = __esm({
  "src/lib/firebase.ts"() {
    init_logger();
    init_config();
    firebaseConfig = {
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      projectId: config.firebase.projectId,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId,
      appId: config.firebase.appId,
      measurementId: config.firebase.measurementId
    };
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, config.firebase.databaseId || void 0);
    auth = getAuth(app);
    isSupported().then((yes) => yes && getAnalytics(app));
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope("https://www.googleapis.com/auth/calendar.events.readonly");
    googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");
    googleProvider.setCustomParameters({
      prompt: "consent"
    });
  }
});

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
import { z as z3 } from "zod";
var BaseRepository;
var init_BaseRepository = __esm({
  "src/infrastructure/repositories/BaseRepository.ts"() {
    init_firebase();
    BaseRepository = class {
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
          return querySnapshot.docs.map((doc4) => ({ id: doc4.id, ...doc4.data() }));
        } catch (error) {
          this.handleFirestoreError(error, "list" /* LIST */, path2);
          return [];
        }
      }
    };
  }
});

// src/server/firebaseAdmin.ts
var firebaseAdmin_exports = {};
__export(firebaseAdmin_exports, {
  getAdminFirestore: () => getAdminFirestore,
  getFirebaseAdmin: () => getFirebaseAdmin
});
import admin from "firebase-admin";
function getFirebaseAdmin() {
  if (firebaseAdminInstance) return firebaseAdminInstance;
  try {
    const projectId = config.firebaseAdmin.projectId;
    const clientEmail = config.firebaseAdmin.clientEmail;
    const privateKey = config.firebaseAdmin.privateKey;
    if (admin.apps.length > 0) {
      console.log(`[FirebaseAdmin] Default app already exists. Reusing existing instance.`);
      firebaseAdminInstance = admin.app();
      return firebaseAdminInstance;
    }
    console.log(`[FirebaseAdmin Diagnostic] Initializing Firebase Admin SDK...`);
    console.log(`[FirebaseAdmin Diagnostic] Configured Project ID: "${projectId}"`);
    console.log(`[FirebaseAdmin Diagnostic] Configured Client Email: "${clientEmail}"`);
    if (privateKey) {
      const hasBeginHeader = privateKey.includes("-----BEGIN PRIVATE KEY-----");
      const hasEndHeader = privateKey.includes("-----END PRIVATE KEY-----");
      const containsLiteralSlashN = privateKey.includes("\\n");
      const containsRealNewline = privateKey.includes("\n");
      console.log(`[FirebaseAdmin Diagnostic] Private Key exists. Length: ${privateKey.length} chars.`);
      console.log(`[FirebaseAdmin Diagnostic] Contains -----BEGIN PRIVATE KEY-----: ${hasBeginHeader}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains -----END PRIVATE KEY-----: ${hasEndHeader}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains raw/literal '\\n': ${containsLiteralSlashN}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains actual newline character: ${containsRealNewline}`);
      if (!hasBeginHeader || !hasEndHeader) {
        console.warn(`[FirebaseAdmin Diagnostic] WARNING: Private key is missing the standard PEM headers!`);
      }
    } else {
      console.log(`[FirebaseAdmin Diagnostic] Private Key is missing or empty!`);
    }
    if (!projectId) {
      console.error("getFirebaseAdmin: No Firebase Project ID found in config. Cannot initialize Admin SDK.");
      return null;
    }
    const options = {
      projectId
    };
    if (clientEmail && privateKey) {
      options.credential = admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      });
      firebaseAdminInstance = admin.initializeApp(options);
      console.log(`getFirebaseAdmin: Initialized successfully using Service Account for project: ${projectId}`);
      return firebaseAdminInstance;
    }
    console.warn("getFirebaseAdmin: Service Account credentials (clientEmail or privateKey) are missing. Falling back to Application Default Credentials...");
    firebaseAdminInstance = admin.initializeApp(options);
    return firebaseAdminInstance;
  } catch (error) {
    console.error("Failed to initialize firebase-admin SDK", error);
  }
  return null;
}
function getAdminFirestore() {
  const adminApp = getFirebaseAdmin();
  if (adminApp) {
    return adminApp.firestore();
  }
  return null;
}
var firebaseAdminInstance;
var init_firebaseAdmin = __esm({
  "src/server/firebaseAdmin.ts"() {
    init_config();
    firebaseAdminInstance = null;
  }
});

// src/infrastructure/repositories/UsageRepository.ts
var UsageRepository_exports = {};
__export(UsageRepository_exports, {
  UsageRepository: () => UsageRepository,
  usageRepository: () => usageRepository
});
var UsageRepository, usageRepository;
var init_UsageRepository = __esm({
  "src/infrastructure/repositories/UsageRepository.ts"() {
    init_models();
    init_BaseRepository();
    init_logger();
    UsageRepository = class extends BaseRepository {
      constructor() {
        super("llm_usage", LLMUsageSchema);
      }
      /**
       * Logs LLM usage. Detects if running on server (Node.js) to use Firebase Admin
       * or client to use standard BaseRepository logic.
       */
      async logUsage(usage) {
        const isServer2 = typeof window === "undefined";
        if (isServer2) {
          try {
            const { getAdminFirestore: getAdminFirestore2 } = await Promise.resolve().then(() => (init_firebaseAdmin(), firebaseAdmin_exports));
            const db2 = getAdminFirestore2();
            if (db2) {
              const docRef = await db2.collection("llm_usage").add({
                ...usage,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              });
              return docRef.id;
            }
          } catch (error) {
            logger.error("UsageRepository: Falha ao registrar log no servidor", { error });
          }
        }
        try {
          return await this.create({
            ...usage,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }, usage.userId);
        } catch (error) {
          logger.error("UsageRepository: Falha ao registrar log no cliente", { error });
          return "";
        }
      }
    };
    usageRepository = new UsageRepository();
  }
});

// server.ts
init_logger();
init_config();
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

// src/server/middlewares.ts
init_logger();
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

// src/server/routes.ts
init_logger();
init_config();

// src/types/index.ts
init_models();

// src/server/services/EmailService.ts
init_logger();
init_config();
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

// src/server/llm/AimeeOrchestrator.ts
init_logger();
import "reflect-metadata";
import { singleton as singleton2 } from "tsyringe";

// src/server/tools/AimeeTools.ts
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

// src/server/llm/AimeeOrchestrator.ts
init_config();

// src/server/llm/GeminiAdapter.ts
init_config();
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

// src/server/llm/GeminiAdapter.ts
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

// src/server/llm/OpenAICompatibleAdapter.ts
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

// src/server/llm/DeepSeekAdapter.ts
init_config();
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

// src/server/llm/AimeeOrchestrator.ts
init_UsageRepository();
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
  async processRequest(prompt, history = [], persona = "funny", audio, preferredProvider, userId = "system", contextType = "chat", context = {}) {
    const tasks = context.tasks || [];
    const finance = context.finance || [];
    const shopping = context.shopping || [];
    const goals = context.goals || [];
    const contextString = `
[DADOS DO USU\xC1RIO]
- Tarefas Pendentes: ${tasks.length} ativas.
- Transa\xE7\xF5es Recentes: ${finance.length} registradas.
- Itens na Lista de Compras: ${shopping.length} pendentes.
- Metas Financeiras: ${goals.length || 0} em progresso.

Hist\xF3rico de Dados (JSON):
${JSON.stringify({ tasks: tasks.slice(0, 10), finance: finance.slice(0, 10), shopping: shopping.slice(0, 10) })}
`;
    const finalPrompt = `${prompt}

${contextString}`;
    const cacheKey = JSON.stringify({ prompt: finalPrompt, history, persona, preferredProvider });
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
          prompt: finalPrompt,
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
        usageRepository.logUsage({
          userId,
          model: response.usage?.model || providerId,
          promptTokens: response.usage?.promptTokens || 0,
          completionTokens: response.usage?.completionTokens || 0,
          totalTokens: response.usage?.totalTokens || 0,
          context: contextType
        }).catch((err) => logger.error("Falha ao registrar auditoria de tokens via Repository", { err }));
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

// src/server/container.ts
import "reflect-metadata";
import { container as container2 } from "tsyringe";
container2.registerSingleton(EmailService);
container2.registerSingleton(AimeeOrchestrator);

// src/server/routes.ts
init_models();

// src/server/googleAuth.ts
init_config();
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

// src/server/routes.ts
import { google as google2 } from "googleapis";

// src/domain/skills/EventDiscoverySkill.ts
init_logger();
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
import OpenAI2 from "openai";

// src/infrastructure/repositories/MonitorEventRepository.ts
init_models();
init_BaseRepository();
init_firebase();
import { collection as collection2, query as query2, where as where2, getDocs as getDocs2, writeBatch, doc as doc3 } from "firebase/firestore";
var MonitorEventRepository = class extends BaseRepository {
  constructor() {
    super("monitor_events", MonitorEventSchema);
  }
  async findRecentEvents(startDate) {
    try {
      const q = query2(
        collection2(db, this.collectionPath),
        where2("collectedAt", ">=", startDate.toISOString())
      );
      const snapshot = await getDocs2(q);
      const results = [];
      snapshot.forEach((doc4) => {
        const item = { id: doc4.id, ...doc4.data() };
        const parsed = this.schema.safeParse(item);
        if (parsed.success) {
          results.push(parsed.data);
        }
      });
      return results;
    } catch (error) {
      console.error(`Error finding recent events in ${this.collectionPath}:`, error);
      return [];
    }
  }
  async saveBatch(events) {
    const batch = writeBatch(db);
    events.forEach((event) => {
      const docRef = doc3(db, this.collectionPath, event.hash);
      const parsed = this.schema.parse({ ...event, id: event.hash });
      batch.set(docRef, parsed, { merge: true });
    });
    await batch.commit();
  }
};

// src/infrastructure/repositories/EventMonitorConfigRepository.ts
init_models();
init_BaseRepository();
var EventMonitorConfigRepository = class extends BaseRepository {
  constructor() {
    super("users/{userId}/monitor_config", EventMonitorConfigSchema);
  }
  async getConfig(userId) {
    const configs = await this.list([], userId);
    return configs.length > 0 ? configs[0] : null;
  }
};

// src/domain/skills/EventDiscoverySkill.ts
init_config();
init_firebaseAdmin();
import crypto from "crypto";
var EventDiscoverySkill = class {
  constructor() {
    this.repository = new MonitorEventRepository();
    this.configRepo = new EventMonitorConfigRepository();
  }
  /**
   * Search for events based on interests, ignoring existing hashes.
   */
  async searchEvents(query3, interests, ignoreHashes) {
    logger.info("EventDiscoverySkill: Searching for events", { query: query3, interests });
    let rawResponse = "";
    let usedModel = "";
    let promptTokenCount = 0;
    let candidatesTokenCount = 0;
    let totalTokenCount = 0;
    const systemInstruction = `Voc\xEA \xE9 um assistente pesquisador especializado em encontrar eventos profissionais. 
Retorne APENAS um JSON v\xE1lido. N\xE3o inclua Markdown (como \`\`\`json) ou textos adicionais de introdu\xE7\xE3o/conclus\xE3o.

Regras de Filtragem e Higieniza\xE7\xE3o:
1. Agnosticismo de Plataforma e Varredura Ampla.
2. Formatar as datas em ISO8601.
3. N\xE3o inventar ou deduzir informa\xE7\xF5es.
4. NUNCA DEVOLVA JSON INV\xC1LIDO.

Formato OBRIGAT\xD3RIO de Sa\xEDda:
{
  "events": [
    {
      "titulo": "string",
      "resumo": "string (1-2 frases)",
      "categorias": ["string"],
      "publico_alvo": "string",
      "data_inicio": "ISO8601",
      "data_fim": "ISO8601",
      "horario": "string",
      "formato": "presencial" | "online" | "hibrido" | "desconhecido",
      "local": "string",
      "idioma": "string",
      "custo": 0,
      "moeda": "BRL",
      "link_inscricao": "url",
      "link_fonte_origem": "url",
      "organizador": "string",
      "fonte": "dominio",
      "free_text_tags": ["string"],
      "tecnologias_mencionadas": ["string"],
      "foco_tecnico": ["string"],
      "raw_excerpt": "trecho curto"
    }
  ]
}
`;
    const prompt = `
Tema: "${query3}"
Interesses do usu\xE1rio: ${interests.join(", ")}
Data de coleta: ${(/* @__PURE__ */ new Date()).toISOString()}

Tente evitar os seguintes eventos (deduplica\xE7\xE3o): ${ignoreHashes.join(", ")}

Foque em listar eventos futuros conhecidos reais em comunidades de tecnologia (como Meetups, Sympla, etc.) relacionados a essa pesquisa no Brasil.
Retorne o JSON estritamente formatado de acordo com a instru\xE7\xE3o de sa\xEDda.
`;
    if (config.geminiApiKey) {
      try {
        usedModel = "gemini-2.5-flash";
        const ai = new GoogleGenAI2({ apiKey: config.geminiApiKey });
        const response = await ai.models.generateContent({
          model: usedModel,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            // Baixa temperatura para melhor extração estruturada
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json"
          }
        });
        rawResponse = response.text || "";
        promptTokenCount = response.usageMetadata?.promptTokenCount || 0;
        candidatesTokenCount = response.usageMetadata?.candidatesTokenCount || 0;
        totalTokenCount = response.usageMetadata?.totalTokenCount || 0;
        logger.info("EventDiscoverySkill: Gemini API response and usage captured", {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (geminiError) {
        logger.warn("EventDiscoverySkill: Gemini search failed, checking fallbacks...", { error: geminiError.message });
      }
    }
    if (!rawResponse && config.deepseekApiKey) {
      try {
        usedModel = "deepseek-chat";
        logger.info("EventDiscoverySkill: Trying fallback discovery with DeepSeek", { model: usedModel });
        const openai = new OpenAI2({
          apiKey: config.deepseekApiKey,
          baseURL: "https://api.deepseek.com"
        });
        const completion = await openai.chat.completions.create({
          model: usedModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        rawResponse = completion.choices[0].message.content || "";
        promptTokenCount = completion.usage?.prompt_tokens || 0;
        candidatesTokenCount = completion.usage?.completion_tokens || 0;
        totalTokenCount = completion.usage?.total_tokens || 0;
        logger.info("EventDiscoverySkill: DeepSeek API response and usage captured", {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (dsError) {
        logger.warn("EventDiscoverySkill: DeepSeek search fallback failed...", { error: dsError.message });
      }
    }
    if (!rawResponse && config.openaiApiKey) {
      try {
        usedModel = "gpt-4o";
        logger.info("EventDiscoverySkill: Trying fallback discovery with OpenAI", { model: usedModel });
        const openai = new OpenAI2({
          apiKey: config.openaiApiKey
        });
        const completion = await openai.chat.completions.create({
          model: usedModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        rawResponse = completion.choices[0].message.content || "";
        promptTokenCount = completion.usage?.prompt_tokens || 0;
        candidatesTokenCount = completion.usage?.completion_tokens || 0;
        totalTokenCount = completion.usage?.total_tokens || 0;
        logger.info("EventDiscoverySkill: OpenAI API response and usage captured", {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (oaiError) {
        logger.error("EventDiscoverySkill: OpenAI search fallback failed", { error: oaiError.message });
      }
    }
    if (!rawResponse) {
      logger.error("EventDiscoverySkill: All LLM discovery options failed or are unconfigured.");
      return [];
    }
    try {
      const { UsageRepository: UsageRepository2 } = await Promise.resolve().then(() => (init_UsageRepository(), UsageRepository_exports));
      const usageRepo = new UsageRepository2();
      await usageRepo.logUsage({
        userId: "system-event-discovery",
        model: usedModel,
        promptTokens: promptTokenCount,
        completionTokens: candidatesTokenCount,
        totalTokens: totalTokenCount,
        context: "event_discovery"
      });
    } catch (usageError) {
      logger.error("Failed to log usage for EventDiscoverySkill", { error: usageError });
    }
    try {
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        const stripped = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedResponse = JSON.parse(stripped);
      }
      if (!parsedResponse.events || !Array.isArray(parsedResponse.events)) {
        logger.warn("EventDiscoverySkill: Invalid JSON structure returned by LLM", { rawResponse });
        return [];
      }
      const events = [];
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      for (const rawEvent of parsedResponse.events) {
        const hashContext = `${rawEvent.titulo}-${rawEvent.data_inicio}-${rawEvent.fonte}`;
        const hash = crypto.createHash("md5").update(hashContext).digest("hex");
        events.push({
          hash,
          title: rawEvent.titulo || "Evento Sem T\xEDtulo",
          summary: rawEvent.resumo || "",
          categories: Array.isArray(rawEvent.categorias) ? rawEvent.categorias : [],
          targetAudience: rawEvent.publico_alvo,
          startDate: rawEvent.data_inicio,
          endDate: rawEvent.data_fim,
          time: rawEvent.horario,
          format: rawEvent.formato && ["presencial", "online", "hibrido", "desconhecido"].includes(rawEvent.formato.toLowerCase()) ? rawEvent.formato.toLowerCase() : "desconhecido",
          location: rawEvent.local,
          language: rawEvent.idioma,
          cost: rawEvent.custo ? Number(rawEvent.custo) : 0,
          currency: rawEvent.moeda || "BRL",
          registrationLink: rawEvent.link_inscricao,
          sourceLink: rawEvent.link_fonte_origem,
          organizer: rawEvent.organizador,
          source: rawEvent.fonte || "Desconhecido",
          freeTextTags: Array.isArray(rawEvent.free_text_tags) ? rawEvent.free_text_tags : [],
          mentionedTechs: Array.isArray(rawEvent.tecnologias_mencionadas) ? rawEvent.tecnologias_mencionadas : [],
          techFocus: Array.isArray(rawEvent.foco_tecnico) ? rawEvent.foco_tecnico : [],
          collectedAt: timestamp,
          confidence: 0.9,
          rawExcerpt: rawEvent.raw_excerpt
        });
      }
      logger.info("EventDiscoverySkill: Events discovered", { count: events.length });
      return events;
    } catch (error) {
      logger.error("EventDiscoverySkill: Search failed to parse or construct events", { error });
      return [];
    }
  }
  async runGlobalDiscoveryJob() {
    logger.info("EventDiscoverySkill: Starting global discovery job");
    const recentDate = /* @__PURE__ */ new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    let recentHashes = [];
    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        const snapshot = await adminDb.collection("monitor_events").where("collectedAt", ">=", recentDate.toISOString()).get();
        recentHashes = snapshot.docs.map((d) => d.id);
      } catch (err) {
        logger.error("Admin DB failed to read recent events", { error: err });
        const recentEvents = await this.repository.findRecentEvents(recentDate);
        recentHashes = recentEvents.map((e) => e.hash);
      }
    } else {
      const recentEvents = await this.repository.findRecentEvents(recentDate);
      recentHashes = recentEvents.map((e) => e.hash);
    }
    const broadQueries = [
      "IA generativa, agentes, RAG, LLMs Brasil",
      "Meetup React Node frontend backend programa\xE7\xE3o"
    ];
    let allNewEvents = [];
    for (const query3 of broadQueries) {
      const searched = await this.searchEvents(query3, [], recentHashes);
      allNewEvents = [...allNewEvents, ...searched];
    }
    if (allNewEvents.length > 0) {
      if (adminDb) {
        try {
          const batch = adminDb.batch();
          allNewEvents.forEach((event) => {
            const docRef = adminDb.collection("monitor_events").doc(event.hash);
            batch.set(docRef, event, { merge: true });
          });
          await batch.commit();
        } catch (err) {
          logger.error("Admin DB failed to write new events", { error: err });
          await this.repository.saveBatch(allNewEvents);
        }
      } else {
        await this.repository.saveBatch(allNewEvents);
      }
    }
    logger.info("EventDiscoverySkill: Job completed", { newEvents: allNewEvents.length });
    return allNewEvents;
  }
};

// src/server/routes.ts
async function routes_default(fastify) {
  fastify.post("/events/discovery/trigger", async (req, reply) => {
    try {
      logger.info("Triggering global event discovery...");
      const skill = new EventDiscoverySkill();
      const events = await skill.runGlobalDiscoveryJob();
      return { success: true, count: events.length };
    } catch (error) {
      logger.error("Error triggering event discovery", { error: error.message });
      reply.status(500).send({ error: "Failed to trigger discovery job" });
    }
  });
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
      const result = await orchestrator.processRequest(prompt, history, persona, audio, provider, userId, contextType, context);
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
