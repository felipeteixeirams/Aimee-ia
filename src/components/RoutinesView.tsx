import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, RefreshCw, AlertCircle, Link as LinkIcon, Clock, CheckSquare, Check, Trash2, Sparkles, Plus, X, User, Info } from 'lucide-react';
import { FamilyEvent, HouseholdTask, GlobalConfig } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState } from 'react';

interface RoutinesViewProps {
  events: FamilyEvent[];
  tasks: HouseholdTask[];
  isSuperAdmin: boolean;
  isSyncing: boolean;
  calendarBlocked: boolean;
  syncError: string | null;
  handleSyncCalendar: () => void;
  globalConfig: GlobalConfig;
  handleToggleTask: (taskId: string, currentStatus: string) => void;
  handleCreateTask: (title: string, category: string, assignedTo: string, dueDate: string, description: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleDeleteEvent: (eventId: string) => void;
}

export const RoutinesView = ({
  events,
  tasks,
  isSuperAdmin,
  isSyncing,
  calendarBlocked,
  syncError,
  handleSyncCalendar,
  globalConfig,
  handleToggleTask,
  handleCreateTask,
  handleDeleteTask,
  handleDeleteEvent
}: RoutinesViewProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Limpeza');
  const [newTaskAssigned, setNewTaskAssigned] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTaskDescription, setSelectedTaskDescription] = useState<string | null>(null);

  const onCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    handleCreateTask(newTaskTitle, newTaskCategory, newTaskAssigned, newTaskDueDate, newTaskDescription);
    setNewTaskTitle('');
    setNewTaskAssigned('');
    setNewTaskDueDate('');
    setNewTaskDescription('');
    setIsAddingTask(false);
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
        className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-32 no-scrollbar"
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
          
           {(isSuperAdmin || globalConfig.calendarIntegrationEnabled) && (
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

        <div className="space-y-4">
          {events.length > 0 ? events.map((event) => (
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
                  onClick={() => event.id && handleDeleteEvent(event.id)}
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
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 group">
              <button 
                onClick={() => task.id && handleToggleTask(task.id, task.status)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  task.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-200 dark:border-neutral-700"
                )}
              >
                {task.status === 'done' && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "text-sm font-bold transition-all",
                    task.status === 'done' ? "text-neutral-400 line-through" : "text-neutral-800 dark:text-white"
                  )}>{task.title}</p>
                  {isOverdue(task) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                    </motion.div>
                  )}
                  {task.description && (
                    <button 
                      onClick={() => setSelectedTaskDescription(task.description!)}
                      className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-brand"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">{task.category}</span>
                  {task.assignedTo && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-brand/10 text-brand rounded-full">@{task.assignedTo}</span>
                  )}
                  {task.dueDate && (
                    <span className={cn(
                      "text-[9px] font-bold flex items-center gap-1 opacity-70",
                      isOverdue(task) ? "text-rose-500" : "text-neutral-400"
                    )}>
                      <Clock className="w-2.5 h-2.5" />
                      {format(new Date(task.dueDate), 'dd/MM')}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => task.id && handleDeleteTask(task.id)}
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

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddingTask(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-brand text-white rounded-full shadow-lg shadow-brand/30 flex items-center justify-center z-40"
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
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Categoria</label>
                    <select 
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white"
                    >
                      <option value="Limpeza">Limpeza</option>
                      <option value="Cozinha">Cozinha</option>
                      <option value="Finanças">Finanças</option>
                      <option value="Compras">Compras</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Atribuir a</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="text" 
                        value={newTaskAssigned}
                        onChange={(e) => setNewTaskAssigned(e.target.value)}
                        placeholder="Nome"
                        className="w-full pl-10 pr-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-neutral-400 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Prazo (Opcional)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input 
                      type="date" 
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full pl-10 pr-5 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white"
                    />
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
                  disabled={!newTaskTitle.trim()}
                  className="w-full py-5 bg-brand text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Adicionar Tarefa
                </button>
              </form>
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
                className="w-full py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-2xl font-bold text-xs uppercase tracking-widest mt-6 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
