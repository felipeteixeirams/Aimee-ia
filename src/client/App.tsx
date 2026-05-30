import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { logger } from '../lib/logger.js';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  testConnection
} from '../lib/firebase.js';
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
import { aimeeClientOrchestrator } from './services/aiService.js';
import { fetchGoogleCalendarEvents } from './services/calendarService.js';
import { 
  ChatMessage, Transaction, ShoppingItem, UserProfile, Share, FinancialGoal, 
  HouseholdTask, FamilyEvent, GlobalConfig, Tab, Period,
  AIProvider, UserRole, UserStatus, ChatRole, PermissionLevel, ShareStatus, TaskStatus,
  AIRecommendedPersona
} from '../types/index.js';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils.js';
import { Login } from './components/Login.js';
import { Register } from './components/Register.js';
import { StatusScreen } from './components/StatusScreen.js';
import { AdminPanel } from './components/AdminPanel.js';
import { ChatView } from './pages/ChatView.js';
const FinanceView = lazy(() => import('./pages/FinanceView.js').then(m => ({ default: m.FinanceView })));
const ShoppingView = lazy(() => import('./pages/ShoppingView.js').then(m => ({ default: m.ShoppingView })));
const RoutinesView = lazy(() => import('./pages/RoutinesView.js').then(m => ({ default: m.RoutinesView })));
const SettingsView = lazy(() => import('./pages/SettingsView.js').then(m => ({ default: m.SettingsView })));

// Loading component for Suspense
const ViewLoader = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
  </div>
);
import { AimeeAvatar } from './components/AimeeAvatar.js';
import { NetworkStatus } from './components/NetworkStatus.js';
import { Header } from './components/Header.js';
import { InsightsModal } from './components/InsightsModal.js';
import { 
  Users,
  Target,
  Plane,
  GraduationCap,
  Home,
  AlertCircle,
  Sparkles,
  Wallet,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, safeFormatDate } from '../lib/utils.js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from './hooks/useAuth.js';
import { useAimeeData } from './hooks/useAimeeData.js';
import { useAimeeActions } from './hooks/useAimeeActions.js';

const GLOBAL_AIMEE_AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop";

export default function App() {
  const { 
    user, 
    profile, 
    loading, 
    isRegistering, 
    setIsRegistering, 
    isDarkMode, 
    setIsDarkMode,
    setProfile,
    health,
    criticalUnavailable
  } = useAuth();

  const [activeSpace, setActiveSpace] = useState<string | null>(null);

  const isApproved = profile?.status === 'approved' || profile?.role === 'admin' || user?.email === 'felipeteixeirams@gmail.com';
  const aimeeData = useAimeeData(user, activeSpace, isApproved);
  const {
    messages,
    transactions,
    shoppingList,
    goals,
    tasks,
    events,
    shares,
    monitorEvents,
    monitorConfig,
    globalConfig
  } = aimeeData;

  const {
    sendMessage,
    updateProfile,
    updateGlobalConfig,
    syncGoogleCalendar,
    handleAdminAction,
    manageShopping,
    manageFinance,
    manageTasks,
    manageChat,
    manageEvents,
    manageMonitorConfig,
    updateGamification
  } = useAimeeActions(user, profile, aimeeData);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('aimee_active_tab');
    return (saved as Tab) || 'chat';
  });
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 300 : -300
    }),
    center: {
      opacity: 1,
      x: 0
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -300 : 300
    })
  };

  const TABS: Tab[] = ['chat', 'finance', 'shopping', 'routines', 'settings'].filter(t => {
    if (t === 'shopping') return shoppingList.filter(i => !i.isStock).length > 0;
    return true;
  }) as Tab[];

  useEffect(() => {
    localStorage.setItem('aimee_active_tab', activeTab);
  }, [activeTab]);

  const handleNextTab = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex < TABS.length - 1) {
      setDirection(1);
      setActiveTab(TABS[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex > 0) {
      setDirection(-1);
      setActiveTab(TABS[currentIndex - 1]);
    }
  };
  
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState<{ finance: PermissionLevel; shopping: PermissionLevel; routines: PermissionLevel }>({ finance: PermissionLevel.READ, shopping: PermissionLevel.READ, routines: PermissionLevel.NONE });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState<string | null>(null);
  const [financePeriod, setFinancePeriod] = useState<Period>('30d');
  const [financeStartDate, setFinanceStartDate] = useState<string>('');
  const [financeEndDate, setFinanceEndDate] = useState<string>('');
  const [financeCategory, setFinanceCategory] = useState<string>('all');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  useEffect(() => {
    if (user && isApproved) {
      const seen = localStorage.getItem('aimee_onboarding_seen');
      if (!seen) {
        setShowOnboarding(true);
      }
    }
  }, [user, isApproved]);
  
  const handleDismissOnboarding = () => {
    localStorage.setItem('aimee_onboarding_seen', 'true');
    setShowOnboarding(false);
  };
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [shoppingFilter, setShoppingFilter] = useState<'list' | 'stock'>('list');
  const [availableAIProviders, setAvailableAIProviders] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/config/ai')
      .then(res => res.json())
      .then(data => {
        if (data.availableProviders) {
          setAvailableAIProviders(data.availableProviders);
          
          // Se o provedor atual não estiver disponível, troca para o padrão
          if (!data.availableProviders.includes(globalConfig.aiProvider) && data.defaultProvider) {
            updateGlobalConfig({ aiProvider: data.defaultProvider });
          }
        }
      })
      .catch(err => console.error("Erro ao carregar provedores de IA:", err));
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef<number>(0);
  const isAtBottomRef = useRef<boolean>(true);

  // Admin Listener for pending users
  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      setPendingUsers([]);
      return;
    }
    const pendingQuery = query(
      collection(db, 'users'), 
      or(
        where('status', '==', 'pending'),
        where('pendingNameChange.status', '==', 'pending')
      )
    );
    const unsubPending = onSnapshot(pendingQuery, (snap) => {
      setPendingUsers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
    });
    return () => unsubPending();
  }, [user, profile?.role]);


  useEffect(() => {
    if (!user || !profile || transactions.length === 0) return;

    // Calculate weekly spending
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklySpending = transactions
      .filter(t => t.type === 'expense' && t.date && new Date(t.date) >= startOfWeek)
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    // Update profile if spending changed or points need updating
    if (weeklySpending !== (profile.gamification?.currentWeeklySpending ?? 0)) {
      const pointsToAdd = transactions.length * 5; // Simple point logic
      const level = Math.floor(pointsToAdd / 100) + 1;

      updateGamification(weeklySpending, pointsToAdd, level);
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

  const handleSyncCalendar = async () => {
    const token = sessionStorage.getItem('google_access_token');
    if (token && user) {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const result = await syncGoogleCalendar(token, activeSpace || user.uid);
        // Result is { pullCount, pushCount }
        console.log('Sync result:', result);
      } catch (err) {
        setSyncError("Erro na sincronização bi-direcional. Verifique sua permissões.");
      } finally {
        setIsSyncing(false);
      }
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    setCalendarBlocked(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        localStorage.setItem('aimee_auth_provider', 'google');
        if (result.user.email) {
          localStorage.setItem('aimee_last_email', result.user.email);
        }
        sessionStorage.setItem('google_access_token', token);
        const userRef = doc(db, 'users', result.user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().status === 'approved') {
          await syncGoogleCalendar(token, result.user.uid);
        }
      }
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      setAuthError(formatAuthError(error.code) || error.message || 'Falha ao entrar com Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.setItem('aimee_auth_provider', 'password');
      localStorage.setItem('aimee_last_email', email);
    } catch (error: any) {
      logger.error('Email login failed', { error: error.code });
      setAuthError(formatAuthError(error.code));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailRegister = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      localStorage.setItem('aimee_auth_provider', 'password');
      localStorage.setItem('aimee_last_email', email);
      // Profile creation will be handled by the onAuthStateChanged -> isRegistering flow
    } catch (error: any) {
      logger.error('Email registration failed', { error: error.code });
      setAuthError(formatAuthError(error.code));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      logger.error('Password reset failed', { error: error.code });
      setAuthError(formatAuthError(error.code));
      return false;
    }
  };

  const formatAuthError = (code: string) => {
    switch (code) {
      case 'auth/user-not-found': return 'Usuário não encontrado.';
      case 'auth/wrong-password': return 'Senha incorreta.';
      case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
      case 'auth/invalid-email': return 'E-mail inválido.';
      case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
      default: return 'Ocorreu um erro na autenticação.';
    }
  };

  const handleRegistrationComplete = async (data: { username: string, displayName: string, bio: string, photoUrl: string }) => {
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
        photoUrl: data.photoUrl,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        status: status,
        selectedPersona: AIRecommendedPersona.ANALYTICAL,
        preferences: { currency: 'BRL', notificationsEnabled: true },
        gamification: { points: 0, level: 1, badges: [], weeklyGoal: 500, currentWeeklySpending: 0 },
        location: { city: 'São Paulo', region: 'Sudeste' },
        healthGoals: { dietType: 'balanced', focus: ['Redução de Açúcar'] }
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
      setIsRegistering(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
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
          resolve();
        }
      }, speed);
    });
  };

  const formatDateSeparator = (dateStr: string) => {
    if (!dateStr) return 'Data indefinida';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Data inválida';

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === now.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    const dayOfWeek = format(date, 'EEEE', { locale: ptBR });
    return `${format(date, 'dd/MM/yyyy')} - ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const unreadInsights = useMemo(() => 
    messages.filter(m => m.isInsight && m.read === false), 
  [messages]);

  const handleGoToInsight = async (msg: ChatMessage) => {
    if (!msg.id) return;
    
    // Mark as read
    manageChat.markAsRead(msg.id);

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
    
    if (financePeriod === 'custom') {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      
      const start = financeStartDate ? new Date(financeStartDate) : null;
      const end = financeEndDate ? new Date(financeEndDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      if (start && end) return tDate >= start && tDate <= end;
      if (start) return tDate >= start;
      if (end) return tDate <= end;
      return true;
    }

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
      const dayTransactions = transactions.filter(t => t.date?.startsWith(date));
      const income = dayTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (t.amount || 0), 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount || 0), 0);
      data.push({
        name: safeFormatDate(date, 'dd/MM'),
        income,
        expense
      });
    });
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    const expenses = transactionsByPeriod.filter(t => t.type === 'expense');
    const cats = Array.from(new Set(expenses.map(t => t.category).filter(Boolean))) as string[];
    
    cats.forEach(cat => {
      const total = expenses.filter(t => t.category === cat).reduce((acc, t) => acc + (t.amount || 0), 0);
      data.push({ name: cat, value: total });
    });
    return data.sort((a, b) => b.value - a.value);
  }, [transactionsByPeriod]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const behaviorData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = days.map(day => ({ name: day, value: 0 }));
    
    transactionsByPeriod
      .filter(t => t.type === 'expense' && t.date)
      .forEach(t => {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
          const dayIndex = d.getDay();
          data[dayIndex].value += (t.amount || 0);
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="w-8 h-8 border-4 border-neutral-200 dark:border-neutral-800 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin} 
        onEmailLogin={handleEmailLogin}
        onEmailRegister={handleEmailRegister}
        onResetPassword={handleResetPassword}
        isLoading={isLoggingIn} 
        error={authError} 
        health={health} 
        criticalUnavailable={criticalUnavailable}
      />
    );
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
  const isGoogleEmail = user?.email?.endsWith('@gmail.com') || (user?.providerData?.some(p => p.providerId === 'google.com'));

  return (
    <div className="flex flex-col h-[100dvh] bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-50 overflow-hidden relative">
      
      {/* Premium Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-1000">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand/10 dark:bg-brand/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-300/10 dark:bg-blue-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-brand-muted/40 dark:bg-brand/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="z-10 flex flex-col h-full w-full absolute inset-0">
        <NetworkStatus />
        <Header 
          unreadInsightsCount={unreadInsights.length}
          setShowInsightsModal={setShowInsightsModal}
          profile={profile}
          activeSpace={activeSpace}
          isSuperAdmin={isSuperAdmin}
          pendingUsersCount={pendingUsers.length}
          setShowAdminPanel={setShowAdminPanel}
          onLogout={() => signOut(auth)}
          GLOBAL_AIMEE_AVATAR={globalConfig.aimeeAvatarUrl || GLOBAL_AIMEE_AVATAR}
          globalConfig={globalConfig}
          updateGlobalConfig={updateGlobalConfig}
          updateProfile={updateProfile}
          health={{
          firebase: health.firebase,
          ai: globalConfig.aiProvider === AIProvider.GEMINI 
            ? (health.gemini || health.deepseek) // If Gemini fails, Deepseek fallback makes it "online"
            : health.deepseek
        }}
        availableAIProviders={availableAIProviders}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shoppingItemsCount={shoppingList.filter(i => !i.isStock).length}
      />

      {showAdminPanel && isSuperAdmin && (
        <AdminPanel 
          pendingUsers={pendingUsers} 
          onAction={handleAdminAction} 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}

      {showOnboarding && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand via-rose-500 to-amber-500" />
            <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-brand" />
            </div>
            <h2 className="text-2xl font-display font-black text-center mb-2">Bem-vindo à Aimee</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8 leading-relaxed">
              Sua inteligência pessoal para finanças, rotinas e compras. Fale comigo como se fosse uma pessoa.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-0.5">Finanças</h3>
                  <p className="text-[10px] text-neutral-400">Classificação automática e insights preditivos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-0.5">Compras</h3>
                  <p className="text-[10px] text-neutral-400">Lista inteligente que entende seu estoque.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleDismissOnboarding}
              className="w-full mt-8 py-4 bg-brand text-brand-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand/20 active:scale-95 transition-all"
            >
              Começar agora
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pb-0 touch-pan-y">
        <div className="h-full max-w-5xl mx-auto flex flex-col relative">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="flex-1 flex flex-col h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                const velocityThreshold = 500;
                
                if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
                  if (info.offset.x > 0) {
                    handlePrevTab();
                  } else {
                    handleNextTab();
                  }
                }
              }}
            >
              {activeTab === 'chat' && (
                <ChatView 
                  messages={messages}
                  scrollRef={scrollRef}
                  handleScroll={handleScroll}
                  showScrollButton={showScrollButton}
                  scrollToBottom={scrollToBottom}
                  inputText={inputText}
                  setInputText={setInputText}
                  unreadInsights={unreadInsights}
                  handleGoToInsight={handleGoToInsight}
                  handleDismissInsight={async (id) => {
                    manageChat.markAsRead(id);
                  }}
                  handleSendMessage={async (t, skip) => {
                    const content = typeof t === 'string' ? t : inputText;
                    if (!content?.trim()) return;
                    if (!t) setInputText('');
                    setTimeout(() => scrollToBottom('smooth'), 100);
                    await sendMessage(content, activeSpace, setIsTyping, (txt) => typeText(txt, 8), setTypingContent, skip);
                  }}
                  availableAIProviders={availableAIProviders}
                  handleSendVoiceMessage={async () => {
                    // Not used anymore as we transcribe in real-time
                  }}
                  isTyping={isTyping}
                  typingContent={typingContent}
                  formatDateSeparator={formatDateSeparator}
                  editingMessage={editingMessage}
                  setEditingMessage={setEditingMessage}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEditMessage={async (msg) => {
                    const val = editValue.trim();
                    if (!val || val === msg.content) return setEditingMessage(null);
                    manageChat.updateMessage(msg.id!, val);
                    setEditingMessage(null);
                  }}
                  copyToClipboard={copyToClipboard}
                  copiedId={copiedId}
                  profile={profile}
                  user={user}
                  GLOBAL_AIMEE_AVATAR={globalConfig.aimeeAvatarUrl || GLOBAL_AIMEE_AVATAR}
                />
              )}

              <Suspense fallback={<ViewLoader />}>
                {activeTab === 'finance' && (
                  <FinanceView 
                    profile={profile}
                    transactions={transactions}
                    transactionsByPeriod={transactionsByPeriod}
                    financePeriod={financePeriod}
                    setFinancePeriod={setFinancePeriod}
                    financeStartDate={financeStartDate}
                    setFinanceStartDate={setFinanceStartDate}
                    financeEndDate={financeEndDate}
                    setFinanceEndDate={setFinanceEndDate}
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
                    handleAddTransaction={(data) => manageFinance.addTransaction(data, activeSpace || user!.uid)}
                  />
                )}

                {activeTab === 'shopping' && (
                  <ShoppingView 
                    shoppingFilter={shoppingFilter}
                    setShoppingFilter={setShoppingFilter}
                    shoppingList={shoppingList}
                    handleToggleShoppingItem={(item, extra) => manageShopping.toggle(item, activeSpace || user!.uid, extra)}
                    handleMoveToStock={(item) => manageShopping.moveToStock(item, activeSpace || user!.uid)}
                    handleMoveToList={(item) => manageShopping.moveToList(item, activeSpace || user!.uid)}
                    handleDeleteShoppingItem={(item) => manageShopping.delete(item, activeSpace || user!.uid)}
                    handleFinishShopping={(cartTotal, recordedPrices, recordedQuantities) => manageShopping.finish(cartTotal, recordedPrices, recordedQuantities, activeSpace || user!.uid)}
                    handleAddItem={(item) => manageShopping.addItem(item, activeSpace || user!.uid)}
                    profile={profile}
                  />
                )}

                {activeTab === 'routines' && (
                  <RoutinesView 
                    events={events}
                    tasks={tasks}
                    monitorEvents={monitorEvents}
                    monitorConfig={monitorConfig}
                    insights={messages.filter(m => m.isInsight)}
                    shares={shares}
                    isSuperAdmin={isSuperAdmin}
                    isSyncing={isSyncing}
                    calendarBlocked={calendarBlocked}
                    syncError={syncError}
                    handleSyncCalendar={handleSyncCalendar}
                    globalConfig={globalConfig}
                    handleToggleTask={(id, status) => manageTasks.toggle(id, status, activeSpace || user!.uid)}
                    handleCreateTask={(task) => manageTasks.create(task, activeSpace || user!.uid)}
                    handleUpdateTask={(id, updates, scope) => manageTasks.update(id, updates, activeSpace || user!.uid, scope)}
                    handleDeleteTask={(id, scope) => manageTasks.delete(id, activeSpace || user!.uid, scope)}
                    handleDeleteEvent={async (id) => {
                      manageEvents.delete(id, activeSpace || user!.uid);
                    }}
                    handleSaveMonitorConfig={(config) => manageMonitorConfig.save(config, activeSpace || user!.uid)}
                    isGoogleEmail={isGoogleEmail}
                  />
                )}

                {activeTab === 'settings' && user && (
                  <SettingsView 
                    profile={profile}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    isSuperAdmin={isSuperAdmin}
                    globalConfig={globalConfig}
                    updateGlobalConfig={updateGlobalConfig}
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
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <InsightsModal 
        showInsightsModal={showInsightsModal}
        setShowInsightsModal={setShowInsightsModal}
        unreadInsights={unreadInsights}
        handleGoToInsight={handleGoToInsight}
      />
      </div>
    </div>
  );
}
