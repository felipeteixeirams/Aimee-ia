import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
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
  getDocFromServer
} from 'firebase/firestore';
import { orchestrator } from './services/aiService';
import { ChatMessage, Transaction, ShoppingItem, UserProfile, Share } from './types';
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
  X,
  ChevronDown,
  Moon,
  Sun,
  Link as LinkIcon,
  Copy,
  Edit2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

type Tab = 'chat' | 'finance' | 'shopping' | 'settings';
type Period = '7d' | '30d' | 'all';

const GLOBAL_AIMEE_AVATAR = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

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
                selectedPersona: 'analytical',
                avatarUrl: 'https://picsum.photos/seed/aimee1/200'
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

    return () => {
      unsubChat();
      unsubProfile();
      unsubShares();
      unsubTrans();
      unsubShop();
    };
  }, [user, activeSpace]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom('auto');
    }
  }, [activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, typingContent]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
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

  const handleSendMessage = async (overrideText?: string, skipAddDoc = false) => {
    const text = overrideText || inputText;
    if (!text.trim() || !user) return;

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
    
    setIsTyping(true);
    const response = await orchestrator(
      text, 
      messages, 
      user.uid, 
      shoppingList, 
      transactions, // Pass transactions for context
      profile?.selectedPersona, 
      activeSpace || undefined
    );
    setIsTyping(false);

    // Split response into blocks (paragraphs) for a more natural feel
    const blocks = response.split('\n\n').filter(b => b.trim());

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      await typeText(block, 8); 
      
      const aiMsg: ChatMessage = {
        userId: user.uid,
        role: 'assistant',
        content: block,
        timestamp: new Date().toISOString()
      };
      
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

  const transactionsByPeriod = transactions.filter(t => {
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

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Chart Data: Daily totals
  const chartData = filteredTransactions.reduce((acc: any[], t) => {
    const day = format(new Date(t.date), 'dd/MM');
    const existing = acc.find(a => a.name === day);
    if (existing) {
      if (t.type === 'income') existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({ 
        name: day, 
        income: t.type === 'income' ? t.amount : 0, 
        expense: t.type === 'expense' ? t.amount : 0,
        rawDate: new Date(t.date).getTime()
      });
    }
    return acc;
  }, []).sort((a, b) => a.rawDate - b.rawDate);

  // Category Data for Pie Chart
  const categoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(a => a.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const COLORS = useMemo(() => 
    isDarkMode 
      ? ['#fafafa', '#d4d4d4', '#a3a3a3', '#737373', '#404040'] 
      : ['#171717', '#404040', '#737373', '#a3a3a3', '#d4d4d4'],
    [isDarkMode]
  );

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

  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-50 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-md overflow-hidden">
            <img src={GLOBAL_AIMEE_AVATAR} className="w-full h-full object-cover" alt="Aimee" referrerPolicy="no-referrer" />
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
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
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
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn("flex group", msg.role === 'user' ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all",
                        msg.role === 'user' 
                          ? "bg-brand text-brand-foreground rounded-tr-none shadow-md" 
                          : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none"
                      )}>
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
                              "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
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
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm text-sm leading-relaxed">
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
                    onClick={() => scrollToBottom()}
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
                    onClick={handleSendMessage}
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
              {/* Header & Period Selector */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Finanças</h3>
                  <p className="text-xs text-neutral-500 font-medium">Acompanhe seu fluxo de caixa e gastos</p>
                </div>
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl self-start md:self-auto">
                  {(['7d', '30d', 'all'] as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFinancePeriod(p)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
                        financePeriod === p 
                          ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md scale-105" 
                          : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      )}
                    >
                      {p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : 'Tudo'}
                    </button>
                  ))}
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
                <h3 className="text-xl font-bold tracking-tight">Lista de Compras</h3>
                <button className="w-10 h-10 bg-brand text-brand-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {shoppingList.map((item, i) => (
                  <div key={i} className={cn(
                    "bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm transition-all hover:shadow-md group",
                    item.purchased && "opacity-50 grayscale"
                  )}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button className="text-neutral-300 dark:text-neutral-700 hover:text-brand transition-colors shrink-0">
                        {item.purchased ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-black text-neutral-800 dark:text-neutral-100 truncate", item.purchased && "line-through")}>{item.name}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{item.category} • Qtd: {item.quantity}</p>
                      </div>
                    </div>
                    {item.lastPrice && (
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-black text-neutral-500">R$ {item.lastPrice.toFixed(2)}</p>
                        <p className="text-[8px] font-bold text-neutral-300 uppercase">Último Preço</p>
                      </div>
                    )}
                  </div>
                ))}
                {shoppingList.length === 0 && (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                    <p className="text-neutral-400 text-sm">Sua lista está vazia.</p>
                  </div>
                )}
              </div>

              <div className="bg-brand p-6 rounded-3xl text-brand-foreground shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">Sugestões da IA</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-brand-foreground/10 rounded-xl">
                    <p className="text-sm">Leite Integral</p>
                    <Plus className="w-4 h-4 opacity-60" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-foreground/10 rounded-xl">
                    <p className="text-sm">Pão de Forma</p>
                    <Plus className="w-4 h-4 opacity-60" />
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
                      <p className="text-xl font-black text-neutral-800 dark:text-neutral-100 tracking-tight">{user.displayName}</p>
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider opacity-70">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tema e Aparência</p>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[10px] font-black uppercase transition-all hover:scale-105 shadow-sm active:scale-95"
                    >
                      {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      {isDarkMode ? 'Escuro' : 'Claro'}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
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
                        className={cn(
                          "w-11 h-11 rounded-2xl border-2 transition-all flex items-center justify-center shadow-sm relative",
                          (profile?.theme || 'default') === t.id ? "border-brand scale-110 ring-4 ring-brand/10 z-10" : "border-transparent hover:scale-110"
                        )}
                        style={{ backgroundColor: t.color }}
                      >
                        {(profile?.theme || 'default') === t.id && (
                          <motion.div layoutId="theme-active" className={cn("w-2 h-2 rounded-full", isDarkMode ? "bg-black" : "bg-white")} />
                        )}
                      </button>
                    ))}
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
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Avatar da Aimee</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      'https://picsum.photos/seed/aimee1/200',
                      'https://picsum.photos/seed/aimee2/200',
                      'https://picsum.photos/seed/aimee3/200',
                      'https://picsum.photos/seed/aimee4/200'
                    ].map((url, idx) => (
                      <button
                        key={url}
                        onClick={() => updateDoc(doc(db, 'users', user.uid), { avatarUrl: url })}
                        className={cn(
                          "aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105",
                          profile?.avatarUrl === url ? "border-brand ring-4 ring-brand/10" : "border-transparent"
                        )}
                      >
                        <img src={url} className="w-full h-full object-cover" alt={`Avatar ${idx}`} referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2 ml-1">URL Personalizada</p>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="https://exemplo.com/imagem.jpg"
                        onBlur={(e) => e.target.value && updateDoc(doc(db, 'users', user.uid), { avatarUrl: e.target.value })}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-white"
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
                            <div key={s.id} className="flex items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center border border-rose-100 dark:border-rose-900/30 text-rose-500">
                                  <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{s.ownerEmail}</p>
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Convidou você para o espaço</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
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
                          <div key={s.id} className="flex items-center justify-between p-4 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
                                <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{s.sharedWithEmail}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full",
                                    s.status === 'pending' 
                                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" 
                                      : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                                  )}>
                                    {s.status === 'pending' ? 'Pendente' : 'Recusado'}
                                  </span>
                                  {(s as any).upgradeRequested && (
                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-rose-500 text-white rounded-full animate-pulse">Upgrade Solicitado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteDoc(doc(db, 'shares', s.id!))}
                              className="p-2 text-neutral-300 hover:text-rose-500 dark:text-neutral-700 dark:hover:text-rose-400 transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}

                        {/* Accepted Shares (Where I am the owner) */}
                        {shares.filter(s => s.status === 'accepted' && s.ownerId === user.uid).map(s => (
                          <div key={s.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand dark:text-brand">
                                <UserIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{s.sharedWithEmail}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                    <Wallet className="w-2.5 h-2.5 text-neutral-400" />
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 dark:text-neutral-400">{s.permissions.finance === 'write' ? 'Escrita' : 'Leitura'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                    <ShoppingCart className="w-2.5 h-2.5 text-neutral-400" />
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 dark:text-neutral-400">{s.permissions.shopping === 'write' ? 'Escrita' : 'Leitura'}</span>
                                  </div>
                                  {(s as any).upgradeRequested && (
                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-rose-500 text-white rounded-full animate-pulse">Upgrade Solicitado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteDoc(doc(db, 'shares', s.id!))}
                              className="p-2 text-neutral-300 hover:text-rose-500 dark:text-neutral-600 dark:hover:text-rose-400 transition-colors"
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
    </div>
  );
}
