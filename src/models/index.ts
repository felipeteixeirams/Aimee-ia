import { z } from 'zod';

export const TabEnum = z.enum(['chat', 'finance', 'shopping', 'routines', 'settings']);
export type Tab = z.infer<typeof TabEnum>;

export const PeriodEnum = z.enum(['7d', '30d', 'all', 'custom']);
export type Period = z.infer<typeof PeriodEnum>;

export const FinancialGoalCategory = {
  TRAVEL: 'travel',
  RENOVATION: 'renovation',
  EDUCATION: 'education',
  EMERGENCY: 'emergency',
  OTHER: 'other'
} as const;
export type FinancialGoalCategory = (typeof FinancialGoalCategory)[keyof typeof FinancialGoalCategory];

export const FinancialGoalSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Título é obrigatório").max(100),
  targetAmount: z.number().positive("Valor alvo deve ser positivo"),
  currentAmount: z.number().min(0, "Valor atual não pode ser negativo"),
  deadline: z.string().optional(),
  category: z.nativeEnum(FinancialGoalCategory),
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de criação inválida" })
});
export type FinancialGoal = z.infer<typeof FinancialGoalSchema>;
export type FinancialGoalInput = z.infer<typeof FinancialGoalSchema>;

export const UserRole = { ADMIN: 'admin', USER: 'user' } as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  BLOCKED: 'blocked'
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const AIRecommendedPersona = {
  FUNNY: 'funny',
  ANALYTICAL: 'analytical',
  FRUGAL: 'frugal'
} as const;
export type AIRecommendedPersona = (typeof AIRecommendedPersona)[keyof typeof AIRecommendedPersona];

export const AimeeSuggestionSchema = z.object({
  id: z.string(),
  type: z.enum(['shopping', 'finance', 'routine']),
  title: z.string(),
  description: z.string().optional(),
  actionValue: z.string(),
  icon: z.string().optional(),
});
export type AimeeSuggestion = z.infer<typeof AimeeSuggestionSchema>;

export const UserProfileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  username: z.string().optional(),
  nickname: z.string().optional(),
  displayPreference: z.enum(['fullName', 'nickname']).optional(),
  pendingNameChange: z.object({
    newName: z.string(),
    requestedAt: z.string(),
    status: z.enum(['pending', 'approved', 'rejected'])
  }).optional().nullable(),
  bio: z.string().max(500).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus),
  blockedUntil: z.string().optional(),
  selectedPersona: z.nativeEnum(AIRecommendedPersona).optional(),
  avatarUrl: z.string().optional().or(z.literal('')),
  photoUrl: z.string().optional().or(z.literal('')),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  themeColor: z.enum(['blue', 'rose', 'emerald', 'violet', 'amber', 'neutral']).optional(),
  preferences: z.object({
    currency: z.string(),
    notificationsEnabled: z.boolean()
  }),
  gamification: z.object({
    points: z.number().min(0),
    level: z.number().min(1),
    badges: z.array(z.string()),
    weeklyGoal: z.number().optional(),
    currentWeeklySpending: z.number().min(0)
  }),
  healthGoals: z.object({
    dietType: z.enum(['balanced', 'low-sugar', 'vegan', 'keto', 'none']),
    focus: z.array(z.string())
  }).optional(),
  location: z.object({
    city: z.string(),
    region: z.string()
  }).optional(),
  calendarConnected: z.boolean().optional(),
  googleCalendarEmail: z.string().optional(),
  aimeeMetadata: z.object({
    lastStrategicInsightAt: z.string().optional(),
    suggestions: z.array(AimeeSuggestionSchema)
  }).optional()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;

export const TransactionType = { INCOME: 'income', EXPENSE: 'expense' } as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  amount: z.number().min(0, "O valor não pode ser negativo").optional().default(0),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Categoria é obrigatória").optional().default('others'),
  description: z.string().max(200).optional().or(z.literal('')),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Formato de data inválido" }).optional(),
  createdAt: z.string().optional()
});
export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;

export const ItemUrgency = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' } as const;
export type ItemUrgency = (typeof ItemUrgency)[keyof typeof ItemUrgency];

export const ShoppingItemSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.number().min(0).optional().default(1),
  unit: z.string().optional().default('un'),
  category: z.string().optional().default('grocery'),
  purchased: z.boolean().optional().default(false),
  lastPrice: z.number().optional(),
  lastPurchasedAt: z.string().optional(),
  lastDepletedAt: z.string().optional(),
  urgency: z.nativeEnum(ItemUrgency).optional().default(ItemUrgency.MEDIUM),
  isStock: z.boolean().optional().default(false),
  frequency: z.number().optional(),
  isEcoFriendly: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationName: z.string().optional(),
  createdAt: z.string().optional()
});
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;
export type ShoppingItemInput = z.infer<typeof ShoppingItemSchema>;

export const ChatRole = { USER: 'user', ASSISTANT: 'assistant' } as const;
export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

export const ChatMessageSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  role: z.nativeEnum(ChatRole),
  content: z.string(),
  timestamp: z.string(),
  agentType: z.string().optional(),
  isInsight: z.boolean().optional(),
  read: z.boolean().optional(),
  status: z.enum(['sending', 'sent', 'error']).optional(),
  error: z.string().optional(),
  actions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
    type: z.enum(['button', 'link'])
  })).optional()
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ShareStatus = { PENDING: 'pending', ACCEPTED: 'accepted', DECLINED: 'declined' } as const;
export type ShareStatus = (typeof ShareStatus)[keyof typeof ShareStatus];

export const PermissionLevel = { NONE: 'none', READ: 'read', WRITE: 'write' } as const;
export type PermissionLevel = (typeof PermissionLevel)[keyof typeof PermissionLevel];

export const ShareSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  ownerEmail: z.string(),
  sharedWithEmail: z.string(),
  sharedWithId: z.string().optional(),
  permissions: z.object({
    finance: z.nativeEnum(PermissionLevel),
    shopping: z.nativeEnum(PermissionLevel),
    routines: z.nativeEnum(PermissionLevel)
  }),
  status: z.nativeEnum(ShareStatus),
  upgradeRequested: z.boolean().optional(),
  createdAt: z.string()
});
export type Share = z.infer<typeof ShareSchema>;

export const TaskCategory = { CLEANING: 'cleaning', MAINTENANCE: 'maintenance', ERRAND: 'errand', OTHER: 'other' } as const;
export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory];

export const TaskStatus = { TODO: 'todo', DONE: 'done' } as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const RecurrenceType = { DAILY: 'daily', WEEKLY: 'weekly', MONTHLY: 'monthly', ANNUAL: 'annual' } as const;
export type RecurrenceType = (typeof RecurrenceType)[keyof typeof RecurrenceType];

export const TaskRecurrenceSchema = z.object({
  type: z.nativeEnum(RecurrenceType),
  interval: z.number().optional().nullable(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional().nullable(),
  daysOfMonth: z.array(z.number().min(1).max(31)).optional().nullable(),
  month: z.number().min(0).max(11).optional().nullable(),
  endTime: z.string().optional(),
  isInfinite: z.boolean().optional().nullable()
});
export type TaskRecurrence = z.infer<typeof TaskRecurrenceSchema>;

export const HouseholdTaskSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Título é obrigatório").max(200, "O título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  category: z.nativeEnum(TaskCategory),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.string().optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora inválido (HH:mm)").optional(),
  isAllDay: z.boolean().optional().default(false),
  assignedTo: z.string().optional().nullable(),
  participants: z.array(z.string()).optional(),
  recurrence: TaskRecurrenceSchema.optional().nullable(),
  recurrenceId: z.string().optional(),
  originalDueDate: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de criação da tarefa inválida" }).optional()
});
export type HouseholdTask = z.infer<typeof HouseholdTaskSchema>;
export type HouseholdTaskInput = z.infer<typeof HouseholdTaskSchema>;

export const EventType = { SOCIAL: 'social', HOLIDAY: 'holiday', APPOINTMENT: 'appointment' } as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export const FamilyEventSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Título do evento é obrigatório"),
  description: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data do evento inválida" }),
  type: z.nativeEnum(EventType),
  googleEventId: z.string().optional(),
  createdAt: z.string().optional()
});
export type FamilyEvent = z.infer<typeof FamilyEventSchema>;
export type FamilyEventInput = z.infer<typeof FamilyEventSchema>;

export const AIProvider = { GEMINI: 'gemini', DEEPSEEK: 'deepseek' } as const;
export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider];

export const NotificationType = { REQUEST: 'request', APPROVE: 'approve', REJECT: 'reject', BLOCK: 'block' } as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationPayloadSchema = z.object({
  type: z.nativeEnum(NotificationType),
  email: z.string().email(),
  name: z.string(),
  days: z.number().optional()
});
export type NotificationPayload = z.infer<typeof NotificationPayloadSchema>;

export const GlobalConfigSchema = z.object({
  aiProvider: z.nativeEnum(AIProvider),
  aimeeAvatarUrl: z.string().optional(),
  calendarIntegrationEnabled: z.boolean().optional(),
  updatedAt: z.string(),
  updatedBy: z.string()
});
export type GlobalConfig = z.infer<typeof GlobalConfigSchema>;

export const LLMUsageSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  model: z.string(),
  promptTokens: z.number().int().min(0),
  completionTokens: z.number().int().min(0),
  totalTokens: z.number().int().min(0),
  timestamp: z.string(),
  context: z.string().optional()
});
export type LLMUsage = z.infer<typeof LLMUsageSchema>;
export type LLMUsageInput = z.infer<typeof LLMUsageSchema>;

export const EVENT_TAXONOMY = {
  "Tecnologia": {
    "Inteligência Artificial": ["LLMs", "RAG", "Agentes", "Multimodal", "Fine-tuning", "Open Source AI", "Prompt Engineering", "MLOps"],
    "Desenvolvimento": ["Node.js", "React", "DevOps", "Cloud", "Kubernetes"]
  },
  "Pessoal": {
    "Culinária": ["Workshops", "Cursos", "Gastronomia"],
    "Entretenimento": ["Shows", "Eventos Geek", "Festivais"]
  }
} as const;

export const MonitorEventSchema = z.object({
  id: z.string().optional(),
  hash: z.string(),
  title: z.string(),
  summary: z.string(),
  categories: z.array(z.string()),
  targetAudience: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  format: z.enum(['presencial', 'online', 'hibrido', 'desconhecido']),
  location: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  registrationLink: z.string().optional().nullable(),
  sourceLink: z.string().optional().nullable(),
  organizer: z.string().optional().nullable(),
  source: z.string(),
  freeTextTags: z.array(z.string()),
  mentionedTechs: z.array(z.string()),
  techFocus: z.array(z.string()),
  collectedAt: z.string(),
  confidence: z.number().min(0).max(1),
  rawExcerpt: z.string().optional()
});
export type MonitorEvent = z.infer<typeof MonitorEventSchema>;

export const EventMonitorConfigSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  active: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly']),
  interests: z.array(z.string()), // From the TAXONOMY
  preferences: z.object({
    freeOnly: z.boolean().default(false),
    onlineOnly: z.boolean().default(false),
    languages: z.array(z.string()).default(['pt', 'en'])
  }),
  lastNotifiedAt: z.string().optional()
});
export type EventMonitorConfig = z.infer<typeof EventMonitorConfigSchema>;

// Server/Misc Schemas
export const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  email: z.string().email('E-mail inválido'),
  name: z.string().min(2, 'Nome muito curto'),
  days: z.number().optional(),
});
export type NotificationInput = z.infer<typeof notificationSchema>;

export const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'O prompt não pode estar vazio'),
  history: z.array(z.any()).default([]),
  persona: z.string().default('funny'),
  provider: z.enum(['gemini', 'deepseek', 'openai']).optional(),
  userId: z.string().optional(),
  contextType: z.string().optional(),
  context: z.object({
    tasks: z.array(z.any()).optional(),
    events: z.array(z.any()).optional(),
    user: z.any().optional(),
    finance: z.array(z.any()).optional(),
    shopping: z.array(z.any()).optional(),
  }).default({}),
  audio: z.object({
    data: z.string(),
    mimeType: z.string(),
  }).optional(),
});
export type AiRequestInput = z.infer<typeof aiRequestSchema>;

export const supportSchema = z.object({
  email: z.string().email('E-mail inválido'),
  message: z.string().min(5, 'A mensagem deve ter pelo menos 5 caracteres').max(100, 'A mensagem deve ter no máximo 100 caracteres'),
});
export type SupportInput = z.infer<typeof supportSchema>;
