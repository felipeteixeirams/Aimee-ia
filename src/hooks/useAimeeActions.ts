import { auth, signOut, googleProvider, signInWithPopup } from '../lib/firebase';
import { 
  ChatMessage, UserProfile, Share, ShoppingItem, 
  GlobalConfig, ChatRole, UserStatus,
  Transaction, FinancialGoal, HouseholdTask, FamilyEvent
} from '../types';
import { 
  taskRepository, 
  transactionRepository, 
  shoppingRepository, 
  chatRepository, 
  profileRepository, 
  eventRepository,
  configRepository 
} from '../infrastructure/repositories';
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
    skipAddUserDoc = false,
    audio?: { data: string; mimeType: string }
  ) => {
    if (!text.trim() && !audio) return;
    if (!user) return;

    logger.info('Sending message', { userId: user.uid, activeSpace, textLength: text.length, hasAudio: !!audio });

    if (!skipAddUserDoc) {
      try {
        await chatRepository.create({
          role: ChatRole.USER,
          content: audio ? "[Mensagem de Áudio]" : text,
          timestamp: new Date().toISOString()
        }, user.uid);
      } catch (error) {
        logger.error('Error saving user message', { error });
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
        activeSpace || undefined,
        audio
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
          await chatRepository.create({
            role: ChatRole.ASSISTANT,
            content: block,
            timestamp: new Date().toISOString(),
            isInsight,
            read: isInsight ? false : undefined
          }, user.uid);
        } catch (error) {
          logger.error('Error saving AI message', { error });
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
      await chatRepository.create({
        role: ChatRole.ASSISTANT,
        content: "Desculpe, tive um problema técnico ao processar sua mensagem. Poderia tentar novamente em breve?",
        timestamp: new Date().toISOString()
      }, user.uid);
    } finally {
      setTyping(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    logger.info('Updating profile', { userId: user.uid, updates: Object.keys(updates) });
    try {
      await profileRepository.updateProfile(user.uid, updates);
    } catch (error: any) {
      showToast('Erro ao atualizar perfil', 'error');
    }
  };

  const updateGlobalConfig = async (updates: Partial<GlobalConfig>) => {
    const isSuperAdmin = profile?.role === 'admin' || user?.email === 'felipeteixeirams@gmail.com';
    if (!isSuperAdmin) return;
    logger.info('Updating global config', { userId: user?.uid, updates: Object.keys(updates) });
    try {
      await configRepository.updateGlobal(updates, user?.email || 'system');
    } catch (error) {
      logger.error('Global config update error', { error });
    }
  };

  const syncGoogleCalendar = async (token: string, targetUserId: string) => {
    logger.info('Starting Google Calendar bidirectional sync', { targetUserId });
    try {
      const { calendarService } = await import('../services/calendarService');
      const googleEvents = await calendarService.fetchGoogleCalendarEvents(token);
      const localEvents = await eventRepository.list([], targetUserId);
      
      const localGoogleIds = new Set(
        localEvents
          .map(e => e.googleEventId)
          .filter(Boolean)
      );

      let pullCount = 0;
      let pushCount = 0;

      // 1. PULL: Insert missing Google events into Firestore
      for (const gEvent of googleEvents) {
        if (gEvent.googleEventId && !localGoogleIds.has(gEvent.googleEventId)) {
          await eventRepository.create({
            ...gEvent
          }, targetUserId);
          pullCount++;
        }
      }

      // 2. PUSH: Push local events without googleEventId to Google Calendar
      const tokensDoc = await profileRepository.getGoogleCredentials(targetUserId);
      if (tokensDoc) {
        const eventsToPush = localEvents.filter(e => !e.googleEventId);
        for (const lEvent of eventsToPush) {
          try {
            const result = await calendarService.syncEventToGoogle(tokensDoc, {
              title: lEvent.title,
              description: lEvent.description,
              date: lEvent.date,
              type: lEvent.type
            });
            
            if (result && result.id && lEvent.id) {
              await eventRepository.update(lEvent.id, { googleEventId: result.id }, targetUserId);
              pushCount++;
            }
          } catch (e: any) {
            logger.warn('Failed to push individual event to Google', { eventId: lEvent.id, error: e.message });
          }
        }
      }

      logger.info('Google Calendar sync complete', { pullCount, pushCount });
      return { pullCount, pushCount };
    } catch (error: any) {
      logger.error('Google Calendar sync error', { error: error.message });
      throw error;
    }
  };

  const handleAdminAction = async (userId: string, action: 'approve' | 'reject' | 'block' | 'approveName' | 'rejectName') => {
    if (profile?.role !== 'admin') return;

    try {
      const uData = await profileRepository.getProfile(userId);
      if (!uData) return;

      if (action === 'approveName') {
        const newName = uData.pendingNameChange?.newName;
        if (newName) {
          await profileRepository.updateProfile(userId, {
            displayName: newName,
            'pendingNameChange.status': 'approved'
          } as any);
          showToast(`Nome de ${uData.username} alterado para ${newName}`, 'success');
        }
        return;
      }

      if (action === 'rejectName') {
        await profileRepository.updateProfile(userId, {
          'pendingNameChange.status': 'rejected'
        } as any);
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

      await profileRepository.updateProfile(userId, { 
        status, 
        blockedUntil: blockedUntil || null
      } as any);

      // Simulation of email notify
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: action, email: uData.email, name: uData.displayName })
      }).catch(() => {});

      // Log to admin
      await chatRepository.create({
        role: ChatRole.ASSISTANT,
        content: `Administrador, acabei de ${action} o acesso de ${uData.displayName}.`,
        timestamp: new Date().toISOString(),
        isInsight: true,
        read: false
      }, profile.uid);

    } catch (error) {
      console.error("Admin action error:", error);
    }
  };

  const manageShopping = {
    toggle: async (item: ShoppingItem, targetId: string, extraUpdates?: Partial<ShoppingItem>) => {
      if (!item.id) return;
      try {
        await shoppingRepository.update(item.id, {
          purchased: !item.purchased,
          lastPurchasedAt: !item.purchased ? new Date().toISOString() : item.lastPurchasedAt,
          ...extraUpdates
        }, targetId);
        showToast(item.purchased ? 'Item marcado como pendente' : 'Item marcado como comprado', 'success', 2000);
      } catch (err) {
        showToast('Erro ao atualizar item', 'error');
      }
    },
    moveToStock: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await shoppingRepository.update(item.id, {
          isStock: true,
          purchased: false
        }, targetId);
        showToast(`${item.name} movido para o estoque`, 'success', 2000);
      } catch (err) {
        showToast('Erro ao mover item', 'error');
      }
    },
    moveToList: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await shoppingRepository.update(item.id, {
          isStock: false,
          urgency: 'medium'
        }, targetId);
        showToast(`${item.name} movido para a lista`, 'success', 2000);
      } catch (err) {
        showToast('Erro ao mover item', 'error');
      }
    },
    delete: async (item: ShoppingItem, targetId: string) => {
      if (!item.id) return;
      try {
        await shoppingRepository.delete(item.id, targetId);
        showToast('Item removido', 'success', 2000);
      } catch (err) {
        showToast('Erro ao remover item', 'error');
      }
    },
    finish: async (targetId: string) => {
      const itemsToMove = aimeeData.shoppingList.filter(i => i.purchased && !i.isStock);
      if (itemsToMove.length === 0) return;

      try {
        await Promise.all(itemsToMove.map(item => 
          shoppingRepository.update(item.id!, {
            isStock: true,
            purchased: false
          }, targetId)
        ));
        showToast(`${itemsToMove.length} itens movidos para o estoque`, 'success', 2000);
      } catch (err) {
        logger.error('Error finishing shopping', { error: err });
        showToast('Erro ao finalizar compras', 'error');
      }
    }
  };

  const manageTasks = {
    toggle: async (taskId: string, currentStatus: string, targetId: string) => {
      try {
        await taskRepository.update(taskId, {
          status: currentStatus === 'done' ? 'todo' : 'done' as any
        }, targetId);
        showToast(currentStatus === 'done' ? 'Tarefa aberta' : 'Tarefa concluída', 'success', 2000);
      } catch (err) {
        showToast('Erro ao atualizar tarefa', 'error');
      }
    },
    create: async (task: Partial<HouseholdTask>, targetId: string) => {
      try {
        const { generateRecurrenceInstances } = await import('../lib/recurrenceUtils');
        
        const baseTask = {
          ...task,
          status: task.status || 'todo' as any,
        };

        if (task.recurrence) {
          const recurrenceId = crypto.randomUUID();
          const startDate = task.dueDate || new Date().toISOString();
          const instances = generateRecurrenceInstances(startDate, task.recurrence);
          
          await Promise.all(instances.map(inst => taskRepository.create({
            ...(baseTask as any),
            dueDate: inst.dueDate,
            originalDueDate: inst.originalDueDate || null,
            note: inst.note || null,
            recurrenceId
          }, targetId)));
        } else {
          await taskRepository.create(baseTask as any, targetId);
        }

        showToast('Tarefa adicionada com sucesso', 'success', 2000);
      } catch (err) {
        showToast('Erro ao adicionar tarefa', 'error');
      }
    },
    update: async (taskId: string, updates: Partial<HouseholdTask>, targetId: string, scope: 'single' | 'following' | 'all' = 'single') => {
      try {
        const taskData = await taskRepository.getById(taskId, targetId);
        if (!taskData) return;

        if (scope === 'single' || !taskData.recurrenceId) {
          await taskRepository.update(taskId, updates, targetId);
        } else {
          const relatedTasks = await taskRepository.list([], targetId);
          const filteredTasks = relatedTasks.filter(d => {
            if (d.recurrenceId !== taskData.recurrenceId) return false;
            if (scope === 'following' && d.dueDate && taskData.dueDate) {
              return new Date(d.dueDate) >= new Date(taskData.dueDate);
            }
            return true;
          });

          await Promise.all(filteredTasks.map(d => d.id && taskRepository.update(d.id, updates, targetId)));
        }
        showToast('Tarefa atualizada', 'success', 2000);
      } catch (err) {
        showToast('Erro ao atualizar tarefa', 'error');
      }
    },
    delete: async (taskId: string, targetId: string, scope: 'single' | 'following' | 'all' = 'single') => {
      try {
        const taskData = await taskRepository.getById(taskId, targetId);
        if (!taskData) return;

        if (scope === 'single' || !taskData.recurrenceId) {
          await taskRepository.delete(taskId, targetId);
        } else {
          const relatedTasks = await taskRepository.list([], targetId);
          const filteredTasks = relatedTasks.filter(d => {
            if (d.recurrenceId !== taskData.recurrenceId) return false;
            if (scope === 'following' && d.dueDate && taskData.dueDate) {
              return new Date(d.dueDate) >= new Date(taskData.dueDate);
            }
            return true;
          });

          await Promise.all(filteredTasks.map(d => d.id && taskRepository.delete(d.id, targetId)));
        }
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
