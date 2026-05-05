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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
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
  AIProvider, UserRole, UserStatus, ChatRole, PermissionLevel, ShareStatus, TaskStatus,
  AIRecommendedPersona
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
import { useAuth } from './hooks/useAuth';
import { useAimeeData } from './hooks/useAimeeData';
import { useAimeeActions } from './hooks/useAimeeActions';

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
    globalConfig
  } = aimeeData;

  const {
    sendMessage,
    updateProfile,
    updateGlobalConfig,
    syncGoogleCalendar,
    handleAdminAction,
    manageShopping,
    manageTasks
  } = useAimeeActions(user, profile, aimeeData);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [calendarBlocked, setCalendarBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
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
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [shoppingFilter, setShoppingFilter] = useState<'list' | 'stock'>('list');

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
    const date = new Date(dateStr);
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
        GLOBAL_AIMEE_AVATAR={globalConfig.aimeeAvatarUrl || GLOBAL_AIMEE_AVATAR}
        globalConfig={globalConfig}
        updateGlobalConfig={updateGlobalConfig}
        health={{
          firebase: health.firebase,
          ai: globalConfig.aiProvider === AIProvider.GEMINI ? health.gemini : health.deepseek
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {showAdminPanel && isSuperAdmin && (
        <AdminPanel 
          pendingUsers={pendingUsers} 
          onAction={handleAdminAction} 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pb-0">
        <div className="h-full max-w-5xl mx-auto flex flex-col">
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
              unreadInsights={unreadInsights}
              handleGoToInsight={handleGoToInsight}
              handleDismissInsight={async (id) => {
                await updateDoc(doc(db, `users/${user!.uid}/chatHistory`, id), { read: true });
              }}
              handleSendMessage={async (t, skip) => {
                const content = typeof t === 'string' ? t : inputText;
                if (!content?.trim()) return;
                if (!t) setInputText('');
                setTimeout(() => scrollToBottom('smooth'), 100);
                await sendMessage(content, activeSpace, setIsTyping, (txt) => typeText(txt, 8), setTypingContent, skip);
              }}
              handleSendVoiceMessage={async (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                  const base64data = reader.result as string;
                  const base64Content = base64data.split(',')[1];
                  
                  // Use a default prompt for voice messages
                  const voicePrompt = "Transcreva e processe este áudio.";
                  
                  await sendMessage(
                    voicePrompt, 
                    activeSpace, 
                    setIsTyping, 
                    (txt) => typeText(txt, 8), 
                    setTypingContent, 
                    false, // don't skip doc
                    { data: base64Content, mimeType: blob.type }
                  );
                };
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
                await updateDoc(doc(db, `users/${user!.uid}/chatHistory`, msg.id!), { content: val, timestamp: new Date().toISOString() });
                setEditingMessage(null);
              }}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              profile={profile}
              user={user}
              GLOBAL_AIMEE_AVATAR={globalConfig.aimeeAvatarUrl || GLOBAL_AIMEE_AVATAR}
            />
          )}

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
              handleFinishShopping={() => manageShopping.finish(activeSpace || user!.uid)}
              profile={profile}
            />
          )}

          {activeTab === 'routines' && (
            <RoutinesView 
              events={events}
              tasks={tasks}
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
                await deleteDoc(doc(db, `users/${activeSpace || user!.uid}/events/${id}`));
              }}
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
  );
}
