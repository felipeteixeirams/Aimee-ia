import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider
} from './lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  setDoc, 
  doc, 
  getDoc,
  deleteDoc,
  where,
  or,
  Timestamp,
  limit,
  getDocFromServer,
  getDocs
} from 'firebase/firestore';
import { orchestrator } from './services/aiService';
import { fetchGoogleCalendarEvents } from './services/calendarService';
import { ChatMessage, Transaction, ShoppingItem, UserProfile, Share, FinancialGoal, HouseholdTask, FamilyEvent, GlobalConfig } from './types';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { Login } from './components/Login';
import { 
  MessageSquare, 
  Wallet, 
  ShoppingCart, 
  Settings, 
  Send, 
  Plus, 
  LogOut, 
  User as UserIcon,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Circle,
  Shield,
  Mail,
  Trash2,
  Package,
  X,
  ChevronDown,
  Moon,
  Sun,
  Link as LinkIcon,
  Copy,
  Edit2,
  Check,
  Target,
  GraduationCap,
  Home,
  Plane,
  AlertCircle,
  Leaf,
  Apple,
  Calendar,
  CheckSquare,
  Clock,
  Sparkles,
  ShieldAlert,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { ptBR } from 'date-fns/locale';

type Tab = 'chat' | 'finance' | 'shopping' | 'routines' | 'settings';
type Period = '7d' | '30d' | 'all';

const GLOBAL_AIMEE_AVATAR = "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400";

const AimeeAvatar = ({ src, className, size = "md" }: { src: string, className?: string, size?: "sm" | "md" | "lg" }) => {
  const dimensions = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
  
  return (
    <div className={cn("relative overflow-hidden rounded-xl", dimensions, className)}>
      <motion.img 
        src={src} 
        className="w-full h-full object-cover" 
        alt="Aimee" 
        referrerPolicy="no-referrer"
        animate={{
          scale: [1, 1.08, 1],
          y: [0, -2, 0],
          filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [tasks, setTasks] = useState<HouseholdTask[]>([]);
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({ aiProvider: 'gemini', updatedAt: '', updatedBy: '' });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shares, setShares] = useState<Share[]>([]);
  const [activeSpace, setActiveSpace] = useState<string | null>(null); // null means own space
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState({ finance: 'read' as const, shopping: 'read' as const });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState<string | null>(null);
  const [financePeriod, setFinancePeriod] = useState<Period>('30d');
  const [financeCategory, setFinanceCategory] = useState<string>('all');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [shoppingFilter, setShoppingFilter] = useState<'list' | 'stock'>('list');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef<number>(0);
  const isAtBottomRef = useRef<boolean>(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    if (profile?.theme) {
      document.documentElement.setAttribute('data-theme', profile.theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [profile?.theme]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Ensure user profile exists
        const userRef = doc(db, 'users', u.uid);
        getDoc(userRef).then(async (docSnap) => {
          if (!docSnap.exists()) {
            try {
              await setDoc(userRef, {
                uid: u.uid,
                displayName: u.displayName || 'Usuário',
                email: u.email || '',
                role: u.email === 'felipeteixeirams@gmail.com' ? 'admin' : 'user',
                selectedPersona: 'analytical',
                avatarUrl: 'https://picsum.photos/seed/aimee1/200',
                preferences: {
                  currency: 'BRL',
                  notificationsEnabled: true
                },
                gamification: {
                  points: 0,
                  level: 1,
                  badges: [],
                  weeklyGoal: 500,
                  currentWeeklySpending: 0
                },
                location: {
                  city: 'São Paulo',
                  region: 'Sudeste'
                },
                healthGoals: {
                  dietType: 'balanced',
                  focus: ['Redução de Açúcar', 'Mais Proteína']
                }
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${u.uid}`);
            }
          }
        }).catch(error => handleFirestoreError(error, OperationType.GET, `users/${u.uid}`));
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen to Chat History
    const chatPath = `users/${user.uid}/chatHistory`;
    const chatQuery = query(
      collection(db, chatPath),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const unsubChat = onSnapshot(chatQuery, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      setMessages(msgs.reverse());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, chatPath);
    });

    // Listen to Profile
    const profilePath = `users/${user.uid}`;
    const unsubProfile = onSnapshot(doc(db, profilePath), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, profilePath);
    });

    // Listen to Shares (Sent and Received)
    const sharesPath = 'shares';
    const sharesQuery = query(
      collection(db, sharesPath),
      or(
        where('ownerId', '==', user.uid),
        where('sharedWithEmail', '==', user.email),
        where('sharedWithId', '==', user.uid)
      ),
      limit(50)
    );
    const unsubShares = onSnapshot(sharesQuery, (snap) => {
      const myShares = snap.docs.map(d => ({ id: d.id, ...d.data() } as Share));
      setShares(myShares);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, sharesPath);
    });

    // Listen to Transactions
    const targetId = activeSpace || user.uid;
    const transPath = `users/${targetId}/transactions`;
    const transQuery = query(
      collection(db, transPath),
      orderBy('date', 'desc')
    );
    const unsubTrans = onSnapshot(transQuery, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, transPath);
    });

    // Listen to Shopping List
    const shopPath = `users/${targetId}/shoppingList`;
    const shopQuery = query(
      collection(db, shopPath),
      orderBy('purchased', 'asc')
    );
    const unsubShop = onSnapshot(shopQuery, (snap) => {
      setShoppingList(snap.docs.map(d => ({ id: d.id, ...d.data() } as ShoppingItem)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, shopPath);
    });

    // Listen to Financial Goals
    const goalsPath = `users/${targetId}/goals`;
    const goalsQuery = query(
      collection(db, goalsPath),
      orderBy('createdAt', 'desc')
    );
    const unsubGoals = onSnapshot(goalsQuery, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() } as FinancialGoal)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, goalsPath);
    });

    // Listen to Tasks
    const tasksPath = `users/${targetId}/tasks`;
    const tasksQuery = query(
      collection(db, tasksPath),
      orderBy('createdAt', 'desc')
    );
    const unsubTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as HouseholdTask)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, tasksPath);
    });

    // Listen to Events
    const eventsPath = `users/${targetId}/events`;
    const eventsQuery = query(
      collection(db, eventsPath),
      orderBy('date', 'asc')
    );
    const unsubEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as FamilyEvent)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, eventsPath);
    });

    // Listen to Global Config
    const configPath = 'config/global';
    const unsubConfig = onSnapshot(doc(db, configPath), (snap) => {
      if (snap.exists()) {
        setGlobalConfig(snap.data() as GlobalConfig);
      }
    }, (error) => {
      // Config might not exist yet, ignore error
    });

    return () => {
      unsubChat();
      unsubProfile();
      unsubShares();
      unsubTrans();
      unsubShop();
      unsubGoals();
      unsubTasks();
      unsubEvents();
      unsubConfig();
    };
  }, [user, activeSpace]);

  useEffect(() => {
    if (!user || !profile || transactions.length === 0) return;

    // Calculate weekly spending
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklySpending = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfWeek)
      .reduce((acc, t) => acc + t.amount, 0);

    // Update profile if spending changed or points need updating
    if (weeklySpending !== (profile.gamification?.currentWeeklySpending ?? 0)) {
      const pointsToAdd = transactions.length * 5; // Simple point logic
      const level = Math.floor(pointsToAdd / 100) + 1;

      updateDoc(doc(db, 'users', user.uid), {
        'gamification.currentWeeklySpending': weeklySpending,
        'gamification.points': pointsToAdd,
        'gamification.level': level
      }).catch(err => console.error("Error updating gamification:", err));
    }
  }, [transactions, user, profile?.uid]);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
      isAtBottomRef.current = true;
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Only update if visible and has scroll
      if (clientHeight > 0) {
        lastScrollPos.current = scrollTop;
        const reachedBottom = scrollHeight - scrollTop - clientHeight < 50;
        isAtBottomRef.current = reachedBottom;
        setShowScrollButton(!reachedBottom);
      }
    }
  };

  // Restore scroll position on tab switch
  useEffect(() => {
    if (activeTab === 'chat') {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          if (lastScrollPos.current > 0) {
            scrollRef.current.scrollTop = lastScrollPos.current;
          } else if (isAtBottomRef.current) {
            scrollToBottom('auto');
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Keep bottom lock on messages/typing
  useEffect(() => {
    if (activeTab === 'chat' && isAtBottomRef.current) {
      // Use requestAnimationFrame for smoother timing with layout updates
      const rafId = requestAnimationFrame(() => {
        scrollToBottom('auto');
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [messages, isTyping, typingContent, activeTab]);

  const syncGoogleCalendar = async (token: string, targetUserId: string) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const googleEvents = await fetchGoogleCalendarEvents(token);
      
      if (googleEvents.length === 0) {
        // Double check if it was an empty calendar or an error that returned []
        // (Our fetchGoogleCalendarEvents currently catches and returns [] on error)
      }

      // Get existing events to avoid duplicates
      const eventsRef = collection(db, `users/${targetUserId}/events`);
      const existingEventsSnap = await getDocs(eventsRef);
      const existingGoogleIds = new Set(
        existingEventsSnap.docs
          .map(doc => (doc.data() as FamilyEvent).googleEventId)
          .filter(Boolean)
      );

      let count = 0;
      for (const gEvent of googleEvents) {
        if (gEvent.googleEventId && !existingGoogleIds.has(gEvent.googleEventId)) {
          await addDoc(eventsRef, {
            ...gEvent,
            userId: targetUserId,
            createdAt: new Date().toISOString()
          });
          count++;
        }
      }
      return count;
    } catch (error: any) {
      console.error("Sync error:", error);
      if (error.message?.includes("403")) {
        setCalendarBlocked(true);
        setSyncError("Acesso à agenda desativado ou não autorizado.");
      } else {
        setSyncError(error.message || "Erro desconhecido na sincronização");
      }
      return 0;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setCalendarBlocked(false); // Reset blocked state on new login attempt
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        // Store token in session storage temporarily for this session syncs
        sessionStorage.setItem('google_access_token', token);
        await syncGoogleCalendar(token, result.user.uid);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const typeText = async (text: string, speed = 10) => {
    return new Promise<void>((resolve) => {
      let currentText = '';
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          currentText += text[i];
          setTypingContent(currentText);
          i++;
        } else {
          clearInterval(interval);
          // Don't set typingContent to null immediately, wait for the message to be added to the list
          resolve();
        }
      }, speed);
    });
  };

  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    
    const dayOfWeek = format(date, 'EEEE', { locale: ptBR });
    const formattedDate = format(date, 'dd/MM/yyyy');
    return `${formattedDate} - ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditMessage = async (msg: ChatMessage) => {
    if (!msg.id || !user) return;
    
    const newValue = editValue.trim();
    if (!newValue) {
      setEditingMessage(null);
      return;
    }

    // If content didn't change, just close
    if (newValue === msg.content) {
      setEditingMessage(null);
      return;
    }

    try {
      // Update the message in Firestore
      await updateDoc(doc(db, `users/${user.uid}/chatHistory`, msg.id), {
        content: newValue,
        timestamp: new Date().toISOString()
      });
      
      setEditingMessage(null);
      
      // Small delay to let the UI update from the snapshot
      setTimeout(() => {
        handleSendMessage(newValue, true);
      }, 300);
      
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/chatHistory/${msg.id}`);
    }
  };

  const handleToggleShoppingItem = async (item: ShoppingItem) => {
    if (!item.id || !user) return;
    const targetId = activeSpace || user.uid;
    try {
      await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
        purchased: !item.purchased,
        lastPurchasedAt: !item.purchased ? new Date().toISOString() : item.lastPurchasedAt
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetId}/shoppingList/${item.id}`);
    }
  };

  const handleMoveToStock = async (item: ShoppingItem) => {
    if (!item.id || !user) return;
    const targetId = activeSpace || user.uid;
    try {
      await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
        isStock: true,
        purchased: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetId}/shoppingList/${item.id}`);
    }
  };

  const handleMoveToList = async (item: ShoppingItem) => {
    if (!item.id || !user) return;
    const targetId = activeSpace || user.uid;
    try {
      await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
        isStock: false,
        urgency: 'medium'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetId}/shoppingList/${item.id}`);
    }
  };

  const handleDeleteShoppingItem = async (item: ShoppingItem) => {
    if (!item.id || !user) return;
    const targetId = activeSpace || user.uid;
    try {
      await deleteDoc(doc(db, `users/${targetId}/shoppingList`, item.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetId}/shoppingList/${item.id}`);
    }
  };

  const handleSendMessage = async (overrideText?: any, skipAddDoc = false) => {
    const text = typeof overrideText === 'string' ? overrideText : inputText;
    if (!text || typeof text !== 'string' || !text.trim() || !user) return;

    if (!skipAddDoc) {
      const userMsg: ChatMessage = {
        userId: user.uid,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'users', user.uid, 'chatHistory'), userMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/chatHistory`);
      }
    }

    if (!overrideText) setInputText('');
    
    // Force scroll to bottom when sending a message
    setTimeout(() => scrollToBottom('smooth'), 100);
    
    setIsTyping(true);
    const response = await orchestrator(
      text, 
      messages, 
      user.uid, 
      shoppingList, 
      transactions, 
      goals,
      tasks,
      events,
      profile?.selectedPersona || 'funny', 
      globalConfig.aiProvider,
      activeSpace || undefined
    );
    setIsTyping(false);

    // Split response into blocks (paragraphs) for a more natural feel
    const blocks = response.split('\n\n').filter(b => b.trim());

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      await typeText(block, 8); 
      
      // Detect if this block is a financial insight
      const isInsight = /notei que|alerta|previsão|economia|média|comparando|insight/i.test(block);

      const aiMsg: any = {
        userId: user.uid,
        role: 'assistant',
        content: block,
        timestamp: new Date().toISOString(),
        isInsight
      };

      if (isInsight) {
        aiMsg.read = false;
      }
      
      try {
        await addDoc(collection(db, 'users', user.uid, 'chatHistory'), aiMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/chatHistory`);
      }
      
      // Keep the typing content visible for a moment after saving to DB
      // to allow the Firestore snapshot to update the messages list
      if (i === blocks.length - 1) {
        await new Promise(r => setTimeout(r, 600));
        setTypingContent(null);
      } else {
        // Between blocks, wait a bit then clear typing content to start the next block
        await new Promise(r => setTimeout(r, 400));
        setTypingContent(null);
      }
    }
  };

  const unreadInsights = useMemo(() => 
    messages.filter(m => m.isInsight && m.read === false), 
  [messages]);

  const handleGoToInsight = async (msg: ChatMessage) => {
    if (!msg.id) return;
    
    // Mark as read
    try {
      await updateDoc(doc(db, `users/${user!.uid}/chatHistory`, msg.id), { read: true });
    } catch (error) {
      console.error("Error marking insight as read:", error);
    }

    // Switch to chat tab if not already there
    if (activeTab !== 'chat') {
      setActiveTab('chat');
      // Wait for tab transition
      await new Promise(r => setTimeout(r, 100));
    }

    // Scroll to the message-
    const element = document.getElementById(`msg-${msg.id}`);
    if (element && scrollRef.current) {
      const container = scrollRef.current;
      const elementTop = element.offsetTop;
      container.scrollTo({
        top: elementTop - 100, // Offset for header/context
        behavior: 'smooth'
      });
      
      // Briefly highlight
      element.classList.add('ring-4', 'ring-brand/40', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-brand/40', 'ring-offset-2');
      }, 2000);
    }
    
    setShowInsightsModal(false);
  };

  const transactionsByPeriod = transactions.filter((t) => {
    const date = new Date(t.date);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    
    return financePeriod === 'all' || 
      (financePeriod === '7d' && diffDays <= 7) || 
      (financePeriod === '30d' && diffDays <= 30);
  });

  const filteredTransactions = transactionsByPeriod.filter(t => {
    return financeCategory === 'all' || t.category === financeCategory;
  });

  const totalIncome = transactionsByPeriod
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactionsByPeriod
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const chartData = useMemo(() => {
    const data: { name: string; income: number; expense: number }[] = [];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      const dayTransactions = transactions.filter(t => t.date.startsWith(date));
      const income = dayTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      data.push({
        name: format(new Date(date), 'dd/MM', { locale: ptBR }),
        income,
        expense
      });
    });
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    const expenses = transactionsByPeriod.filter(t => t.type === 'expense');
    const cats = Array.from(new Set(expenses.map(t => t.category))) as string[];
    
    cats.forEach(cat => {
      const total = expenses.filter(t => t.category === cat).reduce((acc, t) => acc + t.amount, 0);
      data.push({ name: cat, value: total });
    });
    return data.sort((a, b) => b.value - a.value);
  }, [transactionsByPeriod]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const behaviorData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = days.map(day => ({ name: day, value: 0 }));
    
    transactionsByPeriod
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const dayIndex = new Date(t.date).getDay();
        data[dayIndex].value += t.amount;
      });
    return data;
  }, [transactionsByPeriod]);

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'renovation': return <Home className="w-5 h-5" />;
      case 'emergency': return <AlertCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !user) return;
    
    const newShare: Share = {
      ownerId: user.uid,
      ownerEmail: user.email || '',
      sharedWithEmail: inviteEmail,
      permissions: invitePerms,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Deterministic ID: ownerId_sharedWithEmail
    const shareId = `${user.uid}_${inviteEmail}`;
    
    try {
      await setDoc(doc(db, 'shares', shareId), newShare);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shares/${shareId}`);
    }
    setInviteEmail('');
  };

  const handleAcceptInvite = async (share: Share) => {
    if (!user || !share.id) return;
    
    try {
      await updateDoc(doc(db, 'shares', share.id), {
        sharedWithId: user.uid,
        status: 'accepted'
      });
      setActiveSpace(share.ownerId);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shares/${share.id}`);
    }
  };

  const handleRequestUpgrade = async (share: Share) => {
    if (!share.id) return;
    try {
      await updateDoc(doc(db, 'shares', share.id), { 
        upgradeRequested: true,
        upgradeRequestedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shares/${share.id}`);
    }
  };

  const handleDeclineInvite = async (share: Share) => {
    if (!share.id) return;
    try {
      await updateDoc(doc(db, 'shares', share.id), { status: 'declined' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shares/${share.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="w-8 h-8 border-4 border-neutral-200 dark:border-neutral-800 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} isLoading={isLoggingIn} />;
  }

  const isSuperAdmin = profile?.role === 'admin' || user?.email === 'felipeteixeirams@gmail.com';

  const updateGlobalAIProvider = async (provider: 'gemini' | 'deepseek') => {
    if (!isSuperAdmin) return;
    try {
      await setDoc(doc(db, 'config', 'global'), {
        aiProvider: provider,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      });
    } catch (error) {
      console.error("Error updating global config:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => unreadInsights.length > 0 && setShowInsightsModal(true)}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all active:scale-95",
                unreadInsights.length > 0 ? "cursor-pointer" : "cursor-default"
              )}
            >
              {unreadInsights.length > 0 && (
                <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
                  <motion.div 
                    className="absolute inset-[ -100%] bg-conic-gradient from-brand via-amber-400 to-brand"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ 
                      background: `conic-gradient(from 0deg, var(--color-brand), #fbbf24, var(--color-brand))` 
                    }}
                  />
                </div>
              )}
              <div className="absolute inset-[2px] bg-white dark:bg-neutral-900 rounded-[10px] z-10 overflow-hidden">
                <AimeeAvatar src={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR} className="w-full h-full" />
              </div>
            </button>
            {unreadInsights.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center z-30 border-2 border-white dark:border-neutral-900 shadow-sm animate-bounce pointer-events-none">
                {unreadInsights.length}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">Aimee</h2>
            </div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
              {activeSpace ? `Espaço Compartilhado` : 
               profile?.selectedPersona === 'analytical' ? 'Modo Analítico' : 
               profile?.selectedPersona === 'frugal' ? 'Modo Econômico' : 'Online'} • Gemini 3
            </p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col relative"
            >
              <div 
                ref={scrollRef} 
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4"
              >
                {messages.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                    </div>
                    <p className="text-neutral-400 text-sm">Como posso te ajudar hoje?</p>
                  </div>
                )}
                {messages.reduce((acc: any[], msg, i) => {
                  const dateStr = msg.timestamp.split('T')[0];
                  const prevDateStr = i > 0 ? messages[i-1].timestamp.split('T')[0] : null;
                  
                  if (dateStr !== prevDateStr) {
                    acc.push(
                      <div key={`sep-${dateStr}`} className="flex justify-center my-6">
                        <span className="px-3 py-1 bg-neutral-50 dark:bg-neutral-900/50 text-[10px] text-neutral-400 font-medium rounded-full uppercase tracking-widest">
                          {formatDateSeparator(msg.timestamp)}
                        </span>
                      </div>
                    );
                  }
                  
                  acc.push(
                    <motion.div 
                      key={msg.id || i} 
                      id={`msg-${msg.id}`}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn("flex group", msg.role === 'user' ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all break-words whitespace-pre-wrap",
                        msg.role === 'user' 
                          ? "bg-brand text-brand-foreground rounded-tr-none shadow-md" 
                          : msg.isInsight
                            ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 rounded-tl-none ring-1 ring-amber-500/20"
                            : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none"
                      )}>
                        {msg.isInsight && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200/50 dark:border-amber-800/50">
                            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Insight Financeiro</span>
                          </div>
                        )}
                        {editingMessage?.id === msg.id ? (
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm p-0 text-brand-foreground placeholder:text-brand-foreground/50"
                              autoFocus
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingMessage(null)} className="p-1 hover:bg-black/10 rounded transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleEditMessage(msg)} className="p-1 hover:bg-black/10 rounded transition-colors">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {msg.content}
                            <div className={cn(
                              "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex gap-1",
                              msg.role === 'user' ? "right-full mr-2" : "left-full ml-2"
                            )}>
                              <button 
                                onClick={() => copyToClipboard(msg.content, msg.id || i.toString())}
                                className="p-1.5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg shadow-sm text-neutral-400 hover:text-brand transition-colors relative"
                                title="Copiar"
                              >
                                {copiedId === (msg.id || i.toString()) ? (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                <AnimatePresence>
                                  {copiedId === (msg.id || i.toString()) && (
                                    <motion.span 
                                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                                      exit={{ opacity: 0, y: -10, x: '-50%' }}
                                      className="absolute bottom-full mb-2 left-1/2 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-xl border border-neutral-700/50 z-50"
                                    >
                                      Copiado para a área de transferência!
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>
                              {msg.role === 'user' && (
                                <button 
                                  onClick={() => {
                                    setEditingMessage(msg);
                                    setEditValue(msg.content);
                                  }}
                                  className="p-1.5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg shadow-sm text-neutral-400 hover:text-brand transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                  return acc;
                }, [])}
                {typingContent && (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {typingContent}
                    </div>
                  </motion.div>
                )}
                {isTyping && (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Scroll to Bottom Button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => scrollToBottom('smooth')}
                    className="absolute bottom-24 right-6 p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-full shadow-lg text-neutral-500 hover:text-brand transition-all z-20"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
              <div className="p-4 md:p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
                <div className="flex gap-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Fale com seu agente..."
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white shadow-sm group-hover:shadow-md"
                    />
                    <div className="absolute inset-0 rounded-2xl border border-brand/0 group-focus-within:border-brand/20 transition-all pointer-events-none" />
                  </div>
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                    className="w-14 h-14 bg-brand text-brand-foreground rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:scale-100 group"
                  >
                    <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'finance' && (
            <motion.div 
              key="finance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8 no-scrollbar"
            >
              {/* Gamification & Goals Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-brand to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Nível {profile?.gamification?.level || 1}</p>
                          <p className="text-lg font-black tracking-tight">Mestre das Finanças</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pontos</p>
                        <p className="text-xl font-black">{profile?.gamification?.points || 0}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>Progresso do Nível</span>
                        <span>{(profile?.gamification?.points || 0) % 100}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(profile?.gamification?.points || 0) % 100}%` }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Meta Semanal</p>
                        <p className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">R$ {profile?.gamification?.weeklyGoal || 500}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Gasto Atual</p>
                      <p className={cn(
                        "text-xl font-black",
                        (profile?.gamification?.currentWeeklySpending || 0) > (profile?.gamification?.weeklyGoal || 500) ? "text-rose-500" : "text-emerald-500"
                      )}>
                        R$ {profile?.gamification?.currentWeeklySpending || 0}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      <span>Uso do Orçamento</span>
                      <span>{Math.min(100, Math.round(((profile?.gamification?.currentWeeklySpending || 0) / (profile?.gamification?.weeklyGoal || 500)) * 100))}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((profile?.gamification?.currentWeeklySpending || 0) / (profile?.gamification?.weeklyGoal || 500)) * 100)}%` }}
                        className={cn(
                          "h-full rounded-full",
                          (profile?.gamification?.currentWeeklySpending || 0) > (profile?.gamification?.weeklyGoal || 500) ? "bg-rose-500" : "bg-brand"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Dashboards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Evolução Diária</h4>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                        <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Gastos por Categoria</h4>
                    <PieChart className="w-4 h-4 text-brand" />
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Goals & Behavior Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Behavioral Analysis */}
                <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Padrão Semanal</h4>
                    <TrendingUp className="w-4 h-4 text-brand" />
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={behaviorData}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                          {behaviorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? COLORS[index % COLORS.length] : '#f3f4f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-4 text-[10px] text-neutral-400 font-medium leading-relaxed">
                    Seus gastos tendem a se concentrar nos fins de semana. Considere planejar melhor suas compras de lazer.
                  </p>
                </div>

                {/* Financial Goals */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Metas de Longo Prazo</h4>
                    <button className="text-brand hover:bg-brand/10 p-2 rounded-xl transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {goals.map((goal, i) => (
                      <div key={goal.id || i} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-sm text-brand">
                            {getGoalIcon(goal.category)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-neutral-800 dark:text-white truncate">{goal.title}</p>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                              R$ {goal.currentAmount} / R$ {goal.targetAmount}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                              className="h-full bg-brand rounded-full"
                            />
                          </div>
                          <p className="text-[9px] font-bold text-brand text-right uppercase tracking-widest">
                            {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% concluído
                          </p>
                        </div>
                      </div>
                    ))}
                    {goals.length === 0 && (
                      <div className="col-span-full py-10 text-center">
                        <Target className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                        <p className="text-xs text-neutral-400">Nenhuma meta criada. Peça para a Aimee ajudar!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Benchmarking Alert */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-amber-900 dark:text-amber-100 mb-1">Benchmarking Familiar</h5>
                  <p className="text-xs text-amber-800/70 dark:text-amber-200/60 leading-relaxed">
                    Notei que seus gastos com **Delivery** estão 15% acima da média regional para famílias do seu perfil em {profile?.location?.city || 'sua cidade'}. 
                    Que tal um desafio de cozinhar em casa este final de semana?
                  </p>
                </div>
              </div>

              {/* Bento Grid: Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-emerald-500 p-4 md:p-5 rounded-[2rem] text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
                  <div className="relative z-10 flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Total Ganhos</p>
                      <p className="text-xl md:text-2xl font-black leading-tight">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-rose-500 p-4 md:p-5 rounded-[2rem] text-white shadow-lg shadow-rose-500/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
                  <div className="relative z-10 flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                      <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Total Gastos</p>
                      <p className="text-xl md:text-2xl font-black leading-tight">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4 }}
                  className="sm:col-span-2 md:col-span-1 bg-white dark:bg-neutral-900 p-4 md:p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-center"
                >
                  <p className="text-[8px] md:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Saldo Atual</p>
                  <p className={cn(
                    "text-xl md:text-2xl font-black leading-tight",
                    (totalIncome - totalExpense) >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", (totalIncome - totalExpense) >= 0 ? "bg-emerald-500" : "bg-rose-500")} />
                    <span className="text-[8px] md:text-[9px] font-bold text-neutral-400 uppercase">Status da Conta</span>
                  </div>
                </motion.div>
              </div>

              {/* Category Filter - Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                <button
                  onClick={() => setFinanceCategory('all')}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm",
                    financeCategory === 'all' 
                      ? "bg-brand border-brand text-brand-foreground scale-105" 
                      : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  Todas Categorias
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFinanceCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm",
                      financeCategory === cat 
                        ? "bg-brand border-brand text-brand-foreground scale-105" 
                        : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-brand/30"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Fluxo de Caixa</h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase text-neutral-400">Ganhos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold uppercase text-neutral-400">Gastos</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#333" : "#f0f0f0"} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#999', fontWeight: 'bold'}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#999', fontWeight: 'bold'}} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#171717' : '#fff', 
                            borderRadius: '24px', 
                            border: 'none', 
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            padding: '16px'
                          }} 
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="income" name="Ganhos" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" name="Gastos" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Gastos por Categoria</h3>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={70}
                          paddingAngle={6}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#171717' : '#fff', 
                            borderRadius: '20px', 
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-[8px] font-bold text-neutral-400 uppercase">Total</p>
                      <p className="text-base font-black">R$ {totalExpense.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    {categoryData.slice(0, 3).map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">{cat.name}</span>
                        </div>
                        <span className="text-[10px] font-black">R$ {cat.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black tracking-tight">Transações Recentes</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                      {filteredTransactions.length} itens
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTransactions.map((t, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
                          t.type === 'income' 
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                            : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                        )}>
                          {t.type === 'income' ? <TrendingUp className="w-5 h-5 md:w-6 md:h-6" /> : <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-neutral-800 dark:text-neutral-100 truncate">{t.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase truncate max-w-[80px]">{t.category}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase shrink-0">{format(new Date(t.date), 'dd MMM', { locale: ptBR })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={cn("text-sm md:text-base font-black whitespace-nowrap", t.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                          {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[8px] md:text-[9px] font-bold text-neutral-300 dark:text-neutral-600 uppercase">Confirmado</p>
                      </div>
                    </motion.div>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-[3rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800">
                      <Wallet className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                      <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Nenhuma transação encontrada</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div 
              key="shopping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {shoppingFilter === 'list' ? 'Lista de Compras' : 'Estoque Doméstico'}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                    {shoppingList.filter(i => shoppingFilter === 'stock' ? i.isStock : !i.isStock).length} itens encontrados
                  </p>
                </div>
                <button className="w-10 h-10 bg-brand text-brand-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                <button 
                  onClick={() => setShoppingFilter('list')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                    shoppingFilter === 'list' ? "bg-white dark:bg-neutral-700 shadow-sm text-brand" : "text-neutral-400"
                  )}
                >
                  Lista
                </button>
                <button 
                  onClick={() => setShoppingFilter('stock')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                    shoppingFilter === 'stock' ? "bg-white dark:bg-neutral-700 shadow-sm text-brand" : "text-neutral-400"
                  )}
                >
                  Estoque
                </button>
              </div>

              <div className="space-y-3">
                {shoppingList
                  .filter(item => shoppingFilter === 'stock' ? item.isStock : !item.isStock)
                  .sort((a, b) => {
                    const urgencyMap = { high: 0, medium: 1, low: 2 };
                    return (urgencyMap[a.urgency || 'medium'] || 1) - (urgencyMap[b.urgency || 'medium'] || 1);
                  })
                  .map((item, i) => (
                  <div key={item.id || i} className={cn(
                    "bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm transition-all hover:shadow-md group",
                    item.purchased && "opacity-50 grayscale"
                  )}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button 
                        onClick={() => handleToggleShoppingItem(item)}
                        className="text-neutral-300 dark:text-neutral-700 hover:text-brand transition-colors shrink-0"
                      >
                        {item.purchased ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-black text-neutral-800 dark:text-neutral-100 truncate", item.purchased && "line-through")}>
                            {item.name}
                          </p>
                          {item.urgency === 'high' && !item.isStock && (
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          )}
                          {item.isEcoFriendly && (
                            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                            {item.category} • Qtd: {item.quantity}
                          </p>
                          {item.frequency && item.frequency > 2 && (
                            <span className="text-[8px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-bold uppercase">Recorrente</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {shoppingFilter === 'list' ? (
                        <button 
                          onClick={() => handleMoveToStock(item)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-brand transition-colors"
                          title="Mover para Estoque"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleMoveToList(item)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-brand transition-colors"
                          title="Mover para Lista"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteShoppingItem(item)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {shoppingList.filter(i => shoppingFilter === 'stock' ? i.isStock : !i.isStock).length === 0 && (
                  <div className="text-center py-20">
                    {shoppingFilter === 'list' ? (
                      <ShoppingCart className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                    ) : (
                      <Package className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                    )}
                    <p className="text-neutral-400 text-sm">
                      {shoppingFilter === 'list' ? 'Sua lista está vazia.' : 'Seu estoque está vazio.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-brand p-6 rounded-3xl text-brand-foreground shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Sugestões da Aimee</h4>
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-lg">
                    <Apple className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">{profile?.healthGoals?.dietType === 'balanced' ? 'Dieta Balanceada' : 'Foco em Saúde'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {shoppingList
                    .filter(i => i.frequency && i.frequency > 3 && i.isStock)
                    .slice(0, 2)
                    .map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-brand-foreground/10 rounded-xl">
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[10px] opacity-60">Previsão: Acaba em 2 dias.</p>
                        </div>
                        <button 
                          onClick={() => handleMoveToList(item)}
                          className="p-2 hover:bg-brand-foreground/20 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  {shoppingList.filter(i => i.frequency && i.frequency > 3 && i.isStock).length === 0 && (
                    <p className="text-xs opacity-60 italic">Continue usando para receber previsões de consumo e dicas nutricionais.</p>
                  )}
                </div>
              </div>

              {profile?.healthGoals && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-[2rem]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                      <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h5 className="text-sm font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Foco Nutricional</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthGoals.focus.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-white dark:bg-neutral-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800 shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-emerald-800/70 dark:text-emerald-200/60 leading-relaxed">
                    Aimee está priorizando itens com baixo índice glicêmico e proteínas magras para sua lista.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'routines' && (
            <motion.div 
              key="routines"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-24"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">Rotinas Familiares</h2>
                  <p className="text-xs text-neutral-500 font-medium">Tarefas e agenda da casa</p>
                </div>
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-brand" />
                </div>
              </div>

              {/* Family Agenda */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Agenda</p>
                      <p className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Próximos Eventos</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const token = sessionStorage.getItem('google_access_token');
                      if (token && user) {
                         await syncGoogleCalendar(token, activeSpace || user.uid);
                      } else {
                         // Force re-login if no token in session (safety)
                         handleLogin();
                      }
                    }}
                    disabled={isSyncing || calendarBlocked}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all border border-neutral-100 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider",
                      (isSyncing || calendarBlocked) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5 text-brand", isSyncing && "animate-spin")} />
                    {calendarBlocked ? 'Agenda Bloqueada' : (isSyncing ? 'Sincronizando...' : 'Sincronizar')}
                  </button>
                </div>

                {syncError && (
                  <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                      <AlertCircle className="w-4 h-4" />
                      <span>{syncError}</span>
                    </div>
                    {calendarBlocked && (
                      <div className="space-y-3">
                        <p className="text-[11px] text-rose-800/70 dark:text-rose-200/60 leading-relaxed font-medium">
                          A API do Google Agenda precisa ser ativada manualmente no console do projeto para que esta integração funcione.
                        </p>
                        <a 
                          href="https://console.cloud.google.com/apis/library/calendar.googleapis.com?project=gen-lang-client-0588616761"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200 dark:shadow-none"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          Ativar API no Console
                        </a>
                        <p className="text-[9px] text-rose-600/50 dark:text-rose-400/40 italic">
                          Após clicar em "ATIVAR", aguarde 30 segundos e tente sincronizar novamente.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {events.length > 0 ? events.map((event, i) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                      <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-xl flex flex-col items-center justify-center border border-neutral-100 dark:border-neutral-800 shrink-0">
                        <span className="text-[10px] font-bold text-brand uppercase">{format(new Date(event.date), 'MMM', { locale: ptBR })}</span>
                        <span className="text-lg font-black text-neutral-800 dark:text-white leading-none">{format(new Date(event.date), 'dd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-800 dark:text-white truncate">{event.title}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{event.description || 'Sem descrição'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={cn(
                          "px-2 py-1 rounded-full text-[8px] font-bold uppercase",
                          event.type === 'social' ? "bg-purple-100 text-purple-600" :
                          event.type === 'holiday' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {event.type}
                        </div>
                        <button 
                          onClick={() => event.id && deleteDoc(doc(db, `users/${activeSpace || user.uid}/events/${event.id}`))}
                          className="p-1.5 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                          title="Remover evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-8 text-sm text-neutral-400 italic">Nenhum evento agendado.</p>
                  )}
                </div>
              </div>

              {/* Household Tasks */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tarefas</p>
                      <p className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Lista de Afazeres</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.length > 0 ? tasks.map((task, i) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 group">
                      <button 
                        onClick={() => updateDoc(doc(db, `users/${activeSpace || user.uid}/tasks/${task.id}`), { status: task.status === 'done' ? 'todo' : 'done' })}
                        className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          task.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-200 dark:border-neutral-700"
                        )}
                      >
                        {task.status === 'done' && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-bold transition-all",
                          task.status === 'done' ? "text-neutral-400 line-through" : "text-neutral-800 dark:text-white"
                        )}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold uppercase text-neutral-400">{task.category}</span>
                          {task.assignedTo && (
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-brand/10 text-brand rounded-full">@{task.assignedTo}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteDoc(doc(db, `users/${activeSpace || user.uid}/tasks/${task.id}`))}
                        className="p-2 text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-center py-8 text-sm text-neutral-400 italic">Tudo limpo por aqui!</p>
                  )}
                </div>
              </div>

              {/* Cross-Insights & Contextual Awareness */}
              <div className="bg-brand/5 p-6 rounded-[2.5rem] border border-brand/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Insights da Aimee</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-brand/10 shadow-sm">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      <span className="font-bold text-brand">Dica de Contexto:</span> O feriado de Páscoa está chegando! Notei que você ainda não tem itens para o almoço de domingo na lista. Quer que eu sugira um cardápio econômico?
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-brand/10 shadow-sm">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      <span className="font-bold text-brand">Insight Cruzado:</span> Se reduzirmos a compra de refrigerantes e doces em 20%, você economiza cerca de <span className="font-bold text-emerald-500">R$ 85,00/mês</span> e atinge sua meta de saúde mais rápido!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8 no-scrollbar"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Configurações</h3>
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Perfil do Usuário</p>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <img src={user.photoURL || ''} className="w-16 h-16 rounded-[1.8rem] object-cover shadow-lg transition-transform group-hover:scale-105" alt="Avatar" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-neutral-900 rounded-full shadow-sm" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-neutral-800 dark:text-neutral-100 tracking-tight truncate max-w-[200px]" title={user.displayName || ''}>
                        {(() => {
                          const name = user.displayName || 'Usuário';
                          const words = name.trim().split(/\s+/);
                          if (words.length <= 1) return name;
                          
                          // Custom logic: only show whole words, and if the last word is <= 3 chars, remove it.
                          // We use a safe max length for the container.
                          const MAX_LEN = 20;
                          if (name.length <= MAX_LEN) return name;

                          let current = words[0];
                          let lastValid = words[0];
                          
                          for (let i = 1; i < words.length; i++) {
                            const next = words[i];
                            const temp = `${current} ${next}`;
                            if (temp.length > MAX_LEN) break;
                            current = temp;
                            if (next.length > 3) {
                              lastValid = current;
                            }
                          }
                          return lastValid;
                        })()}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-medium tracking-wide opacity-80 truncate max-w-[200px]" title={user.email || ''}>
                        {(user.email || '').toLowerCase()}
                      </p>
                      {isSuperAdmin && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-brand/10 text-brand text-[8px] font-black uppercase rounded-full">Super Admin</span>
                      )}
                    </div>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="bg-brand/5 dark:bg-brand/10 p-6 rounded-[2.5rem] border border-brand/20 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Painel do Administrador</p>
                        <h4 className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Configuração Global de IA</h4>
                      </div>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={() => setShowAIDropdown(!showAIDropdown)}
                        className="w-full p-4 bg-white dark:bg-neutral-800 rounded-3xl border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between transition-all hover:border-brand shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                            {globalConfig.aiProvider === 'gemini' ? (
                              <Sparkles className="w-6 h-6 text-brand" />
                            ) : (
                              <Zap className="w-6 h-6 text-brand" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-black text-neutral-800 dark:text-white">
                              {globalConfig.aiProvider === 'gemini' ? 'Google Gemini' : 'DeepSeek AI'}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                              {globalConfig.aiProvider === 'gemini' ? 'Padrão do Sistema' : 'Alta Performance'}
                            </p>
                          </div>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-neutral-400 transition-transform", showAIDropdown && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {showAIDropdown && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowAIDropdown(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute top-full left-0 right-0 mt-3 p-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
                            >
                              <div className="space-y-2">
                                {[
                                  { id: 'gemini' as const, label: 'Google Gemini', icon: Sparkles, desc: 'Padrão do Sistema' },
                                  { id: 'deepseek' as const, label: 'DeepSeek AI', icon: Zap, desc: 'Alta Performance' }
                                ].map((option) => (
                                  <button
                                    key={option.id}
                                    onClick={() => {
                                      updateGlobalAIProvider(option.id);
                                      setShowAIDropdown(false);
                                    }}
                                    className={cn(
                                      "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group",
                                      globalConfig.aiProvider === option.id 
                                        ? "bg-brand/5 dark:bg-brand/10 border-brand/20 border" 
                                        : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                      globalConfig.aiProvider === option.id 
                                        ? "bg-brand/20 scale-110" 
                                        : "bg-neutral-100 dark:bg-neutral-700 group-hover:scale-110"
                                    )}>
                                      <option.icon className={cn("w-5 h-5", globalConfig.aiProvider === option.id ? "text-brand" : "text-neutral-400")} />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                      <p className={cn("text-sm font-black", globalConfig.aiProvider === option.id ? "text-brand" : "text-neutral-800 dark:text-white")}>
                                        {option.label}
                                      </p>
                                      <p className="text-[9px] text-neutral-500 font-bold uppercase">{option.desc}</p>
                                    </div>
                                    {globalConfig.aiProvider === option.id && (
                                      <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/20">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <p className="mt-4 text-[10px] text-neutral-500 italic">
                      * Esta alteração afeta todos os usuários do sistema instantaneamente. Certifique-se de que a chave DEEPSEEK_API_KEY está configurada.
                    </p>
                  </div>
                )}

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Aparência do Sistema</p>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {/* Theme Toggle (Light/Dark) */}
                    <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-[1.5rem] relative isolate">
                      <motion.div 
                        className="absolute inset-y-1 bg-white dark:bg-neutral-700 rounded-2xl shadow-md z-0"
                        initial={false}
                        animate={{ 
                          x: isDarkMode ? '100%' : '0%',
                          width: 'calc(50% - 4px)'
                        }}
                        transition={{ 
                          type: "tween", 
                          ease: "easeInOut",
                          duration: 0.3
                        }}
                        style={{ left: 4 }}
                      />
                      {[
                        { id: 'light', label: 'Claro', icon: Sun, value: false },
                        { id: 'dark', label: 'Escuro', icon: Moon, value: true }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setIsDarkMode(mode.value)}
                          className={cn(
                            "relative flex items-center justify-center gap-2 py-3 z-10 text-[10px] font-black uppercase transition-colors duration-300",
                            isDarkMode === mode.value ? "text-brand" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                          )}
                        >
                          <motion.div
                            animate={{ 
                              scale: isDarkMode === mode.value ? 1.1 : 1,
                              rotate: isDarkMode === mode.value ? (mode.value ? 10 : -10) : 0
                            }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                          >
                            <mode.icon className="w-3.5 h-3.5" />
                          </motion.div>
                          <span className="relative">
                            {mode.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Accent Color Selection */}
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-3">
                        {[
                          { id: 'default', color: isDarkMode ? '#fafafa' : '#171717', label: 'Padrão' },
                          { id: 'blue', color: isDarkMode ? '#60a5fa' : '#2563eb', label: 'Azul' },
                          { id: 'rose', color: isDarkMode ? '#fb7185' : '#e11d48', label: 'Rosa' },
                          { id: 'emerald', color: isDarkMode ? '#34d399' : '#059669', label: 'Verde' },
                          { id: 'violet', color: isDarkMode ? '#a78bfa' : '#7c3aed', label: 'Roxo' },
                          { id: 'amber', color: isDarkMode ? '#fbbf24' : '#d97706', label: 'Âmbar' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateDoc(doc(db, 'users', user.uid), { theme: t.id })}
                            title={t.label}
                            className="relative w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-125 hover:z-10 group"
                            style={{ backgroundColor: t.color }}
                          >
                            {(profile?.theme || 'default') === t.id && (
                              <motion.div 
                                layoutId="color-accent-active"
                                className="absolute -inset-1.5 border-2 border-brand/20 dark:border-brand/40 rounded-full"
                              />
                            )}
                            {(profile?.theme || 'default') === t.id && (
                              <Check className={cn("w-3 h-3 z-10", isDarkMode && t.id === 'default' ? "text-black" : "text-white")} />
                            )}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                              {t.label}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="h-6 w-[1px] bg-neutral-100 dark:bg-neutral-800 mx-1" />
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Sotaque</span>
                        <span className="text-[10px] font-bold text-brand uppercase">{profile?.theme === 'default' || !profile?.theme ? 'Padrão' : profile.theme}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Personalidade da Aimee</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'funny', label: 'Divertida', icon: '😄' },
                      { id: 'analytical', label: 'Analítica', icon: '🧐' },
                      { id: 'frugal', label: 'Econômica', icon: '💰' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => updateDoc(doc(db, 'users', user.uid), { selectedPersona: p.id })}
                        className={cn(
                          "flex flex-col items-center p-4 rounded-3xl border transition-all",
                          profile?.selectedPersona === p.id 
                            ? "bg-brand border-brand text-brand-foreground shadow-lg shadow-brand/20 scale-105" 
                            : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        )}
                      >
                        <span className="text-2xl mb-2">{p.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Avatar da Aimee</p>
                    <span className="text-[8px] font-black bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase">Digital Art & Cinematic</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: '1', url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400' },
                      { id: '2', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400' },
                      { id: '3', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400' },
                      { id: '4', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
                      { id: '5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
                      { id: '6', url: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&q=80&w=400' },
                      { id: '7', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
                      { id: '8', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' }
                    ].map((avatar) => {
                      const isSelected = (profile?.avatarUrl || GLOBAL_AIMEE_AVATAR) === avatar.url;
                      
                      return (
                        <button
                          key={avatar.id}
                          onClick={() => updateDoc(doc(db, 'users', user.uid), { avatarUrl: avatar.url })}
                          className={cn(
                            "group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all p-1",
                            isSelected 
                              ? "border-brand bg-brand/5 shadow-lg shadow-brand/10 scale-110 z-10" 
                              : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:scale-110 hover:border-neutral-300 dark:hover:border-neutral-600"
                          )}
                        >
                          <div className={cn(
                            "w-full h-full rounded-[1.6rem] overflow-hidden bg-white dark:bg-neutral-900 transition-all",
                            isSelected ? "scale-95 shadow-inner" : ""
                          )}>
                            <AimeeAvatar src={avatar.url} className="w-full h-full rounded-none" />
                          </div>
                          {isSelected && (
                            <motion.div 
                              layoutId="avatar-check"
                              className="absolute top-0 right-0 w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 z-20"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mb-3 ml-1 tracking-wider opacity-70">URL Personalizada</p>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg group-focus-within:bg-brand/10 transition-colors">
                        <LinkIcon className="w-3.5 h-3.5 text-neutral-400 group-focus-within:text-brand transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="https://exemplo.com/imagem.jpg"
                        defaultValue={profile?.avatarUrl || ''}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val && val !== profile?.avatarUrl) {
                            updateDoc(doc(db, 'users', user.uid), { avatarUrl: val });
                          }
                        }}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[1.8rem] pl-14 pr-6 py-4 text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Sharing Section */}
              <div className="bg-white dark:bg-neutral-900 p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black tracking-tight">Espaço e Compartilhamento</h4>
                    <p className="text-xs text-neutral-500 font-medium">Gerencie quem tem acesso ao seu espaço familiar</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                    <Users className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                  {activeSpace ? (
                    <div className="space-y-4">
                      {shares.filter(s => s.ownerId === activeSpace && s.sharedWithId === user.uid && s.status === 'accepted').map(s => (
                        <div key={s.id} className="bg-brand text-brand-foreground p-5 rounded-3xl space-y-4 shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                          
                          <div className="flex items-center justify-between relative z-10">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Espaço Ativo</p>
                              <p className="text-base font-bold">{s.ownerEmail}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          <div className="flex gap-3 relative z-10">
                            <div className="flex-1 p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5">
                              <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Finanças</p>
                              <p className="text-[10px] font-bold uppercase">{s.permissions.finance === 'write' ? 'Escrita' : 'Leitura'}</p>
                            </div>
                            <div className="flex-1 p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5">
                              <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Compras</p>
                              <p className="text-[10px] font-bold uppercase">{s.permissions.shopping === 'write' ? 'Escrita' : 'Leitura'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 relative z-10">
                            {(s.permissions.finance === 'read' || s.permissions.shopping === 'read') && (
                              <button 
                                onClick={() => handleRequestUpgrade(s)}
                                disabled={!!(s as any).upgradeRequested}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {(s as any).upgradeRequested ? (
                                  <>
                                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                                    Solicitação Enviada
                                  </>
                                ) : 'Solicitar Permissão de Escrita'}
                              </button>
                            )}

                            <button 
                              onClick={() => setActiveSpace(null)}
                              className="w-full py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 rounded-2xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              Sair do Espaço
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Pending Invitations */}
                      {shares.filter(s => s.status === 'pending' && s.sharedWithEmail === user.email).length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                              Convites Recebidos
                            </p>
                          </div>
                          {shares.filter(s => s.status === 'pending' && s.sharedWithEmail === user.email).map(s => (
                            <div key={s.id} className="flex items-center justify-between gap-4 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center border border-rose-100 dark:border-rose-900/30 text-rose-500 shrink-0">
                                  <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{s.ownerEmail}</p>
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">Convidou você para o espaço</p>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button 
                                  onClick={() => handleAcceptInvite(s)} 
                                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all active:scale-90"
                                  title="Aceitar"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleDeclineInvite(s)} 
                                  className="p-2 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-all active:scale-90"
                                  title="Recusar"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Invite Form */}
                      <div className="p-5 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Novo Convite</p>
                          <Users className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input 
                              type="email" 
                              placeholder="E-mail do familiar"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-neutral-400 uppercase ml-1">Finanças</p>
                            <select 
                              value={invitePerms.finance}
                              onChange={(e) => setInvitePerms({...invitePerms, finance: e.target.value as any})}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white appearance-none"
                            >
                              <option value="none">Nenhum</option>
                              <option value="read">Leitura</option>
                              <option value="write">Escrita</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-neutral-400 uppercase ml-1">Compras</p>
                            <select 
                              value={invitePerms.shopping}
                              onChange={(e) => setInvitePerms({...invitePerms, shopping: e.target.value as any})}
                              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white appearance-none"
                            >
                              <option value="none">Nenhum</option>
                              <option value="read">Leitura</option>
                              <option value="write">Escrita</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          onClick={handleInvite}
                          disabled={!inviteEmail.trim()}
                          className="w-full bg-brand text-brand-foreground py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        >
                          Enviar Convite
                        </button>
                      </div>

                              {/* Active & Sent Shares */}
                      <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Gestão de Acessos</p>
                        
                        {/* Sent Invitations (Pending/Declined) */}
                        {shares.filter(s => s.ownerId === user.uid && s.status !== 'accepted').map(s => (
                          <div key={s.id} className="flex items-center justify-between gap-4 p-4 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shrink-0">
                                <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200 truncate">{s.sharedWithEmail}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap",
                                    s.status === 'pending' 
                                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" 
                                      : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                                  )}>
                                    {s.status === 'pending' ? 'Pendente' : 'Recusado'}
                                  </span>
                                  {(s as any).upgradeRequested && (
                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-rose-500 text-white rounded-full animate-pulse whitespace-nowrap">Upgrade Solicitado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteDoc(doc(db, 'shares', s.id!))}
                              className="p-2 text-neutral-300 hover:text-rose-500 dark:text-neutral-700 dark:hover:text-rose-400 transition-colors shrink-0"
                              title="Remover"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}

                        {/* Accepted Shares (Where I am the owner) */}
                        {shares.filter(s => s.status === 'accepted' && s.ownerId === user.uid).map(s => (
                          <div key={s.id} className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand dark:text-brand shrink-0">
                                <UserIcon className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{s.sharedWithEmail}</p>
                                <div className="flex items-center gap-2 mt-1 overflow-x-auto no-scrollbar">
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full shrink-0">
                                    <Wallet className="w-2.5 h-2.5 text-neutral-400" />
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 dark:text-neutral-400">{s.permissions.finance === 'write' ? 'Escrita' : 'Leitura'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full shrink-0">
                                    <ShoppingCart className="w-2.5 h-2.5 text-neutral-400" />
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 dark:text-neutral-400">{s.permissions.shopping === 'write' ? 'Escrita' : 'Leitura'}</span>
                                  </div>
                                  {(s as any).upgradeRequested && (
                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-rose-500 text-white rounded-full animate-pulse shrink-0 whitespace-nowrap">Upgrade Solicitado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteDoc(doc(db, 'shares', s.id!))}
                              className="p-2 text-neutral-300 hover:text-rose-500 dark:text-neutral-600 dark:hover:text-rose-400 transition-colors shrink-0"
                              title="Revogar Acesso"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        
                        {shares.filter(s => s.ownerId === user.uid).length === 0 && (
                          <p className="text-center py-4 text-[10px] text-neutral-400 italic">Nenhum compartilhamento ativo.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="px-8 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 pb-10 z-20">
        <button 
          onClick={() => setActiveTab('chat')}
          className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'chat' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
        >
          <motion.div whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
            <MessageSquare className={cn("w-6 h-6", activeTab === 'chat' && "fill-current")} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Chat</span>
          {activeTab === 'chat' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'finance' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
        >
          <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ duration: 0.3 }}>
            <Wallet className={cn("w-6 h-6", activeTab === 'finance' && "fill-current")} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Finanças</span>
          {activeTab === 'finance' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('shopping')}
          className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'shopping' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
        >
          <motion.div whileHover={{ x: [0, 3, -3, 0] }} transition={{ duration: 0.5 }}>
            <ShoppingCart className={cn("w-6 h-6", activeTab === 'shopping' && "fill-current")} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Compras</span>
          {activeTab === 'shopping' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('routines')}
          className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'routines' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
        >
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <CheckSquare className={cn("w-6 h-6", activeTab === 'routines' && "fill-current")} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Rotinas</span>
          {activeTab === 'routines' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'settings' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
        >
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <Settings className={cn("w-6 h-6", activeTab === 'settings' && "fill-current")} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Ajustes</span>
          {activeTab === 'settings' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
          )}
        </button>
      </nav>

      {/* Insights Modal */}
      <AnimatePresence>
        {showInsightsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInsightsModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
            >
              <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Insights de IA</h3>
                    <p className="text-xs text-neutral-500 font-medium">{unreadInsights.length} novos insights da Aimee</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInsightsModal(false)}
                  className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 no-scrollbar">
                {unreadInsights.map((insight) => (
                  <button
                    key={insight.id}
                    onClick={() => handleGoToInsight(insight)}
                    className="w-full text-left p-5 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-brand/5 dark:hover:bg-brand/10 border border-neutral-100 dark:border-neutral-800 rounded-[2rem] transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0 mt-1">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed line-clamp-3">
                          {insight.content}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            {format(new Date(insight.timestamp), "HH:mm '•' d 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown className="w-5 h-5 text-brand -rotate-90" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-6 bg-neutral-50/50 dark:bg-neutral-800/50 text-center">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Clique em um insight para ler o contexto completo no chat
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
