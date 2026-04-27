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
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface AdminPanelProps {
  pendingUsers: UserProfile[];
  onAction: (userId: string, action: 'approve' | 'reject' | 'block') => void;
  onClose: () => void;
}

export const AdminPanel = ({ pendingUsers, onAction, onClose }: AdminPanelProps) => {
  return (
    <div className="fixed inset-0 z-[110] bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-white/10"
      >
        {/* Header */}
        <div className="p-8 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Gerenciar Registros</h2>
              <p className="text-xs text-neutral-500 font-medium">{pendingUsers.length} solicitações aguardando</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
              <CheckCircle2 className="w-16 h-16 text-neutral-300" />
              <p className="font-bold uppercase tracking-widest text-xs">Tudo em dia!</p>
            </div>
          ) : (
            pendingUsers.map((pUser) => (
              <motion.div
                key={pUser.uid}
                layoutId={pUser.uid}
                className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white dark:ring-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                    {pUser.avatarUrl ? (
                      <img src={pUser.avatarUrl} alt={pUser.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand/10">
                        <Users className="w-6 h-6 text-brand/40" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{pUser.displayName}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AtSign className="w-2.5 h-2.5" />
                        {pUser.username}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">{pUser.email}</span>
                    </div>
                    {pUser.bio && (
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1 font-medium italic">"{pUser.bio}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
              </motion.div>
            ))
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
