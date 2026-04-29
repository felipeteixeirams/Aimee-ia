import { auth, db, signOut, googleProvider, signInWithPopup, GoogleAuthProvider } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { 
  ChatMessage, UserProfile, Share, ShoppingItem, 
  GlobalConfig, ChatRole, ShareStatus, UserStatus, UserRole,
  Transaction, FinancialGoal, HouseholdTask, FamilyEvent
} from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { User } from 'firebase/auth';
import { orchestrator } from '../services/aiService';
import { fetchGoogleCalendarEvents } from '../services/calendarService';
import { logger } from '../lib/logger';

import { useToast } from '../components/ToastProvider';

interface AimeeData {
  messages: ChatMessage[];
  transactions: Transaction[];
  shoppingList: ShoppingItem[];
  goals: FinancialGoal[];
  tasks: HouseholdTask[];
  events: FamilyEvent[];
  shares: Share[];
  globalConfig: GlobalConfig;
}

export function useAimeeActions(
  user: User | null, 
  profile: UserProfile | null,
  aimeeData: AimeeData
) {
  const { showToast } = useToast();
  
  const sendMessage = async (
    text: string, 
    activeSpace: string | null,
    setTyping: (typing: boolean) => void,
    typeText: (text: string) => Promise<void>,
    setTypingContent: (content: string | null) => void,
    skipAddUserDoc = false
  ) => {
    if (!text.trim() || !user) return;

    logger.info('Sending message', { userId: user.uid, activeSpace, textLength: text.length });

    if (!skipAddUserDoc) {
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

    setTyping(true);
    try {
      const response = await orchestrator(
        text, 
        aimeeData.messages, 
        user.uid, 
        aimeeData.shoppingList, 
        aimeeData.transactions, 
        aimeeData.goals,
        aimeeData.tasks,
        aimeeData.events,
        profile?.selectedPersona || 'funny', 
        aimeeData.globalConfig.aiProvider,
        activeSpace || undefined
      );

      const blocks = response.split('\n\n').filter(b => b.trim());

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        await typeText(block); 
        
        const isInsight = /notei que|alerta|previsão|economia|média|comparando|insight/i.test(block);

        const aiMsg: ChatMessage = {
          userId: user.uid,
          role: ChatRole.ASSISTANT,
          content: block,
          timestamp: new Date().toISOString(),
          isInsight,
          read: isInsight ? false : undefined
        };
        
        try {
          await addDoc(collection(db, 'users', user.uid, 'chatHistory'), aiMsg);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/chatHistory`);
        }
        
        if (i === blocks.length - 1) {
          await new Promise(r => setTimeout(r, 600));
          setTypingContent(null);
        } else {
          await new Promise(r => setTimeout(r, 400));
          setTypingContent(null);
        }
      }
    } catch (error: any) {
      logger.error('Orchestrator error', { error: error.message, userId: user.uid });
      setTyping(false);
      setTypingContent(null);
      // Fallback message
      const errorMsg: ChatMessage = {
        userId: user.uid,
        role: ChatRole.ASSISTANT,
        content: "Desculpe, tive um problema técnico ao processar sua mensagem. Poderia tentar novamente em breve?",
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'users', user.uid, 'chatHistory'), errorMsg);
    } finally {
      setTyping(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    logger.info('Updating profile', { userId: user.uid, updates: Object.keys(updates) });
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      showToast('Erro ao atualizar perfil', 'error');
    }
  };

  const updateGlobalConfig = async (updates: Partial<GlobalConfig>) => {
    const isSuperAdmin = profile?.role === 'admin' || user?.email === 'felipeteixeirams@gmail.com';
    if (!isSuperAdmin) return;
    logger.info('Updating global config', { userId: user?.uid, updates: Object.keys(updates) });
    try {
      await setDoc(doc(db, 'config', 'global'), {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      }, { merge: true });
    } catch (error) {
      logger.error('Global config update error', { error });
    }
  };

  const syncGoogleCalendar = async (token: string, targetUserId: string) => {
    logger.info('Starting Google Calendar sync', { targetUserId });
    try {
      const googleEvents = await fetchGoogleCalendarEvents(token);
      const eventsRef = collection(db, `users/${targetUserId}/events`);
      const existingEventsSnap = await getDocs(eventsRef);
      const existingGoogleIds = new Set(
        existingEventsSnap.docs
          .map(doc => (doc.data() as any).googleEventId)
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
      logger.info('Google Calendar sync complete', { eventsAdded: count });
      return count;
    } catch (error: any) {
      logger.error('Google Calendar sync error', { error: error.message });
      throw error;
    }
  };

  const handleAdminAction = async (userId: string, action: 'approve' | 'reject' | 'block' | 'approveName' | 'rejectName') => {
    if (profile?.role !== 'admin') return;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const uData = userSnap.data() as UserProfile;

      if (action === 'approveName') {
        const newName = uData.pendingNameChange?.newName;
        if (newName) {
          await updateDoc(userRef, {
            displayName: newName,
            'pendingNameChange.status': 'approved'
          });
          showToast(`Nome de ${uData.username} alterado para ${newName}`, 'success');
        }
        return;
      }

      if (action === 'rejectName') {
        await updateDoc(userRef, {
          'pendingNameChange.status': 'rejected'
        });
        showToast(`Solicitação de nome de ${uData.username} recusada`, 'info');
        return;
      }

      let status: UserStatus = UserStatus.APPROVED;
      let blockedUntil = null;

      if (action === 'reject') status = UserStatus.REJECTED;
      if (action === 'block') {
        status = UserStatus.BLOCKED;
        const d = new Date();
        d.setDate(d.getDate() + 5);
        blockedUntil = d.toISOString();
      }

      await updateDoc(userRef, { 
        status, 
        blockedUntil: blockedUntil || null
      });

      // Simulation of email notify
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: action, email: uData.email, name: uData.displayName })
      }).catch(() => {});

      // Log to admin
      const logMsg: ChatMessage = {
        userId: profile.uid,
        role: ChatRole.ASSISTANT,
        content: `Administrador, acabei de ${action} o acesso de ${uData.displayName}.`,
        timestamp: new Date().toISOString(),
        isInsight: true,
        read: false
      };
      await addDoc(collection(db, 'users', profile.uid, 'chatHistory'), logMsg);

    } catch (error) {
      console.error("Admin action error:", error);
    }
  };

  const manageShopping = {
    toggle: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
          purchased: !item.purchased,
          lastPurchasedAt: !item.purchased ? new Date().toISOString() : item.lastPurchasedAt
        });
        showToast(item.purchased ? 'Item marcado como pendente' : 'Item marcado como comprado', 'success', 2000);
      } catch (err) {
        showToast('Erro ao atualizar item', 'error');
      }
    },
    moveToStock: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
          isStock: true,
          purchased: false
        });
        showToast(`${item.name} movido para o estoque`, 'success', 2000);
      } catch (err) {
        showToast('Erro ao mover item', 'error');
      }
    },
    moveToList: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await updateDoc(doc(db, `users/${targetId}/shoppingList`, item.id), {
          isStock: false,
          urgency: 'medium'
        });
        showToast(`${item.name} movido para a lista`, 'success', 2000);
      } catch (err) {
        showToast('Erro ao mover item', 'error');
      }
    },
    delete: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await deleteDoc(doc(db, `users/${targetId}/shoppingList`, item.id));
        showToast('Item removido', 'success', 2000);
      } catch (err) {
        showToast('Erro ao remover item', 'error');
      }
    }
  };

  const manageTasks = {
    toggle: async (taskId: string, currentStatus: string, targetId: string) => {
      try {
        await updateDoc(doc(db, `users/${targetId}/tasks/${taskId}`), {
          status: currentStatus === 'done' ? 'todo' : 'done'
        });
        showToast(currentStatus === 'done' ? 'Tarefa aberta' : 'Tarefa concluída', 'success', 2000);
      } catch (err) {
        showToast('Erro ao atualizar tarefa', 'error');
      }
    },
    create: async (title: string, category: string, assignedTo: string, targetId: string, dueDate?: string, description?: string) => {
      try {
        await addDoc(collection(db, `users/${targetId}/tasks`), {
          title,
          category,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
          description: description || null,
          status: 'todo',
          createdAt: new Date().toISOString()
        });
        showToast('Tarefa adicionada com sucesso', 'success', 2000);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tasks`);
        showToast('Erro ao adicionar tarefa', 'error');
      }
    },
    delete: async (taskId: string, targetId: string) => {
      try {
        await deleteDoc(doc(db, `users/${targetId}/tasks/${taskId}`));
        showToast('Tarefa removida', 'success', 2000);
      } catch (err) {
        showToast('Erro ao remover tarefa', 'error');
      }
    }
  };

  return {
    sendMessage,
    updateProfile,
    updateGlobalConfig,
    syncGoogleCalendar,
    handleAdminAction,
    manageShopping,
    manageTasks
  };
}
