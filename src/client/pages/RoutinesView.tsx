import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, RefreshCw, AlertCircle, Link as LinkIcon, Clock, CheckSquare, Check, Trash2, Sparkles, Plus, X, User, Info, Users, RotateCcw, Search, Filter } from 'lucide-react';
import { FamilyEvent, HouseholdTask, GlobalConfig, ChatMessage, RecurrenceType, Share, MonitorEvent, EventMonitorConfig, EVENT_TAXONOMY } from '../../types/index.js';
import { cn, safeFormatDate } from '../../lib/utils.js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState, useMemo } from 'react';
import { HouseholdTaskSchema } from '../../models/index.js';
import { EventMonitorComponent } from '../components/EventMonitorComponent.js';

interface RoutinesViewProps {
  events: FamilyEvent[];
  tasks: HouseholdTask[];
  monitorEvents: MonitorEvent[];
  monitorConfig: EventMonitorConfig | null;
  insights: ChatMessage[];
  shares: Share[];
  isSuperAdmin: boolean;
  isSyncing: boolean;
  calendarBlocked: boolean;
  syncError: string | null;
  handleSyncCalendar: () => void;
  globalConfig: GlobalConfig;
  handleToggleTask: (taskId: string, currentStatus: string) => void;
  handleCreateTask: (task: Partial<HouseholdTask>) => void;
  handleUpdateTask: (taskId: string, updates: Partial<HouseholdTask>, scope: 'single' | 'following' | 'all') => void;
  handleDeleteTask: (taskId: string, scope: 'single' | 'following' | 'all') => void;
  handleDeleteEvent: (eventId: string) => void;
  handleSaveMonitorConfig: (config: any) => void;
}

export const RoutinesView = ({
  events,
  tasks,
  monitorEvents,
  monitorConfig,
  insights,
  shares,
  isSuperAdmin,
  isSyncing,
  calendarBlocked,
  syncError,
  handleSyncCalendar,
  globalConfig,
  handleToggleTask,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
  handleDeleteEvent,
  handleSaveMonitorConfig,
  isGoogleEmail
}: RoutinesViewProps & { isGoogleEmail: boolean }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Limpeza');
  const [newTaskAssigned, setNewTaskAssigned] = useState('');
  const [newTaskParticipants, setNewTaskParticipants] = useState<string[]>([]);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskIsAllDay, setNewTaskIsAllDay] = useState(true);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<{
    enabled: boolean;
    type: RecurrenceType;
    daysOfWeek: number[];
    daysOfMonth: number[];
    endTime?: string;
  }>({
    enabled: false,
    type: 'daily',
    daysOfWeek: [],
    daysOfMonth: []
  });

  const [formError, setFormError] = useState<string | null>(null);

  const [scopeModal, setScopeModal] = useState<{
    show: boolean;
    type: 'edit' | 'delete';
    taskId: string;
    updates?: Partial<HouseholdTask>;
  }>({ show: false, type: 'delete', taskId: '' });

  const [selectedTaskDescription, setSelectedTaskDescription] = useState<string | null>(null);

  const familyMembers = useMemo(() => {
    const members = new Set<string>();
    shares.forEach(s => {
      if (s.status === 'accepted') {
        members.add(s.sharedWithEmail);
        members.add(s.ownerEmail);
      }
    });
    return Array.from(members);
  }, [shares]);

  const onCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const task: Partial<HouseholdTask> = {
      title: newTaskTitle,
      category: newTaskCategory as any,
      status: 'todo',
      assignedTo: newTaskAssigned || undefined,
      participants: newTaskParticipants.length > 0 ? newTaskParticipants : [],
      dueDate: newTaskDueDate || undefined,
      time: newTaskTime || undefined,
      isAllDay: newTaskIsAllDay,
      description: newTaskDescription || undefined,
      recurrence: newTaskRecurrence.enabled ? {
        type: newTaskRecurrence.type,
        daysOfWeek: newTaskRecurrence.daysOfWeek,
        daysOfMonth: newTaskRecurrence.daysOfMonth,
        endTime: newTaskRecurrence.endTime
      } : undefined
    };

    const result = HouseholdTaskSchema.safeParse(task);
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    handleCreateTask(task);
    resetForm();
    setIsAddingTask(false);
  };

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskAssigned('');
    setNewTaskParticipants([]);
    setNewTaskDueDate('');
    setNewTaskTime('');
    setNewTaskIsAllDay(true);
    setNewTaskDescription('');
    setNewTaskRecurrence({
      enabled: false,
      type: 'daily',
      daysOfWeek: [],
      daysOfMonth: []
    });
  };

  const isOverdue = (task: HouseholdTask) => {
    if (task.status === 'done' || !task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div 
        key="routines"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-[180px] no-scrollbar"
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

      {/* Discovery Hub - Event Monitor */}
      <EventMonitorComponent
        monitorEvents={monitorEvents}
        monitorConfig={monitorConfig}
        handleSaveConfig={handleSaveMonitorConfig}
      />

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
          
           {(isSuperAdmin || (globalConfig.calendarIntegrationEnabled && isGoogleEmail)) && (
              <button 
                onClick={handleSyncCalendar}
                disabled={isSyncing || calendarBlocked}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all border border-neutral-100 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider",
                  (isSyncing || calendarBlocked) && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw className={cn("w-3.5 h-3.5 text-brand", isSyncing && "animate-spin")} />
                {calendarBlocked ? 'Agenda Bloqueada' : (isSyncing ? 'Sincronizando...' : 'Sincronizar')}
              </button>
            )}

            {!isGoogleEmail && globalConfig.calendarIntegrationEnabled && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800 opacity-60">
                <Info className="w-3 h-3 text-neutral-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Google Calendar indisponível para este e-mail</span>
              </div>
            )}
        </div>

        {isSuperAdmin && syncError && (
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
                  href="https://console.cloud.google.com/apis/library/calendar.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200 dark:shadow-none"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Ativar API no Console
                </a>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {events.length > 0 ? events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex gap-4 p-4 glass rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5",
                event.type === 'holiday' ? "bg-rose-500" :
                event.type === 'social' ? "bg-purple-500" :
                "bg-blue-500"
              )} />
              
              <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-neutral-100 dark:border-neutral-700">
                <span className="text-[10px] font-black text-brand uppercase tracking-tighter leading-none mb-0.5">{safeFormatDate(event.date, 'MMM')}</span>
                <span className="text-xl font-black text-neutral-800 dark:text-white leading-none tracking-tighter">{safeFormatDate(event.date, 'dd')}</span>
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm md:text-base font-black text-neutral-800 dark:text-white truncate tracking-tight">{event.title}</p>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] shrink-0",
                    event.type === 'holiday' ? "bg-rose-50 text-rose-500 dark:bg-rose-900/30" :
                    event.type === 'social' ? "bg-purple-50 text-purple-500 dark:bg-purple-900/30" :
                    "bg-blue-50 text-blue-500 dark:bg-blue-900/30"
                  )}>
                    {event.type}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate font-medium">
                  {event.description || 'Nenhum detalhe adicional'}
                </p>
              </div>

              <div className="flex flex-col items-end justify-center gap-2">
                <button 
                  onClick={() => event.id && handleDeleteEvent(event.id)}
                  className="p-2 text-neutral-300 hover:text-rose-500 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                  title="Remover evento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="py-12 bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800 text-center">
              <Calendar className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-400 text-sm font-black uppercase tracking-[0.2em]">Nenhum evento agendado</p>
            </div>
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
          {tasks.length > 0 ? tasks.map((task, idx) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 p-4 md:p-5 glass rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 group transition-all hover:shadow-lg hover:shadow-brand/5 relative overflow-hidden"
            >
              <button 
                onClick={() => task.id && handleToggleTask(task.id, task.status)}
                className={cn(
                  "w-10 h-10 rounded-[1.25rem] border-2 flex items-center justify-center transition-all shrink-0 active:scale-90",
                  task.status === 'done' 
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                )}
              >
                {task.status === 'done' && <Check className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className={cn(
                    "text-sm md:text-base font-black transition-all truncate tracking-tight",
                    task.status === 'done' ? "text-neutral-400 line-through font-medium" : "text-neutral-800 dark:text-white"
                  )}>{task.title}</p>
                  {isOverdue(task) && (
                    <span className="shrink-0 text-[8px] font-black uppercase bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full tracking-widest border border-rose-200">Em Atraso</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 dark:bg-neutral-800/80 rounded-full border border-neutral-100 dark:border-neutral-800 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <span className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">{task.category}</span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand rounded-full border border-brand/10 shrink-0">
                      <User className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{task.assignedTo.split('@')[0]}</span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full border shrink-0",
                      isOverdue(task) 
                        ? "bg-rose-50 border-rose-100 text-rose-500" 
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800 text-neutral-400"
                    )}>
                      <Clock className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {safeFormatDate(task.dueDate, 'dd MMM')}
                        {task.time && <span className="ml-1 opacity-60"> às {task.time}</span>}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {task.description && (
                  <button 
                    onClick={() => setSelectedTaskDescription(task.description!)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl transition-all text-brand hover:scale-105 active:scale-95"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (task.recurrenceId) {
                      setScopeModal({ show: true, type: 'delete', taskId: task.id! });
                    } else {
                      handleDeleteTask(task.id!, 'single');
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all active:scale-95 sm:opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="py-12 bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800 text-center">
              <CheckSquare className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-400 text-sm font-black uppercase tracking-[0.2em]">Tudo limpo por aqui!</p>
            </div>
          )}
        </div>
      </div>

      {/* Cross-Insights & Contextual Awareness */}
      {insights.length > 0 && (
        <div className="bg-brand/5 p-6 rounded-[2.5rem] border border-brand/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Insights da Aimee</h3>
          </div>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, idx) => (
              <motion.div 
                key={insight.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-brand/10 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Sparkles className="w-3 h-3 text-brand" />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {insight.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddingTask(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-brand text-brand-foreground rounded-full shadow-lg shadow-brand/30 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-800 dark:text-white tracking-tight">Nova Tarefa</h3>
                </div>
                <button 
                  onClick={() => setIsAddingTask(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={onCreateTask} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Título da Tarefa</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Ex: Lavar louça"
                    className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-neutral-400 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Prazo</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="date" 
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="w-full pl-10 pr-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Horário (Opcional)</label>
                    <div className="relative flex items-center gap-2 px-1">
                      <input 
                         type="time"
                         disabled={newTaskIsAllDay}
                         value={newTaskTime}
                         onChange={(e) => setNewTaskTime(e.target.value)}
                         className="flex-1 px-4 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewTaskIsAllDay(!newTaskIsAllDay);
                          if (!newTaskIsAllDay) setNewTaskTime('');
                        }}
                        className={cn(
                          "px-3 py-4 rounded-2xl text-[10px] font-bold uppercase border transition-all",
                          newTaskIsAllDay ? "bg-brand text-brand-foreground border-brand" : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-400"
                        )}
                      >
                        Dia Todo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Recorrência</label>
                     <button
                        type="button"
                        onClick={() => setNewTaskRecurrence(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          newTaskRecurrence.enabled ? "bg-brand" : "bg-neutral-300 dark:bg-neutral-600"
                        )}
                     >
                       <motion.div 
                          animate={{ x: newTaskRecurrence.enabled ? 22 : 2 }}
                          className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full"
                       />
                     </button>
                   </div>

                   {newTaskRecurrence.enabled && (
                     <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                       <select 
                          value={newTaskRecurrence.type}
                          onChange={(e) => setNewTaskRecurrence(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none dark:text-white"
                       >
                         <option value="daily">Diária</option>
                         <option value="weekly">Semanal</option>
                         <option value="monthly">Mensal</option>
                         <option value="annual">Anual</option>
                       </select>

                       {newTaskRecurrence.type === 'weekly' && (
                         <div className="flex flex-wrap gap-2">
                           {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                             <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const days = [...newTaskRecurrence.daysOfWeek];
                                  if (days.includes(idx)) {
                                    setNewTaskRecurrence(prev => ({ ...prev, daysOfWeek: days.filter(d => d !== idx) }));
                                  } else {
                                    setNewTaskRecurrence(prev => ({ ...prev, daysOfWeek: [...days, idx] }));
                                  }
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-lg text-[10px] font-bold transition-all border",
                                  newTaskRecurrence.daysOfWeek.includes(idx) ? "bg-brand text-brand-foreground border-brand" : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400"
                                )}
                             >
                               {day}
                             </button>
                           ))}
                         </div>
                       )}

                       {newTaskRecurrence.type === 'monthly' && (
                         <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto p-1 no-scrollbar">
                           {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                             <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const days = [...newTaskRecurrence.daysOfMonth];
                                  if (days.includes(day)) {
                                    setNewTaskRecurrence(prev => ({ ...prev, daysOfMonth: days.filter(d => d !== day) }));
                                  } else {
                                    setNewTaskRecurrence(prev => ({ ...prev, daysOfMonth: [...days, day] }));
                                  }
                                }}
                                className={cn(
                                  "w-full aspect-square rounded-lg text-[10px] font-bold transition-all border",
                                  newTaskRecurrence.daysOfMonth.includes(day) ? "bg-brand text-brand-foreground border-brand" : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400"
                                )}
                             >
                               {day}
                             </button>
                           ))}
                         </div>
                       )}

                       <div>
                         <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Repetir até (Opcional)</label>
                         <input 
                           type="date"
                           value={newTaskRecurrence.endTime || ''}
                           onChange={(e) => setNewTaskRecurrence(prev => ({ ...prev, endTime: e.target.value }))}
                           className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-xs font-bold outline-none dark:text-white"
                         />
                       </div>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Atribuir a</label>
                    <select 
                      value={newTaskAssigned}
                      onChange={(e) => setNewTaskAssigned(e.target.value)}
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white"
                    >
                      <option value="">Ninguém</option>
                      {familyMembers.map(email => (
                        <option key={email} value={email}>{email}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Participantes</label>
                    <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl no-scrollbar">
                      {familyMembers.map(email => (
                        <label key={email} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={newTaskParticipants.includes(email)}
                            onChange={(e) => {
                              if (e.target.checked) setNewTaskParticipants([...newTaskParticipants, email]);
                              else setNewTaskParticipants(newTaskParticipants.filter(p => p !== email));
                            }}
                            className="w-4 h-4 rounded border-neutral-300 text-brand focus:ring-brand"
                          />
                          <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-brand transition-colors">{email.split('@')[0]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Descrição</label>
                  <textarea 
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Detalhes sobre como realizar a tarefa..."
                    rows={3}
                    className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-neutral-400 dark:text-white resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full max-w-[280px] py-5 bg-brand text-brand-foreground rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all active:scale-95 mt-4 mx-auto block"
                >
                  Adicionar Tarefa
                </button>
              </form>
              {formError && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-xs font-medium text-rose-500 mt-4 text-center"
                >
                  {formError}
                </motion.p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Description Modal */}
      <AnimatePresence>
        {selectedTaskDescription && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTaskDescription(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-xl font-black text-neutral-800 dark:text-white tracking-tight">Detalhes</h3>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {selectedTaskDescription}
                </p>
              </div>

              <button 
                onClick={() => setSelectedTaskDescription(null)}
                className="w-full max-w-[240px] py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-2xl font-bold text-xs uppercase tracking-widest mt-6 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all mx-auto block"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Scope Modal (Recurring Actions) */}
      <AnimatePresence>
        {scopeModal.show && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScopeModal({ ...scopeModal, show: false })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-black text-neutral-800 dark:text-white tracking-tight">Evento Recorrente</h3>
              </div>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
                Esta é uma tarefa recorrente. Como você deseja proceder com a {scopeModal.type === 'delete' ? 'exclusão' : 'edição'}?
              </p>

              <div className="space-y-3 flex flex-col items-center">
                <button 
                  onClick={() => {
                    if (scopeModal.type === 'delete') handleDeleteTask(scopeModal.taskId, 'single');
                    else if (scopeModal.updates) handleUpdateTask(scopeModal.taskId, scopeModal.updates, 'single');
                    setScopeModal({ ...scopeModal, show: false });
                  }}
                  className="w-full max-w-[280px] py-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-neutral-100 dark:border-neutral-800 mx-auto"
                >
                  Somente este evento
                </button>
                <button 
                  onClick={() => {
                    if (scopeModal.type === 'delete') handleDeleteTask(scopeModal.taskId, 'following');
                    else if (scopeModal.updates) handleUpdateTask(scopeModal.taskId, scopeModal.updates, 'following');
                    setScopeModal({ ...scopeModal, show: false });
                  }}
                  className="w-full max-w-[280px] py-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-neutral-100 dark:border-neutral-800 mx-auto"
                >
                  Este e os eventos seguintes
                </button>
                <button 
                  onClick={() => {
                    if (scopeModal.type === 'delete') handleDeleteTask(scopeModal.taskId, 'all');
                    else if (scopeModal.updates) handleUpdateTask(scopeModal.taskId, scopeModal.updates, 'all');
                    setScopeModal({ ...scopeModal, show: false });
                  }}
                  className="w-full max-w-[280px] py-4 bg-brand text-brand-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 mx-auto"
                >
                  Todos os eventos
                </button>
                <button 
                  onClick={() => setScopeModal({ ...scopeModal, show: false })}
                  className="w-full max-w-[280px] py-4 text-neutral-400 font-bold text-xs uppercase tracking-widest mt-2 mx-auto"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
