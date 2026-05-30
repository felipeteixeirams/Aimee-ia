import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, Menu, X, MessageSquare, Wallet, ShoppingCart, Calendar, Settings, Shield, User as UserIcon, Smile } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { AimeeAvatar } from './AimeeAvatar.js';
import { UserProfile, GlobalConfig, AIProvider, Tab } from '../../types/index.js';
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
  updateProfile?: (updates: Partial<UserProfile>) => void;
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
  shoppingItemsCount,
  updateProfile
}: HeaderProps) {
  const isOnline = health.firebase && health.ai;
  const [showSidebar, setShowSidebar] = useState(false);

  // States for Profile Editing Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNickname, setEditNickname] = useState(profile?.nickname || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [editPhoto, setEditPhoto] = useState(profile?.photoUrl || '');
  const [editDisplayName, setEditDisplayName] = useState(profile?.displayName || '');
  const [displayPref, setDisplayPref] = useState(profile?.displayPreference || 'fullName');

  useEffect(() => {
    if (profile) {
      setEditNickname(profile.nickname || '');
      setEditBio(profile.bio || '');
      setEditPhoto(profile.photoUrl || '');
      setEditDisplayName(profile.displayName || '');
      setDisplayPref(profile.displayPreference || 'fullName');
    }
  }, [profile]);

  const handleSaveProfile = () => {
    if (!updateProfile) return;
    const updates: Partial<UserProfile> = {
      nickname: editNickname,
      bio: editBio,
      photoUrl: editPhoto,
      displayPreference: displayPref as any,
    };

    if (editDisplayName !== profile?.displayName) {
      updates.pendingNameChange = {
        newName: editDisplayName,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };
    }

    updateProfile(updates);
    setIsEditingProfile(false);
  };

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

  const topNavItems = navItems.filter(item => item.id !== 'settings');
  const settingsNavItem = navItems.find(item => item.id === 'settings')!;
  
  return (
    <>
      <header className="px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-3 sm:pb-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-3xl shrink-0 z-40 sticky top-0 border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_4px_32px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-1.5 sm:py-2">
          <div className="flex items-center gap-4 sm:gap-5">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="relative group">
              <button 
                onClick={() => unreadInsightsCount > 0 && setShowInsightsModal(true)}
                className={cn(
                  "relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm hover:shadow-md",
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

            <div className="flex flex-col gap-1 sm:gap-0.5 justify-center">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter text-neutral-900 dark:text-white leading-none">Aimee</h1>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-sm">
                    <Shield className="w-2.5 h-2.5" />
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
              >
                <Users className="w-5 h-5" />
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
                {topNavItems.map(item => {
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
                      <Icon className="w-5 h-5" />
                      <span className="tracking-tight">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-3">
                {/* Ajustes Option placed at the bottom */}
                {settingsNavItem && (
                  <button
                    onClick={() => {
                      setActiveTab(settingsNavItem.id);
                      setShowSidebar(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold outline-none text-left",
                      activeTab === settingsNavItem.id 
                        ? "bg-brand text-brand-foreground shadow-md shadow-brand/10 dark:shadow-brand/20 scale-[1.02]" 
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:scale-105 active:scale-95"
                    )}
                  >
                    <settingsNavItem.icon className="w-5 h-5" />
                    <span className="tracking-tight">{settingsNavItem.label}</span>
                  </button>
                )}

                {/* User Profile Card */}
                {profile && (
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setShowSidebar(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all hover:scale-[1.02] active:scale-[0.98] text-left group shadow-sm outline-none"
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-neutral-100 dark:bg-neutral-800 ring-2 ring-neutral-100 dark:ring-neutral-800">
                        {profile.photoUrl ? (
                          <img src={profile.photoUrl} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand/10">
                            <UserIcon className="w-5 h-5 text-brand/50" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 tracking-tight truncate leading-tight">
                          {profile.displayPreference === 'nickname' && profile.nickname ? profile.nickname : profile.displayName}
                        </h4>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tracking-wide truncate mt-0.5 leading-none">
                          @{profile.username || 'user'}
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-brand leading-none mt-1">
                          {isSuperAdmin || profile.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {/* Sair da aplicação */}
                <button 
                  onClick={() => {
                    setShowSidebar(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs rounded-2xl transition-all font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:scale-105 active:scale-95 outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="tracking-tight">Sair da aplicação</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar z-10 text-neutral-900 dark:text-white"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">Editar Perfil</h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Personalização e identidade</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="w-10 h-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 rounded-xl text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Nickname (Apelido)</label>
                    <input 
                      type="text" 
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      placeholder="Como quer ser chamado?"
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      placeholder="Seu nome oficial"
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
                    />
                    <p className="text-[8px] text-neutral-400 px-1 font-medium italic">* Alterações de nome completo requerem revisão do administrador.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Sua Bio</label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">URL da Foto</label>
                  <input 
                    type="url" 
                    value={editPhoto}
                    onChange={(e) => setEditPhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1 mb-3 block">Preferência de Exibição</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setDisplayPref('fullName')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer",
                        displayPref === 'fullName' 
                          ? "bg-brand/10 border-brand text-brand" 
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400"
                      )}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Nome Completo</span>
                    </button>
                    <button 
                      onClick={() => setDisplayPref('nickname')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer",
                        displayPref === 'nickname' 
                          ? "bg-brand/10 border-brand text-brand" 
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400"
                      )}
                    >
                      <Smile className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Apelido</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  className="w-full max-w-[320px] py-5 bg-brand text-brand-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand/20 active:scale-95 transition-all mt-4 mx-auto block cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
