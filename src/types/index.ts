export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  selectedPersona?: 'funny' | 'analytical' | 'frugal';
  avatarUrl?: string;
  preferences: {
    currency: string;
    notificationsEnabled: boolean;
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
  urgency?: 'low' | 'medium' | 'high';
  isStock?: boolean; // If true, it's in the pantry, not the shopping list
  frequency?: number; // How many times it was added/bought
}

export interface ChatMessage {
  id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentType?: string;
  isInsight?: boolean;
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
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}
