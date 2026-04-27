import { motion } from 'motion/react';
import { LogOut, Users, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { AimeeAvatar } from './AimeeAvatar';
import { UserProfile } from '../types';

interface HeaderProps {
  unreadInsightsCount: number;
  setShowInsightsModal: (show: boolean) => void;
  profile: UserProfile | null;
  activeSpace: string | null;
  isSuperAdmin: boolean;
  pendingUsersCount: number;
  setShowAdminPanel: (show: boolean) => void;
  onLogout: () => void;
  GLOBAL_AIMEE_AVATAR: string;
}

export function Header({
  unreadInsightsCount,
  setShowInsightsModal,
  profile,
  activeSpace,
  isSuperAdmin,
  pendingUsersCount,
  setShowAdminPanel,
  onLogout,
  GLOBAL_AIMEE_AVATAR
}: HeaderProps) {
  return (
    <header className="px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => unreadInsightsCount > 0 && setShowInsightsModal(true)}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all active:scale-95",
              unreadInsightsCount > 0 ? "cursor-pointer" : "cursor-default"
            )}
          >
            {unreadInsightsCount > 0 && (
              <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
                <motion.div 
                  className="absolute inset-[-100%] bg-conic-gradient from-brand via-amber-400 to-brand"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    background: `conic-gradient(from 0deg, var(--color-brand), #fbbf24, var(--color-brand))` 
                  }}
                />
              </div>
            )}
            <div className="absolute inset-[2px] bg-white dark:bg-neutral-900 rounded-[10px] z-10 overflow-hidden">
              <AimeeAvatar src={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR} className="w-full h-full" />
            </div>
          </button>
          {unreadInsightsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center z-30 border-2 border-white dark:border-neutral-900 shadow-sm animate-bounce pointer-events-none">
              {unreadInsightsCount}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight">Aimee</h2>
          </div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {activeSpace ? `Espaço Compartilhado` : 
             profile?.selectedPersona === 'analytical' ? 'Modo Analítico' : 
             profile?.selectedPersona === 'frugal' ? 'Modo Econômico' : 'Online'} • Gemini 3
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isSuperAdmin && pendingUsersCount > 0 && (
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="relative p-2 bg-brand/10 text-brand rounded-xl hover:bg-brand/20 transition-colors group"
          >
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm animate-pulse">
              {pendingUsersCount}
            </span>
          </button>
        )}
        <button onClick={onLogout} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
