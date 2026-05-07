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
  createdAt: z.string().datetime()
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
  avatarUrl: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().url().optional().or(z.literal('')),
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
  userId: z.string(),
  amount: z.number().positive("Valor deve ser positivo"),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().max(200),
  date: z.string().datetime()
});

// Shopping Item Schema
export const ShoppingItemSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.number().min(0.01, "Quantidade mínima é 0.01"),
  unit: z.string().optional(),
  category: z.string(),
  purchased: z.boolean(),
  urgency: z.nativeEnum(ItemUrgency).optional(),
  isStock: z.boolean().optional(),
  frequency: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// Household Task Schema
export const HouseholdTaskSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  category: z.nativeEnum(TaskCategory),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.string().optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora inválido (HH:mm)").optional(),
  isAllDay: z.boolean(),
  assignedTo: z.string().optional(),
  recurrence: z.object({
    type: z.nativeEnum(RecurrenceType),
    interval: z.number().optional(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    isInfinite: z.boolean().optional()
  }).optional(),
  createdAt: z.string().datetime()
});

// Export inferred types if needed
export type FinancialGoalInput = z.infer<typeof FinancialGoalSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type ShoppingItemInput = z.infer<typeof ShoppingItemSchema>;
export type HouseholdTaskInput = z.infer<typeof HouseholdTaskSchema>;
