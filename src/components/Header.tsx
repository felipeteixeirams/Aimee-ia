import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, ChevronDown, Sparkles, Zap, Shield, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { AimeeAvatar } from './AimeeAvatar';
import { UserProfile, GlobalConfig, AIProvider } from '../types';
import { useState, useRef, useEffect } from 'react';

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
  globalConfig: GlobalConfig;
  updateGlobalAIProvider: (provider: AIProvider) => void;
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
  GLOBAL_AIMEE_AVATAR,
  globalConfig,
  updateGlobalAIProvider
}: HeaderProps) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="px-6 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <button 
            onClick={() => unreadInsightsCount > 0 && setShowInsightsModal(true)}
            className={cn(
              "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95",
              unreadInsightsCount > 0 ? "cursor-pointer" : "cursor-default"
            )}
          >
            {unreadInsightsCount > 0 && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden z-0 scale-110">
                <motion.div 
                  className="absolute inset-[-100%]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    background: `conic-gradient(from 0deg, var(--color-brand), #fbbf24, #f472b6, var(--color-brand))` 
                  }}
                />
              </div>
            )}
            <div className="absolute inset-[2px] bg-white dark:bg-neutral-900 rounded-[14px] z-10 overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <AimeeAvatar src={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR} className="w-full h-full scale-110" />
            </div>
          </button>
          {unreadInsightsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center z-30 border-2 border-white dark:border-neutral-900 shadow-lg animate-bounce pointer-events-none">
              {unreadInsightsCount}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-neutral-800 dark:text-white leading-none">Aimee</h1>
            {isSuperAdmin && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-brand/10 text-brand rounded-full">
                <Shield className="w-2.5 h-2.5" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Admin</span>
              </div>
            )}
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => isSuperAdmin && setShowModelDropdown(!showModelDropdown)}
              className={cn(
                "flex items-center gap-1.5 transition-colors group px-1 py-0.5 rounded-md -ml-1",
                isSuperAdmin ? "hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer" : "cursor-default"
              )}
            >
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold whitespace-nowrap">
                {activeSpace ? `Espaço` : 
                 profile?.selectedPersona === 'analytical' ? 'Analítico' : 
                 profile?.selectedPersona === 'frugal' ? 'Frugal' : 'Online'} • {globalConfig.aiProvider === AIProvider.GEMINI ? 'Gemini 2.0' : 'DeepSeek R1'}
              </p>
              {isSuperAdmin && <ChevronDown className={cn("w-3 h-3 text-neutral-300 transition-transform", showModelDropdown && "rotate-180")} />}
            </button>

            <AnimatePresence>
              {showModelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 z-50 pt-2"
                >
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-neutral-800 p-2 overflow-hidden min-w-[180px]">
                    <div className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] px-3 py-2 border-b border-neutral-50 dark:border-neutral-800 mb-1">Cérebro da Aimee</div>
                    <button 
                      onClick={() => { updateGlobalAIProvider(AIProvider.GEMINI); setShowModelDropdown(false); }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1",
                        globalConfig.aiProvider === AIProvider.GEMINI ? "bg-brand/10 text-brand" : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">Gemini 2.0</span>
                      </div>
                      {globalConfig.aiProvider === AIProvider.GEMINI && <Check className="w-3 h-3" />}
                    </button>
                    <button 
                      onClick={() => { updateGlobalAIProvider(AIProvider.DEEPSEEK); setShowModelDropdown(false); }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                        globalConfig.aiProvider === AIProvider.DEEPSEEK ? "bg-brand/10 text-brand" : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">DeepSeek R1</span>
                      </div>
                      {globalConfig.aiProvider === AIProvider.DEEPSEEK && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSuperAdmin && pendingUsersCount > 0 && (
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="relative w-10 h-10 flex items-center justify-center bg-brand/10 text-brand rounded-2xl hover:bg-brand/20 transition-all group active:scale-95"
          >
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm animate-pulse">
              {pendingUsersCount}
            </span>
          </button>
        )}
        <button 
          onClick={onLogout} 
          className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl active:scale-95"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
