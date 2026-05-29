import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, Menu, X, MessageSquare, Wallet, ShoppingCart, Calendar, Settings, Shield } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { AimeeAvatar } from './AimeeAvatar.js';
import { UserProfile, GlobalConfig, AIProvider, Tab } from '../types/index.js';
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
  availableAIProviders?: string[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  shoppingItemsCount: number;
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
  availableAIProviders = [],
  activeTab,
  setActiveTab,
  shoppingItemsCount
}: HeaderProps) {
  const isOnline = health.firebase && health.ai;
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSidebar]);

  const navItems = [
    { id: 'chat' as Tab, label: 'Conversão', icon: MessageSquare },
    { id: 'finance' as Tab, label: 'Finanças', icon: Wallet },
    { id: 'shopping' as Tab, label: 'Compras', icon: ShoppingCart },
    { id: 'routines' as Tab, label: 'Rotinas', icon: Calendar },
    { id: 'settings' as Tab, label: 'Ajustes', icon: Settings },
  ];
  
  return (
    <>
      <header className="px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-3 sm:pb-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-3xl shrink-0 z-40 sticky top-0 border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_4px_32px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]">
        <div className="max-w-5_5xl mx-auto flex items-center justify-between py-1.5 sm:py-2">
          <div className="flex items-center gap-4 sm:gap-5">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>
            <div className="relative group">
              <button 
                onClick={() => unreadInsightsCount > 0 && setShowInsightsModal(true)}
                className={cn(
                  "relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm hover:shadow-md",
                  unreadInsightsCount > 0 ? "cursor-pointer" : "cursor-default"
                )}
                aria-label={unreadInsightsCount > 0 ? `${unreadInsightsCount} novos insights disponíveis` : "Ver insights e status da Aimee"}
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
                  role="status"
                  aria-label={isOnline ? "Sistema Online" : "Sistema Offline"}
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

            <div className="flex flex-col gap-1 sm:gap-0.5 justify-center">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter text-neutral-900 dark:text-white leading-none">Aimee</h1>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-sm">
                    <Shield className="w-2.5 h-2.5" aria-hidden="true" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-extrabold whitespace-nowrap flex items-center gap-1.5">
                  {activeSpace ? `Espaço` : 
                   profile?.selectedPersona === 'analytical' ? 'Analítico' : 
                   profile?.selectedPersona === 'frugal' ? 'Frugal' : 
                   profile?.selectedPersona === 'funny' ? 'Divertido' : 'Analítico'}
                  {isSuperAdmin && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      {(() => {
                        const selected = globalConfig.aiProvider;
                        const isAvailable = availableAIProviders.includes(selected);
                        const fallback = availableAIProviders.find(p => p !== selected);
                        
                        if (!isAvailable && fallback) {
                          return `${fallback === 'deepseek' ? 'DeepSeek' : 'Gemini'} (Fallback)`;
                        }
                        
                        return selected === AIProvider.GEMINI ? 'Gemini 3.0' : 'DeepSeek R1';
                      })()}
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
                aria-label="Ver usuários pendentes"
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-brand-foreground text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm animate-pulse">
                  {pendingUsersCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-3xl shadow-[40px_0_100px_rgba(0,0,0,0.1)] z-[110] flex flex-col border-r border-neutral-200/50 dark:border-neutral-800/50 text-neutral-900 dark:text-white"
            >
              <div className="p-8 border-b border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between">
                <h2 className="text-2xl font-display font-black tracking-tighter">Menu</h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 -mr-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
                  aria-label="Fechar menu lateral"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowSidebar(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all font-semibold outline-none",
                        activeTab === item.id 
                          ? "bg-brand text-brand-foreground shadow-md shadow-brand/10 dark:shadow-brand/20 scale-[1.02]" 
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:scale-105 active:scale-95"
                      )}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="tracking-tight">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
                <button 
                  onClick={() => {
                    setShowSidebar(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                  <span className="tracking-tight">Sair da aplicação</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
