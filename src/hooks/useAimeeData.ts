import { useState, useEffect } from 'react';
import { 
  db 
} from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  where,
  or,
  limit
} from 'firebase/firestore';
import { 
  ChatMessage, Transaction, ShoppingItem, FinancialGoal, 
  HouseholdTask, FamilyEvent, GlobalConfig, Share,
  AIProvider
} from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { User } from 'firebase/auth';

export function useAimeeData(user: User | null, activeSpace: string | null, isApproved: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [tasks, setTasks] = useState<HouseholdTask[]>([]);
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({ 
    aiProvider: AIProvider.GEMINI, 
    updatedAt: '', 
    updatedBy: '' 
  });

  useEffect(() => {
    if (!user) {
      // Clear data on logout
      setMessages([]);
      setTransactions([]);
      setShoppingList([]);
      setGoals([]);
      setTasks([]);
      setEvents([]);
      setShares([]);
      return;
    }

    // Always listen to Global Config (it's public for authenticated users)
    const unsubConfig = onSnapshot(doc(db, 'config/global'), (snap) => {
      if (snap.exists()) {
        setGlobalConfig(snap.data() as GlobalConfig);
      }
    });

    // Always listen to Shares (I updated the rules to allow this for pending users)
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
      setShares(snap.docs.map(d => ({ id: d.id, ...d.data() } as Share)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, sharesPath);
    });

    // Guards for detailed data
    if (!isApproved) {
      return () => {
        unsubConfig();
        unsubShares();
      };
    }

    // 1. Listen to Chat History (Always personal)
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

    // 3. Listen to Space-related Data
    const targetId = activeSpace || user.uid;

    const transPath = `users/${targetId}/transactions`;
    const unsubTrans = onSnapshot(query(collection(db, transPath), orderBy('date', 'desc')), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (err) => handleFirestoreError(err, OperationType.GET, transPath));

    const shopPath = `users/${targetId}/shoppingList`;
    const unsubShop = onSnapshot(query(collection(db, shopPath), orderBy('purchased', 'asc')), (snap) => {
      setShoppingList(snap.docs.map(d => ({ id: d.id, ...d.data() } as ShoppingItem)));
    }, (err) => handleFirestoreError(err, OperationType.GET, shopPath));

    const goalsPath = `users/${targetId}/goals`;
    const unsubGoals = onSnapshot(query(collection(db, goalsPath), orderBy('createdAt', 'desc')), (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() } as FinancialGoal)));
    }, (err) => handleFirestoreError(err, OperationType.GET, goalsPath));

    const tasksPath = `users/${targetId}/tasks`;
    const unsubTasks = onSnapshot(query(collection(db, tasksPath), orderBy('createdAt', 'desc')), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as HouseholdTask)));
    }, (err) => handleFirestoreError(err, OperationType.GET, tasksPath));

    const eventsPath = `users/${targetId}/events`;
    const unsubEvents = onSnapshot(query(collection(db, eventsPath), orderBy('date', 'asc')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as FamilyEvent)));
    }, (err) => handleFirestoreError(err, OperationType.GET, eventsPath));

    return () => {
      unsubChat();
      unsubShares();
      unsubTrans();
      unsubShop();
      unsubGoals();
      unsubTasks();
      unsubEvents();
      unsubConfig();
    };
  }, [user, activeSpace, isApproved]);

  return {
    messages,
    transactions,
    shoppingList,
    goals,
    tasks,
    events,
    shares,
    globalConfig
  };
}
