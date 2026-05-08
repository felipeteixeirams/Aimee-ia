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
import { generateRecurrenceInstances } from '../lib/recurrenceUtils';
import { logger } from '../lib/logger';
import { useToast } from '../components/ToastProvider';
import { notificationSchema } from '../types/schemas';

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

    if (!navigator.onLine) {
      showToast('Sem conexão com a internet. Verifique sua rede.', 'error');
      return;
    }

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    logger.info('Sending message', { userId: user.uid, activeSpace, textLength: text.length, hasAudio: !!audio });

    if (!skipAddUserDoc) {
      try {
        await chatRepository.create({
          role: ChatRole.USER,
          content: audio ? "[Mensagem de Áudio]" : text,
          timestamp: new Date().toISOString(),
          status: 'sent'
        }, user.uid);
      } catch (error) {
        logger.error('Error saving user message', { error });
      }
    }

    setTyping(true);
    
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: any = null;
    let response = null;

    while (retryCount <= maxRetries) {
      try {
        response = await orchestrator(
          text, 
          aimeeData.messages, 
          user.uid, 
          aimeeData.shoppingList, 
          aimeeData.transactions, 
          aimeeData.goals,
          aimeeData.tasks,
          aimeeData.events,
          profile?.selectedPersona || 'analytical', 
          aimeeData.globalConfig.aiProvider,
          activeSpace || undefined,
          audio,
          'chat'
        );
        break; // Success!
      } catch (error: any) {
        lastError = error;
        retryCount++;
        if (retryCount <= maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          logger.warn(`Orchestrator failed, retrying in ${delay}ms...`, { attempt: retryCount });
          await wait(delay);
        }
      }
    }

    if (!response) {
      logger.error('Orchestrator failed after retries', { error: lastError?.message, userId: user.uid });
      setTyping(false);
      setTypingContent(null);
      
      try {
        await chatRepository.create({
          role: ChatRole.ASSISTANT,
          content: "Desculpe, tive um problema técnico ao processar sua mensagem. Você pode tentar novamente?",
          timestamp: new Date().toISOString(),
          status: 'error',
          error: lastError?.message || 'Erro desconhecido'
        }, user.uid);
      } catch (e) {
        logger.error('Error saving failure message', { error: e });
      }
      return;
    }

    try {
      const blocks = response.split('\n\n').filter(b => b.trim());

      for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        
        // Extract actions if present
        let actions: any[] = [];
        const actionMatch = block.match(/\[ACTIONS: ([\s\S]*)\]/);
        if (actionMatch) {
          try {
            actions = JSON.parse(actionMatch[1]);
            block = block.replace(/\[ACTIONS: [\s\S]*\]/g, '').trim();
          } catch (e) {
            logger.error('Error parsing AI actions', { error: e });
          }
        }

        // Extract suggestions if present
        const suggestionMatch = block.match(/\[SUGGESTION: ([\s\S]*)\]/);
        if (suggestionMatch) {
          try {
            const suggestion = JSON.parse(suggestionMatch[1]);
            block = block.replace(/\[SUGGESTION: [\s\S]*\]/g, '').trim();
            // Store suggestion in profile metadata
            if (user) {
              const currentSuggestions = profile?.aimeeMetadata?.suggestions || [];
              const updatedSuggestions = [suggestion, ...currentSuggestions].slice(0, 5); // Keep last 5
              profileRepository.updateProfile(user.uid, {
                aimeeMetadata: {
                  ...profile?.aimeeMetadata,
                  suggestions: updatedSuggestions
                }
              } as any).catch(err => logger.error('Error saving suggestion', { err }));
            }
          } catch (e) {
            logger.error('Error parsing AI suggestion', { error: e });
          }
        }

        await typeText(block); 
        
        const isInsight = /insight premium|análise estratégica|saúde financeira|alerta de impacto/i.test(block);

        const aiMsg: ChatMessage = {
          userId: user.uid,
          role: ChatRole.ASSISTANT,
          content: block,
          timestamp: new Date().toISOString(),
          isInsight,
          read: isInsight ? false : undefined,
          status: 'sent',
          actions: actions.length > 0 ? actions : undefined
        };
        
        try {
          setTypingContent(null);
          await chatRepository.create(aiMsg, user.uid);
        } catch (error) {
          logger.error('Error saving AI message', { error });
        }
        
        if (i < blocks.length - 1) {
          await new Promise(r => setTimeout(r, 400));
        }
      }
    } catch (error: any) {
      // This catch is now only for processing errors after the AI response is received
      logger.error('Processing error', { error: error.message, userId: user.uid });
      setTyping(false);
      setTypingContent(null);
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
      const payload = { type: action, email: uData.email, name: uData.displayName };
      
      const validation = notificationSchema.safeParse(payload);
      if (validation.success) {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validation.data)
        }).catch(() => {});
      } else {
        logger.warn('Frontend validation failed for notify', { errors: validation.error.issues });
      }

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
    addItem: async (item: Partial<ShoppingItem>, targetId: string) => {
      try {
        await shoppingRepository.create({
          ...item,
          userId: targetId,
          purchased: false,
          isStock: false,
          createdAt: new Date().toISOString()
        } as any, targetId);
        showToast(`${item.name} adicionado à lista`, 'success', 2000);
      } catch (err: any) {
        logger.error('Error adding shopping item', { error: err });
        showToast('Erro ao adicionar item', 'error');
      }
    },
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
        
        // E.1: Trigger insight after shopping
        triggerInsightSweep(targetId, 'shopping_finish');
      } catch (err) {
        logger.error('Error finishing shopping', { error: err });
        showToast('Erro ao finalizar compras', 'error');
      }
    }
  };

  const triggerInsightSweep = async (targetId: string, trigger: string) => {
    logger.info('Triggering insight sweep', { targetId, trigger });
    
    // 1. Check for data historical depth (minimum 30 days of transactions)
    const sortedTransactions = [...aimeeData.transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let hasEnoughData = false;
    if (sortedTransactions.length > 0) {
      const firstDate = new Date(sortedTransactions[0].date);
      const diffDays = (new Date().getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays >= 30) hasEnoughData = true;
    }

    // 2. Check for recent insights to avoid spam (Strategic insights only every 7 days)
    const lastStrategicAt = profile?.aimeeMetadata?.lastStrategicInsightAt;
    if (lastStrategicAt) {
      const lastDate = new Date(lastStrategicAt);
      const diffDays = (new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 7) return; // Wait 7 days between strategic insights
    }

    if (!hasEnoughData) {
      logger.info('Not enough data for strategic insight yet', { targetId });
      return;
    }

    let prompt = "";
    if (trigger === 'shopping_finish') {
      prompt = `O usuário finalizou compras. Analise o impacto no orçamento mensal e traga um insight estratégico sobre fôlego financeiro ou desvio de metas.`;
    } else if (trigger === 'finance_update') {
      prompt = `Novas transações adicionadas. Analise se há padrões de alto impacto no histórico de 90 dias ou falta de reserva de emergência conforme as metas.`;
    }

    if (!prompt) return;

    try {
      let insight = await orchestrator(
        `[SISTEMA: GERE UM INSIGHT PREMIUM ESTRATÉGICO] ${prompt}`,
        [], 
        targetId,
        aimeeData.shoppingList,
        aimeeData.transactions,
        aimeeData.goals,
        aimeeData.tasks,
        aimeeData.events,
        profile?.selectedPersona || 'analytical',
        aimeeData.globalConfig.aiProvider,
        undefined, // targetUserId
        undefined, // audio
        'insight_sweep'
      );

      // Extract actions if present
      let actions: any[] = [];
      const actionMatch = insight.match(/\[ACTIONS: ([\s\S]*)\]/);
      if (actionMatch) {
        try {
          actions = JSON.parse(actionMatch[1]);
          insight = insight.replace(/\[ACTIONS: [\s\S]*\]/g, '').trim();
        } catch (e) {
          logger.error('Error parsing AI actions in insight', { error: e });
        }
      }

      // Save insight and update metadata
      await chatRepository.create({
          role: ChatRole.ASSISTANT,
          content: insight,
          timestamp: new Date().toISOString(),
          isInsight: true,
          read: false,
          actions: actions.length > 0 ? actions : undefined
      }, targetId);

      await profileRepository.updateProfile(targetId, {
        aimeeMetadata: {
          ...profile?.aimeeMetadata,
          lastStrategicInsightAt: new Date().toISOString()
        }
      } as any);

    } catch (err) {
      logger.error('Proactive insight failure', { err });
    }
  };

  const manageFinance = {
    addTransaction: async (data: Partial<Transaction>, targetId: string) => {
      try {
        await transactionRepository.create({
          ...data,
          userId: targetId,
          date: data.date || new Date().toISOString(),
          createdAt: new Date().toISOString()
        } as any, targetId);
        showToast('Transação registrada', 'success', 2000);
        
        // Trigger insight after manual finance update
        triggerInsightSweep(targetId, 'finance_update');
      } catch (err: any) {
        logger.error('Error adding transaction', { error: err });
        showToast('Erro ao registrar transação', 'error');
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
        const baseTask = {
          ...task,
          status: task.status || 'todo' as any,
          assignedTo: task.assignedTo || null,
          category: (task.category as any) || 'cleaning',
          isAllDay: task.isAllDay ?? false,
          createdAt: new Date().toISOString()
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
    manageFinance,
    manageTasks
  };
}
