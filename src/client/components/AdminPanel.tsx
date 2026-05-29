import { motion } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Clock, 
  User as UserIcon,
  Search,
  ChevronRight,
  Shield,
  AtSign,
  Calendar,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { UserProfile } from '../../types/index.js';

interface AdminPanelProps {
  pendingUsers: UserProfile[];
  onAction: (userId: string, action: 'approve' | 'reject' | 'block' | 'approveName' | 'rejectName') => void;
  onClose: () => void;
}

export const AdminPanel = ({ pendingUsers, onAction, onClose }: AdminPanelProps) => {
  return (
    <div className="fixed inset-0 z-[110] bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/10"
      >
        {/* Header */}
        <div className="p-8 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Central de Moderação</h2>
              <p className="text-xs text-neutral-500 font-medium">{pendingUsers.length} tarefas pendentes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
              <CheckCircle2 className="w-16 h-16 text-neutral-300" />
              <p className="font-bold uppercase tracking-widest text-xs">Tudo em dia!</p>
            </div>
          ) : (
            pendingUsers.map((pUser) => {
              const isNewRegistration = pUser.status === 'pending';
              const isNameChange = pUser.pendingNameChange?.status === 'pending';

              return (
                <motion.div
                  key={pUser.uid}
                  layoutId={pUser.uid}
                  className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-3xl space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white dark:ring-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                        {pUser.photoUrl || pUser.avatarUrl ? (
                          <img src={pUser.photoUrl || pUser.avatarUrl} alt={pUser.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand/10">
                            <Users className="w-6 h-6 text-brand/40" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-neutral-900 dark:text-white">{pUser.displayName}</h3>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                            isNewRegistration ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                          )}>
                            {isNewRegistration ? 'Novo Registro' : 'Alteração de Nome'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <AtSign className="w-2.5 h-2.5" />
                            {pUser.username}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">{pUser.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isNewRegistration ? (
                        <>
                          <button
                            onClick={() => onAction(pUser.uid, 'approve')}
                            className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => onAction(pUser.uid, 'reject')}
                            className="flex-1 md:flex-none px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Recusar
                          </button>
                          <button
                            onClick={() => onAction(pUser.uid, 'block')}
                            className="flex-1 md:flex-none px-4 py-2 bg-neutral-800 hover:bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            title="Recusar e Bloquear por 5 dias"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Bloquear
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onAction(pUser.uid, 'approveName')}
                            className="flex-1 md:flex-none px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprovar Nome
                          </button>
                          <button
                            onClick={() => onAction(pUser.uid, 'rejectName')}
                            className="flex-1 md:flex-none px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Ignorar
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isNameChange && (
                    <div className="bg-white dark:bg-neutral-800/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase text-neutral-400 mb-1">Nome Atual</p>
                        <p className="text-sm font-bold text-neutral-400 line-through">{pUser.displayName}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-indigo-500 animate-pulse" />
                      <div className="flex-1 text-right">
                        <p className="text-[8px] font-black uppercase text-indigo-400 mb-1">Novo Nome Sugerido</p>
                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{pUser.pendingNameChange?.newName}</p>
                      </div>
                    </div>
                  )}

                  {isNewRegistration && pUser.bio && (
                    <p className="text-[11px] text-neutral-500 p-4 bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 font-medium italic">"{pUser.bio}"</p>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-brand/5 dark:bg-brand/10 border border-brand/20 rounded-2xl">
            <Shield className="w-4 h-4 text-brand" />
            <p className="text-[10px] text-brand font-bold uppercase tracking-wider">Acesso Restrito ao Administrador</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
