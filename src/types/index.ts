export type Tab = 'chat' | 'finance' | 'shopping' | 'routines' | 'settings';
export type Period = '7d' | '30d' | 'all' | 'custom';

export const FinancialGoalCategory = {
  TRAVEL: 'travel',
  RENOVATION: 'renovation',
  EDUCATION: 'education',
  EMERGENCY: 'emergency',
  OTHER: 'other'
} as const;
export type FinancialGoalCategory = (typeof FinancialGoalCategory)[keyof typeof FinancialGoalCategory];

export interface FinancialGoal {
  id?: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: FinancialGoalCategory;
  createdAt: string;
}

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user'
} as const;
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

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  bio?: string;
  role?: UserRole;
  status: UserStatus;
  blockedUntil?: string;
  selectedPersona?: AIRecommendedPersona;
  avatarUrl?: string;
  photoUrl?: string;
  theme?: 'light' | 'dark' | 'system';
  themeColor?: 'blue' | 'rose' | 'emerald' | 'violet' | 'amber' | 'neutral';
  preferences: {
    currency: string;
    notificationsEnabled: boolean;
  };
  gamification: {
    points: number;
    level: number;
    badges: string[];
    weeklyGoal?: number;
    currentWeeklySpending: number;
  };
  healthGoals?: {
    dietType: 'balanced' | 'low-sugar' | 'vegan' | 'keto' | 'none';
    focus: string[];
  };
  location?: {
    city: string;
    region: string;
  };
}

export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense'
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export const ItemUrgency = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;
export type ItemUrgency = (typeof ItemUrgency)[keyof typeof ItemUrgency];

export interface ShoppingItem {
  id?: string;
  userId: string;
  name: string;
  quantity: number;
  category: string;
  purchased: boolean;
  lastPrice?: number;
  lastPurchasedAt?: string;
  lastDepletedAt?: string;
  urgency?: ItemUrgency;
  isStock?: boolean;
  frequency?: number;
  isEcoFriendly?: boolean;
}

export const ChatRole = {
  USER: 'user',
  ASSISTANT: 'assistant'
} as const;
export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

export interface ChatMessage {
  id?: string;
  userId: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  agentType?: string;
  isInsight?: boolean;
  read?: boolean;
}

export const ShareStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined'
} as const;
export type ShareStatus = (typeof ShareStatus)[keyof typeof ShareStatus];

export const PermissionLevel = {
  NONE: 'none',
  READ: 'read',
  WRITE: 'write'
} as const;
export type PermissionLevel = (typeof PermissionLevel)[keyof typeof PermissionLevel];

export interface Share {
  id?: string;
  ownerId: string;
  ownerEmail: string;
  sharedWithEmail: string;
  sharedWithId?: string;
  permissions: {
    finance: PermissionLevel;
    shopping: PermissionLevel;
    routines: PermissionLevel;
  };
  status: ShareStatus;
  upgradeRequested?: boolean;
  createdAt: string;
}

export const TaskCategory = {
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
  ERRAND: 'errand',
  OTHER: 'other'
} as const;
export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory];

export const TaskStatus = {
  TODO: 'todo',
  DONE: 'done'
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface HouseholdTask {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
}

export const EventType = {
  SOCIAL: 'social',
  HOLIDAY: 'holiday',
  APPOINTMENT: 'appointment'
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export interface FamilyEvent {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  type: EventType;
  googleEventId?: string;
  createdAt: string;
}

export const AIProvider = {
  GEMINI: 'gemini',
  DEEPSEEK: 'deepseek'
} as const;
export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider];

export const NotificationType = {
  REQUEST: 'request',
  APPROVE: 'approve',
  REJECT: 'reject',
  BLOCK: 'block'
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationPayload {
  type: NotificationType;
  email: string;
  name: string;
  days?: number;
}

export interface GlobalConfig {
  aiProvider: AIProvider;
  aimeeAvatarUrl?: string;
  calendarIntegrationEnabled?: boolean;
  updatedAt: string;
  updatedBy: string;
}
