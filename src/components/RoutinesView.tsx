import { motion } from 'motion/react';
import { Home, Calendar, RefreshCw, AlertCircle, Link as LinkIcon, Clock, CheckSquare, Check, Trash2, Sparkles } from 'lucide-react';
import { FamilyEvent, HouseholdTask, GlobalConfig } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';

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
  handleDeleteTask,
  handleDeleteEvent
}: RoutinesViewProps) => {
  return (
    <motion.div 
      key="routines"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-24 no-scrollbar"
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
                <p className={cn(
                  "text-sm font-bold transition-all",
                  task.status === 'done' ? "text-neutral-400 line-through" : "text-neutral-800 dark:text-white"
                )}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">{task.category}</span>
                  {task.assignedTo && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-brand/10 text-brand rounded-full">@{task.assignedTo}</span>
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
  );
};
