import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, ChevronDown, Sparkles, Zap, Shield, Check, Menu, MessageSquare, Wallet, ShoppingCart, Calendar, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { AimeeAvatar } from './AimeeAvatar';
import { UserProfile, GlobalConfig, AIProvider, Tab } from '../types';
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
  updateGlobalConfig: (updates: Partial<GlobalConfig>) => void;
  health: { firebase: boolean; ai: boolean };
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
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
  updateGlobalConfig,
  health,
  activeTab,
  setActiveTab
}: HeaderProps) {
  const isOnline = health.firebase && health.ai;
  const [showNavMenu, setShowNavMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNavMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'chat' as Tab, label: 'Conversa', icon: MessageSquare },
    { id: 'finance' as Tab, label: 'Finanças', icon: Wallet },
    { id: 'shopping' as Tab, label: 'Compras', icon: ShoppingCart },
    { id: 'routines' as Tab, label: 'Rotinas', icon: Calendar },
    { id: 'settings' as Tab, label: 'Ajustes', icon: Settings },
  ];
  
  return (
    <header className="px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 shrink-0 z-50 sticky top-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Navigation Menu Burger */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {showNavMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-2xl z-50 overflow-hidden p-2"
                >
                  <p className="px-4 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50 dark:border-neutral-800 mb-2">Navegação</p>
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowNavMenu(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                          activeTab === item.id 
                            ? "bg-brand text-white shadow-lg shadow-brand/20" 
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-bold">{item.label}</span>
                        {activeTab === item.id && (
                          <motion.div layoutId="active-nav-dot" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative group">
          <button 
            onClick={() => unreadInsightsCount > 0 && setShowInsightsModal(true)}
            className={cn(
              "relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95",
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
            {/* Health Dot */}
            <motion.div 
              initial={false}
              animate={{ 
                scale: isOnline ? [1, 1.2, 1] : 1,
                backgroundColor: isOnline ? '#22c55e' : '#ef4444' 
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm z-20" 
            />
          </button>
          {unreadInsightsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center z-30 border-2 border-white dark:border-neutral-900 shadow-lg animate-bounce pointer-events-none">
              {unreadInsightsCount}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-black tracking-tight text-neutral-800 dark:text-white leading-none">Aimee</h1>
            {isSuperAdmin && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-brand text-brand-foreground rounded-full">
                <Shield className="w-2.5 h-2.5" />
                <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold whitespace-nowrap flex items-center gap-1.5">
              {activeSpace ? `Espaço` : 
               profile?.selectedPersona === 'analytical' ? 'Analítico' : 
               profile?.selectedPersona === 'frugal' ? 'Frugal' : 
               profile?.selectedPersona === 'funny' ? 'Divertido' : 'Analítico'}
              {isSuperAdmin && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  {globalConfig.aiProvider === AIProvider.GEMINI ? 'Gemini 3.0' : 'DeepSeek R1'}
                </>
              )}
            </p>
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
          className="min-w-[40px] w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl active:scale-95 group shrink-0"
          title="Sair"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
     </div>
    </header>
  );
}
