import { useState, useEffect, useRef, useMemo } from 'react';
import React from 'react';
import { logger } from './lib/logger';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  testConnection
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
import { 
  ChatMessage, Transaction, ShoppingItem, UserProfile, Share, FinancialGoal, 
  HouseholdTask, FamilyEvent, GlobalConfig, Tab, Period,
  AIProvider, UserRole, UserStatus, ChatRole, PermissionLevel, ShareStatus, TaskStatus
} from './types';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { StatusScreen } from './components/StatusScreen';
import { AdminPanel } from './components/AdminPanel';
import { ChatView } from './components/ChatView';
import { FinanceView } from './components/FinanceView';
import { ShoppingView } from './components/ShoppingView';
import { RoutinesView } from './components/RoutinesView';
import { SettingsView } from './components/SettingsView';
import { AimeeAvatar } from './components/AimeeAvatar';
import { Header } from './components/Header';
import { NavigationBar } from './components/NavigationBar';
import { InsightsModal } from './components/InsightsModal';
import { 
  Users,
  Target,
  Plane,
  GraduationCap,
  Home,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GLOBAL_AIMEE_AVATAR = "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
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
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({ aiProvider: AIProvider.GEMINI, updatedAt: '', updatedBy: '' });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [shares, setShares] = useState<Share[]>([]);
  const [activeSpace, setActiveSpace] = useState<string | null>(null); // null means own space
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState<{ finance: PermissionLevel; shopping: PermissionLevel; routines: PermissionLevel }>({ finance: PermissionLevel.READ, shopping: PermissionLevel.READ, routines: PermissionLevel.NONE });
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
    if (profile?.themeColor) {
      document.documentElement.setAttribute('data-color', profile.themeColor);
    } else {
      document.documentElement.removeAttribute('data-color');
    }
  }, [profile?.themeColor]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      logger.info('Auth state changed', { isAuthenticated: !!u, userId: u?.uid });
      setUser(u);
      setLoading(false);
      
      if (u) {
        // Test connection only once after login or initial load
        testConnection();
        // Ensure user profile exists
        const userRef = doc(db, 'users', u.uid);
        
        let unsubscribeProfile: () => void;
        
        const setupProfileListener = () => {
          unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
            if (!docSnap.exists()) {
              logger.info('New user detected, showing registration flow', { userId: u.uid });
              setIsRegistering(true);
            } else {
              const data = docSnap.data() as UserProfile;
              logger.info('User profile updated', { userId: u.uid });
              setProfile(data);
              
              // Apply theme color
              if (data.themeColor) {
                document.documentElement.setAttribute('data-color', data.themeColor);
              } else {
                document.documentElement.removeAttribute('data-color');
              }

              // Apply dark mode preference if stored in profile
              if (data.theme) {
                setIsDarkMode(data.theme === 'dark');
              }
              setIsRegistering(false);
            }
          }, (error) => {
            // Silently handle offline errors for snapshots
            if (!error.message.includes('offline')) {
              handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
            }
          });
        };

        setupProfileListener();
        return () => {
          unsubscribeProfile?.();
        };
      } else {
        setProfile(null);
        setIsRegistering(false);
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

    // Listen to Pending Users if Admin
    let unsubPending = () => {};
    if (profile?.role === 'admin') {
      const pendingQuery = query(collection(db, 'users'), where('status', '==', 'pending'));
      unsubPending = onSnapshot(pendingQuery, (snap) => {
        setPendingUsers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
      });
    }

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
      unsubPending();
    };
  }, [user, activeSpace, profile?.role]);

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
    setAuthError(null);
    setCalendarBlocked(false); // Reset blocked state on new login attempt
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        // Store token in session storage temporarily for this session syncs
        sessionStorage.setItem('google_access_token', token);
        // We sync only if already approved
        const userRef = doc(db, 'users', result.user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().status === 'approved') {
          await syncGoogleCalendar(token, result.user.uid);
        }
      }
    } catch (error: any) {
      logger.error('Login failed', { 
        error: error.message, 
        code: error.code,
        details: error.customData 
      });
      console.error("Login error:", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError(`Domínio não autorizado. Adicione "${window.location.hostname}" aos domínios autorizados no Console do Firebase.`);
      } else {
        setAuthError(error.message || 'Falha ao entrar com Google');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegistrationComplete = async (data: { username: string, displayName: string, bio: string, avatarUrl: string }) => {
    if (!user) return;
    
    try {
      const isAdmin = user.email === 'felipeteixeirams@gmail.com';
      const status = isAdmin ? UserStatus.APPROVED : UserStatus.PENDING;
      
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: data.displayName,
        email: user.email || '',
        username: data.username,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        status: status,
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
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
      setIsRegistering(false);

      // Notify server to send email
      if (status === 'pending') {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'request', email: user.email, name: data.displayName })
        }).catch(err => console.error("Email notification error:", err));

        // Create insight for admin
        const adminUid = '7r8P5F7y8oNP8G5f9B0q2H1u3v5w'; // For now, hardcoded or use a better way to find admin
        // Actually, we'll just let the admin see the "Admin Panel" with the badge
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleAdminAction = async (userId: string, action: 'approve' | 'reject' | 'block') => {
    if (profile?.role !== 'admin') return;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const uData = userSnap.data() as UserProfile;

      let status: 'approved' | 'rejected' | 'blocked' = 'approved';
      let blockedUntil = null;

      if (action === 'reject') status = 'rejected';
      if (action === 'block') {
        status = 'blocked';
        const d = new Date();
        d.setDate(d.getDate() + 5);
        blockedUntil = d.toISOString();
      }

      await updateDoc(userRef, { 
        status, 
        ...(blockedUntil ? { blockedUntil } : { blockedUntil: null }) 
      });

      // Send Notification Email
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'block', 
          email: uData.email, 
          name: uData.displayName 
        })
      }).catch(err => console.error("Admin action email error:", err));

      // Add a hidden message from Aimee to admin as a log
      const logMsg: ChatMessage = {
        userId: profile.uid,
        role: ChatRole.ASSISTANT,
        content: `Administrador, acabei de ${action === 'approve' ? 'aprovar' : action === 'reject' ? 'recusar' : 'bloquear'} o acesso de ${uData.displayName}. Notificação enviada!`,
        timestamp: new Date().toISOString(),
        isInsight: true,
        read: false
      };
      await addDoc(collection(db, 'users', profile.uid, 'chatHistory'), logMsg);

    } catch (error) {
      console.error("Admin action error:", error);
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
        role: ChatRole.USER,
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
      status: ShareStatus.PENDING,
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

  const handleSyncCalendar = async () => {
    const token = sessionStorage.getItem('google_access_token');
    if (token && user) {
      setIsSyncing(true);
      await syncGoogleCalendar(token, activeSpace || user.uid);
      setIsSyncing(false);
    } else {
      handleLogin();
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${activeSpace || user.uid}/tasks/${taskId}`), {
        status: currentStatus === 'done' ? 'todo' : 'done'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${activeSpace || user.uid}/tasks/${taskId}`));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${activeSpace || user.uid}/events/${eventId}`));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${eventId}`);
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
    return <Login onLogin={handleLogin} isLoading={isLoggingIn} error={authError} />;
  }

  if (isRegistering) {
    return <Register user={user} onComplete={handleRegistrationComplete} onCancel={() => signOut(auth)} />;
  }

  if (profile && profile.status !== 'approved') {
    return (
      <StatusScreen 
        status={profile.status} 
        profile={profile} 
        onLogout={() => signOut(auth)} 
        onRetry={profile.status === 'rejected' ? () => setIsRegistering(true) : undefined} 
      />
    );
  }

  const isSuperAdmin = profile?.role === 'admin' || user?.email === 'felipeteixeirams@gmail.com';
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updates);
      setProfile({ ...profile, ...updates });
      
      if (updates.themeColor) {
        document.documentElement.setAttribute('data-color', updates.themeColor);
      }
      if (updates.theme) {
        setIsDarkMode(updates.theme === 'dark');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateGlobalAIProvider = async (provider: AIProvider) => {
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
    <div className="flex flex-col h-[100dvh] bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-50 overflow-hidden">
      <Header 
        unreadInsightsCount={unreadInsights.length}
        setShowInsightsModal={setShowInsightsModal}
        profile={profile}
        activeSpace={activeSpace}
        isSuperAdmin={isSuperAdmin}
        pendingUsersCount={pendingUsers.length}
        setShowAdminPanel={setShowAdminPanel}
        onLogout={() => signOut(auth)}
        GLOBAL_AIMEE_AVATAR={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR}
        globalConfig={globalConfig}
        updateGlobalAIProvider={updateGlobalAIProvider}
      />

      {showAdminPanel && isSuperAdmin && (
        <AdminPanel 
          pendingUsers={pendingUsers} 
          onAction={handleAdminAction} 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <ChatView 
              messages={messages}
              scrollRef={scrollRef}
              handleScroll={handleScroll}
              showScrollButton={showScrollButton}
              scrollToBottom={scrollToBottom}
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
              typingContent={typingContent}
              formatDateSeparator={formatDateSeparator}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              editValue={editValue}
              setEditValue={setEditValue}
              handleEditMessage={handleEditMessage}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              profile={profile}
              GLOBAL_AIMEE_AVATAR={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView 
              profile={profile}
              transactions={transactions}
              transactionsByPeriod={transactionsByPeriod}
              financePeriod={financePeriod}
              setFinancePeriod={setFinancePeriod}
              financeCategory={financeCategory}
              setFinanceCategory={setFinanceCategory}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              chartData={chartData}
              categoryData={categoryData}
              behaviorData={behaviorData}
              goals={goals}
              categories={categories}
              isDarkMode={isDarkMode}
              filteredTransactions={filteredTransactions}
            />
          )}

          {activeTab === 'shopping' && (
            <ShoppingView 
              shoppingFilter={shoppingFilter}
              setShoppingFilter={setShoppingFilter}
              shoppingList={shoppingList}
              handleToggleShoppingItem={handleToggleShoppingItem}
              handleMoveToStock={handleMoveToStock}
              handleMoveToList={handleMoveToList}
              handleDeleteShoppingItem={handleDeleteShoppingItem}
              profile={profile}
            />
          )}

          {activeTab === 'routines' && (
            <RoutinesView 
              events={events}
              tasks={tasks}
              isSuperAdmin={isSuperAdmin}
              isSyncing={isSyncing}
              calendarBlocked={calendarBlocked}
              syncError={syncError}
              handleSyncCalendar={handleSyncCalendar}
              globalConfig={globalConfig}
              handleToggleTask={handleToggleTask}
              handleDeleteTask={handleDeleteTask}
              handleDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'settings' && user && (
            <SettingsView 
              profile={profile}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              isSuperAdmin={isSuperAdmin}
              globalConfig={globalConfig}
              updateGlobalAIProvider={updateGlobalAIProvider}
              shares={shares}
              activeSpace={activeSpace}
              setActiveSpace={setActiveSpace}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              invitePerms={invitePerms}
              setInvitePerms={setInvitePerms}
              handleInvite={handleInvite}
              handleAcceptInvite={handleAcceptInvite}
              handleDeclineInvite={handleDeclineInvite}
              handleRequestUpgrade={handleRequestUpgrade}
              user={user}
              updateProfile={updateProfile}
            />
          )}
        </AnimatePresence>
      </main>

      <NavigationBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <InsightsModal 
        showInsightsModal={showInsightsModal}
        setShowInsightsModal={setShowInsightsModal}
        unreadInsights={unreadInsights}
        handleGoToInsight={handleGoToInsight}
      />
    </div>
  );
}
