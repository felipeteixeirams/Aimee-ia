export type Tab = 'chat' | 'finance' | 'shopping' | 'routines' | 'settings';
export type Period = '7d' | '30d' | 'all';

export interface FinancialGoal {
  id?: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'travel' | 'renovation' | 'education' | 'emergency' | 'other';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  bio?: string;
  role?: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  blockedUntil?: string;
  selectedPersona?: 'funny' | 'analytical' | 'frugal';
  avatarUrl?: string;
  theme?: string;
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

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
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
  lastDepletedAt?: string; // When the item ran out
  urgency?: 'low' | 'medium' | 'high';
  isStock?: boolean; // If true, it's in the pantry, not the shopping list
  frequency?: number; // How many times it was added/bought
  isEcoFriendly?: boolean;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentType?: string;
  isInsight?: boolean;
  read?: boolean;
}

export interface Share {
  id?: string;
  ownerId: string;
  ownerEmail: string;
  sharedWithEmail: string;
  sharedWithId?: string;
  permissions: {
    finance: 'none' | 'read' | 'write';
    shopping: 'none' | 'read' | 'write';
    routines: 'none' | 'read' | 'write';
  };
  status: 'pending' | 'accepted' | 'declined';
  upgradeRequested?: boolean;
  createdAt: string;
}

export interface HouseholdTask {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: 'cleaning' | 'maintenance' | 'errand' | 'other';
  status: 'todo' | 'done';
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface FamilyEvent {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  type: 'social' | 'holiday' | 'appointment';
  googleEventId?: string;
  createdAt: string;
}

export interface GlobalConfig {
  aiProvider: 'gemini' | 'deepseek';
  calendarIntegrationEnabled?: boolean;
  updatedAt: string;
  updatedBy: string;
}
