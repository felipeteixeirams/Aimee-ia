export type Tab = 'chat' | 'finance' | 'shopping' | 'routines' | 'settings';
export type Period = '7d' | '30d' | 'all';

export enum FinancialGoalCategory {
  TRAVEL = 'travel',
  RENOVATION = 'renovation',
  EDUCATION = 'education',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BLOCKED = 'blocked'
}

export enum AIRecommendedPersona {
  FUNNY = 'funny',
  ANALYTICAL = 'analytical',
  FRUGAL = 'frugal'
}

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
  theme?: 'light' | 'dark' | 'system';
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

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export enum ItemUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

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

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

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

export enum ShareStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export enum PermissionLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write'
}

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

export enum TaskCategory {
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  ERRAND = 'errand',
  OTHER = 'other'
}

export enum TaskStatus {
  TODO = 'todo',
  DONE = 'done'
}

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

export enum EventType {
  SOCIAL = 'social',
  HOLIDAY = 'holiday',
  APPOINTMENT = 'appointment'
}

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

export enum AIProvider {
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek'
}

export enum NotificationType {
  REQUEST = 'request',
  APPROVE = 'approve',
  REJECT = 'reject',
  BLOCK = 'block'
}

export interface NotificationPayload {
  type: NotificationType;
  email: string;
  name: string;
  days?: number;
}

export interface GlobalConfig {
  aiProvider: AIProvider;
  calendarIntegrationEnabled?: boolean;
  updatedAt: string;
  updatedBy: string;
}
