import { z } from 'zod';
import { 
  FinancialGoalCategory, 
  UserRole, 
  UserStatus, 
  AIRecommendedPersona, 
  TransactionType, 
  ItemUrgency, 
  ChatRole, 
  ShareStatus, 
  PermissionLevel, 
  TaskCategory, 
  TaskStatus, 
  RecurrenceType, 
  EventType, 
  AIProvider 
} from '../../types/index';

// Financial Goal Schema
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

// User Profile Schema
export const UserProfileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  username: z.string().optional(),
  nickname: z.string().optional(),
  displayPreference: z.enum(['fullName', 'nickname']).optional(),
  bio: z.string().max(500).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus),
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
  })
});

// Transaction Schema
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

// Shopping Item Schema
export const ShoppingItemSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.number().min(0).optional().default(1),
  unit: z.string().optional().default('un'),
  category: z.string().optional().default('grocery'),
  purchased: z.boolean().optional().default(false),
  urgency: z.nativeEnum(ItemUrgency).optional().default(ItemUrgency.MEDIUM),
  isStock: z.boolean().optional().default(false),
  frequency: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  createdAt: z.string().optional()
});

// Household Task Schema
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
  recurrence: z.object({
    type: z.nativeEnum(RecurrenceType),
    interval: z.number().optional().nullable(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional().nullable(),
    isInfinite: z.boolean().optional().nullable()
  }).optional().nullable(),
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de criação da tarefa inválida" }).optional()
});

// Export inferred types if needed
export type FinancialGoalInput = z.infer<typeof FinancialGoalSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type ShoppingItemInput = z.infer<typeof ShoppingItemSchema>;
export type HouseholdTaskInput = z.infer<typeof HouseholdTaskSchema>;

// Family Event Schema
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

export type FamilyEventInput = z.infer<typeof FamilyEventSchema>;
