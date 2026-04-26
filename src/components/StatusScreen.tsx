import { motion } from 'motion/react';
import { 
  Clock, 
  ShieldAlert, 
  XCircle, 
  LogOut, 
  ChevronLeft,
  Mail,
  Sparkles,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface StatusScreenProps {
  status: 'pending' | 'rejected' | 'blocked' | 'loading';
  profile: UserProfile | null;
  onLogout: () => void;
  onRetry?: () => void;
}

export const StatusScreen = ({ status, profile, onLogout, onRetry }: StatusScreenProps) => {
  const content = {
    loading: {
      icon: <Clock className="w-12 h-12 text-brand" />,
      title: "Verificando Status...",
      description: "Aguarde um instante enquanto a Aimee verifica os acessos.",
      button: null
    },
    pending: {
      icon: <Clock className="w-12 h-12 text-brand" />,
      title: "Registro em Análise",
      description: "Sua solicitação foi enviada! A Aimee está agora com o administrador para aprovação. Você receberá um e-mail assim que puder entrar.",
      button: null
    },
    rejected: {
      icon: <XCircle className="w-12 h-12 text-rose-500" />,
      title: "Registro Recusado",
      description: "Infelizmente sua solicitação não foi aprovada desta vez. Mas não desanime, você pode tentar preencher novamente com informações mais completas.",
      button: "Tentar Novo Registro"
    },
    blocked: {
      icon: <Lock className="w-12 h-12 text-neutral-900 dark:text-white" />,
      title: "Acesso Suspenso",
      description: `Seu acesso está temporariamente bloqueado. Você poderá realizar uma nova tentativa em breve.`,
      button: null
    }
  }[status];

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full space-y-8"
      >
        {/* Animated Badge */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-brand/10 blur-2xl rounded-full" />
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-24 h-24 bg-neutral-50 dark:bg-neutral-900 rounded-[2.5rem] flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-2xl mx-auto"
          >
            {content.icon}
          </motion.div>
          {status === 'pending' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed px-4">
            {content.description}
          </p>
        </div>

        {status === 'blocked' && profile?.blockedUntil && (
          <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Bloqueado até</p>
            <p className="text-sm font-mono text-neutral-900 dark:text-neutral-100">
              {new Date(profile.blockedUntil).toLocaleDateString()} às {new Date(profile.blockedUntil).toLocaleTimeString()}
            </p>
          </div>
        )}

        <div className="pt-8 flex flex-col gap-4">
          {onRetry && (status === 'rejected') && (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-brand text-white rounded-[2rem] font-bold uppercase tracking-widest text-xs shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {content.button}
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 rounded-[2rem] font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sair e Voltar ao Início
          </button>
        </div>

        <div className="pt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <Mail className="w-4 h-4" />
            <span className="text-[10px] font-medium tracking-wider">contato@aimee.ia</span>
          </div>
          <p className="text-[9px] text-neutral-400 uppercase tracking-widest">Aimee Intelligence System v1.0</p>
        </div>
      </motion.div>
    </div>
  );
};
