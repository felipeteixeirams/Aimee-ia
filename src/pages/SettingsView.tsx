import { User as UserIcon, Send, Link as LinkIcon, Lock, Check, Copy, Wallet, ShoppingCart, Home, Shield, Sparkles, Moon, Sun, LayoutGrid, Zap, ChevronDown, Monitor, Globe, Mail, Palette, Brain, Smile, X, Calendar, Bell, BellOff, Download, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Share, GlobalConfig, AIProvider, PermissionLevel, AIRecommendedPersona } from '../types/index.js';
import { cn } from '../lib/utils.js';
import { AimeeAvatar } from '../components/AimeeAvatar.js';
import React, { useState, useRef, useEffect } from 'react';
import { calendarService } from '../services/calendarService.js';
import { notificationService } from '../services/notificationService.js';

interface SettingsViewProps {
  profile: UserProfile | null;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isSuperAdmin: boolean;
  globalConfig: GlobalConfig;
  updateGlobalConfig: (updates: Partial<GlobalConfig>) => void;
  shares: Share[];
  activeSpace: string | null;
  setActiveSpace: (space: string | null) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  invitePerms: {
    finance: PermissionLevel;
    shopping: PermissionLevel;
    routines: PermissionLevel;
  };
  setInvitePerms: (perms: {
    finance: PermissionLevel;
    shopping: PermissionLevel;
    routines: PermissionLevel;
  }) => void;
  handleInvite: () => void;
  handleAcceptInvite: (share: Share) => void;
  handleDeclineInvite: (share: Share) => void;
  handleRequestUpgrade: (share: Share) => void;
  user: any;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const ThemeColorButton = ({ color, active, onClick, label }: { color: string, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col items-center gap-2 transition-all active:scale-95"
  >
    <div className={cn(
      "w-10 h-10 rounded-2xl border-4 transition-all flex items-center justify-center shadow-sm",
      active ? "border-brand" : "border-transparent bg-neutral-50 dark:bg-neutral-800"
    )}>
      <div className={cn("w-5 h-5 rounded-lg shadow-inner", color)} />
    </div>
    <span className={cn(
      "text-[8px] font-black uppercase tracking-widest transition-colors",
      active ? "text-brand" : "text-neutral-400"
    )}>{label}</span>
  </button>
);

const PermissionToggle = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange 
}: { 
  label: string, 
  icon: any, 
  value: PermissionLevel, 
  onChange: (val: PermissionLevel) => void 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-2xl group hover:border-brand/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-brand transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{label}</span>
      </div>
      <div className="flex bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700/50 p-1 rounded-xl">
        {(['none', 'read', 'write'] as PermissionLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
              value === level 
                ? "bg-brand text-brand-foreground shadow-sm" 
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            )}
          >
            {level === 'none' ? 'Off' : level === 'read' ? 'Ver' : 'Edit'}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SettingsView = ({
  profile,
  isDarkMode,
  setIsDarkMode,
  isSuperAdmin,
  globalConfig,
  updateGlobalConfig,
  shares,
  activeSpace,
  setActiveSpace,
  inviteEmail,
  setInviteEmail,
  invitePerms,
  setInvitePerms,
  handleInvite,
  handleAcceptInvite,
  handleDeclineInvite,
  handleRequestUpgrade,
  user,
  updateProfile
}: SettingsViewProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [availableProviderIds, setAvailableProviderIds] = useState<string[]>([]);
  const [notificationStatus, setNotificationStatus] = useState(notificationService.getPermissionStatus());

  const handleToggleNotifications = async () => {
    if (notificationStatus !== 'granted') {
      const granted = await notificationService.requestPermission();
      setNotificationStatus(granted ? 'granted' : 'denied');
      if (profile) {
        updateProfile({ 
          preferences: { 
            ...(profile.preferences || { currency: 'BRL' }), 
            notificationsEnabled: granted 
          } 
        } as any);
      }
    } else {
      const newValue = !profile?.preferences?.notificationsEnabled;
      if (profile) {
        updateProfile({ 
          preferences: { 
            ...(profile.preferences || { currency: 'BRL' }), 
            notificationsEnabled: newValue 
          } 
        } as any);
      }
    }
  };
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config/ai');
        const data = await res.json();
        if (data.availableProviders) {
          setAvailableProviderIds(data.availableProviders);
        }
      } catch (err) {
        console.error("Erro ao carregar configuração de IA:", err);
      }
    };
    fetchConfig();
  }, []);

  const aiProviders = [
    { id: AIProvider.GEMINI, name: 'Google Gemini 2.0', icon: Sparkles, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: AIProvider.DEEPSEEK, name: 'DeepSeek R1', icon: Zap, color: 'text-brand', bgColor: 'bg-brand/10' },
  ].filter(p => availableProviderIds.includes(p.id));

  const currentProvider = aiProviders.find(p => p.id === globalConfig.aiProvider) || aiProviders[0] || { id: 'none', name: 'Nenhum Ativo', icon: Shield, color: 'text-neutral-400', bgColor: 'bg-neutral-400/10' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const updates: Partial<UserProfile> = {
      nickname: editNickname,
      bio: editBio,
      photoUrl: editPhoto,
      displayPreference: displayPref as any,
    };

    // If display name changed, request a change instead of direct update
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

  const handleConnectGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        url, 
        'google_oauth', 
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (err) {
      console.error('Falha ao obter URL de autenticação:', err);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!user?.uid) return;
    if (confirm('Tem certeza que deseja desconectar seu Google Calendar?')) {
      await calendarService.disconnectGoogle(user.uid);
      updateProfile({ calendarConnected: false, googleCalendarEmail: undefined });
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Security: check origin if possible, but in sandbox it might vary
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.source === 'google_calendar') {
        const { tokens } = event.data;
        if (user?.uid) {
          await calendarService.saveGoogleCredentials(user.uid, tokens);
          // Try to get email from tokens if available (requires userinfo scope)
          updateProfile({ calendarConnected: true });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, updateProfile]);

  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="h-full overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar pb-[180px]"
    >
      {/* Profile Card Refined */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand/10 transition-colors" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden ring-4 md:ring-8 ring-neutral-50 dark:ring-neutral-800 shadow-xl bg-neutral-100 dark:bg-neutral-800">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand/10">
                    <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-brand/40" />
                  </div>
                )}
              </div>
              {isSuperAdmin && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-brand text-brand-foreground rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900">
                  <Shield className="w-3 md:w-3.5 h-3 md:h-3.5" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg md:text-xl font-black text-neutral-800 dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
                    {profile?.displayPreference === 'nickname' && profile?.nickname ? profile.nickname : profile?.displayName}
                  </h3>
                  {profile?.nickname && profile?.displayPreference === 'fullName' && (
                    <span className="text-[10px] font-bold text-neutral-400">({profile.nickname})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-brand/10 px-2 py-0.5 rounded-lg shrink-0">
                    <p className="text-[9px] font-black text-brand uppercase tracking-widest">@{profile?.username}</p>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium truncate max-w-[120px] sm:max-w-none">{profile?.email}</p>
                </div>
              </div>
              <p className="text-[10px] md:text-[11px] text-neutral-500 mt-2 font-medium line-clamp-1 italic">
                {profile?.bio || 'Personalize seu perfil para uma melhor experiência.'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditingProfile(true)}
            className="w-full sm:w-auto px-5 py-3 md:py-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-neutral-100 dark:border-neutral-700 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <Palette className="w-3.5 h-3.5" />
            Editar Perfil
          </button>
        </div>

        {profile?.pendingNameChange && profile.pendingNameChange.status === 'pending' && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center gap-3">
            <Brain className="w-4 h-4 text-amber-500" />
            <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-none">
              Solicitação de alteração de nome em análise pelo administrador: <span className="opacity-60">"{profile.pendingNameChange.newName}"</span>
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
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
                  className="w-10 h-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 rounded-xl text-neutral-400 hover:text-rose-500 transition-colors"
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
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      placeholder="Seu nome oficial"
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
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
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">URL da Foto</label>
                  <input 
                    type="url" 
                    value={editPhoto}
                    onChange={(e) => setEditPhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1 mb-3 block">Preferência de Exibição</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setDisplayPref('fullName')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                        displayPref === 'fullName' 
                          ? "bg-brand/10 border-brand text-brand" 
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-400"
                      )}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Nome Completo</span>
                    </button>
                    <button 
                      onClick={() => setDisplayPref('nickname')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                        displayPref === 'nickname' 
                          ? "bg-brand/10 border-brand text-brand" 
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-400"
                      )}
                    >
                      <Smile className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Apelido</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  className="w-full max-w-[320px] py-5 bg-brand text-brand-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand/20 active:scale-95 transition-all mt-4 mx-auto block"
                >
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          {/* Aesthetic & Brain Settings - MOVED TO TOP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Settings */}
            <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-[0.2em] mb-0.5">Estilo Visual</h4>
                  <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Cores e tema do seu espaço.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-4 h-4 text-brand" /> : <Sun className="w-4 h-4 text-brand" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Modo Escuro</span>
                  </div>
                  <button 
                    onClick={() => {
                      const next = !isDarkMode;
                      setIsDarkMode(next);
                      updateProfile({ theme: next ? 'dark' : 'light' });
                    }}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative",
                      isDarkMode ? "bg-brand" : "bg-neutral-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                      isDarkMode ? "left-5.5" : "left-0.5"
                    )} />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Paleta de Cores</label>
                  <div className="flex flex-wrap gap-4 px-1">
                    <ThemeColorButton 
                      color="bg-neutral-900 dark:bg-neutral-200" 
                      label="Minimal" 
                      active={!profile?.themeColor || profile.themeColor === 'neutral'} 
                      onClick={() => updateProfile({ themeColor: 'neutral' })} 
                    />
                    <ThemeColorButton 
                      color="bg-blue-600" 
                      label="Oceano" 
                      active={profile?.themeColor === 'blue'} 
                      onClick={() => updateProfile({ themeColor: 'blue' })} 
                    />
                    <ThemeColorButton 
                      color="bg-violet-600" 
                      label="Royal" 
                      active={profile?.themeColor === 'violet'} 
                      onClick={() => updateProfile({ themeColor: 'violet' })} 
                    />
                    <ThemeColorButton 
                      color="bg-rose-600" 
                      label="Púrpura" 
                      active={profile?.themeColor === 'rose'} 
                      onClick={() => updateProfile({ themeColor: 'rose' })} 
                    />
                    <ThemeColorButton 
                      color="bg-emerald-600" 
                      label="Selva" 
                      active={profile?.themeColor === 'emerald'} 
                      onClick={() => updateProfile({ themeColor: 'emerald' })} 
                    />
                    <ThemeColorButton 
                      color="bg-amber-600" 
                      label="Ouro" 
                      active={profile?.themeColor === 'amber'} 
                      onClick={() => updateProfile({ themeColor: 'amber' })} 
                    />
                  </div>
                </div>
              </div>

              {/* Integrations Section */}
              <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-[0.2em] mb-0.5">Integrações</h4>
                    <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Conecte com seus apps favoritos.</p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-3xl group transition-all hover:border-brand/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-800 dark:text-white uppercase tracking-widest leading-none mb-1">Google Calendar</p>
                        <p className="text-[9px] text-neutral-400 font-medium tracking-tight italic">
                          {profile?.calendarConnected ? "Conectado" : "Sincronize eventos e rotinas."}
                        </p>
                      </div>
                    </div>
                    {profile?.calendarConnected ? (
                      <button 
                        onClick={handleDisconnectGoogle}
                        className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                      >
                        Desconectar
                      </button>
                    ) : (
                      <button 
                        onClick={handleConnectGoogle}
                        className="px-4 py-2.5 bg-brand text-brand-foreground rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-brand/20 active:scale-95 transition-all"
                      >
                        Conectar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* System & Notifications Settings */}
              <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-[0.2em] mb-0.5">Sistema e Alertas</h4>
                    <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Gerencie notificações e performance.</p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-3xl space-y-4">
                  {/* Notifications Toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm">
                        {profile?.preferences?.notificationsEnabled ? (
                          <Bell className="w-5 h-5 text-brand" />
                        ) : (
                          <BellOff className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-800 dark:text-white uppercase tracking-widest leading-none mb-1">Notificações Push</p>
                        <p className="text-[9px] text-neutral-400 font-medium tracking-tight italic">
                          {notificationStatus === 'denied' 
                            ? "Bloqueado no navegador" 
                            : profile?.preferences?.notificationsEnabled 
                              ? "Ativado: alertas fora do app" 
                              : "Desativado"}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleToggleNotifications}
                      disabled={notificationStatus === 'denied'}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        profile?.preferences?.notificationsEnabled ? "bg-brand" : "bg-neutral-200 dark:bg-neutral-700",
                        notificationStatus === 'denied' && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                        profile?.preferences?.notificationsEnabled ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  {/* Cache & Performance Status */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm">
                        <Zap className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-800 dark:text-white uppercase tracking-widest leading-none mb-1">Abertura Rápida (PWA)</p>
                        <p className="text-[9px] text-neutral-400 font-medium tracking-tight italic">Otimizado para carregamento instantâneo.</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-brand/10 rounded-lg">
                      <span className="text-[8px] font-black text-brand uppercase tracking-widest">Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brain Personality Selection */}
            <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-[0.2em] mb-0.5">Brain da Aimee</h4>
                  <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Escolha como a assistente deve falar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => updateProfile({ selectedPersona: AIRecommendedPersona.ANALYTICAL })}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98]",
                    profile?.selectedPersona === 'analytical' 
                      ? "bg-brand border-brand text-brand-foreground shadow-lg shadow-brand/20" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Analítica</span>
                  </div>
                  {profile?.selectedPersona === 'analytical' && <Check className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => updateProfile({ selectedPersona: AIRecommendedPersona.FRUGAL })}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98]",
                    profile?.selectedPersona === 'frugal' 
                      ? "bg-brand border-brand text-brand-foreground shadow-lg shadow-brand/20" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Frugal</span>
                  </div>
                  {profile?.selectedPersona === 'frugal' && <Check className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => updateProfile({ selectedPersona: AIRecommendedPersona.FUNNY })}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98]",
                    profile?.selectedPersona === 'funny' 
                      ? "bg-brand border-brand text-brand-foreground shadow-lg shadow-brand/20" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Smile className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Divertida</span>
                  </div>
                  {profile?.selectedPersona === 'funny' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Global Admin Config */}
          {isSuperAdmin && (
            <div className="bg-violet-50 dark:bg-violet-900/10 p-6 md:p-8 rounded-[2.5rem] border border-violet-100 dark:border-violet-900/30 overflow-visible">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest leading-none mb-1">Painel Administrador</p>
                    <h4 className="text-lg font-black text-violet-900 dark:text-violet-100 tracking-tight">Preferências da IA</h4>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 ml-1">Provedor Inteligente</label>
                  
                  {/* Custom Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-violet-200 dark:border-violet-900/20 rounded-2xl shadow-sm hover:border-violet-300 transition-all font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", currentProvider.bgColor)}>
                          <currentProvider.icon className={cn("w-4 h-4", currentProvider.color)} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{currentProvider.name}</span>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-neutral-400 transition-transform", isDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 4, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute z-50 top-full left-0 right-0 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-xl p-2 overflow-hidden"
                        >
                          {aiProviders.map((provider) => (
                            <button
                              key={provider.id}
                              onClick={() => {
                                updateGlobalConfig({ aiProvider: provider.id });
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                globalConfig.aiProvider === provider.id 
                                  ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400" 
                                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", provider.bgColor)}>
                                  <provider.icon className={cn("w-4 h-4", provider.color)} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">{provider.name}</span>
                              </div>
                              {globalConfig.aiProvider === provider.id && <Check className="w-4 h-4" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="bg-violet-200/20 dark:bg-violet-900/10 p-4 rounded-2xl flex items-start gap-3">
                    <Zap className="w-4 h-4 text-violet-500 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold leading-relaxed">
                        A alteração do provedor de IA afetará todos os usuários da plataforma instantaneamente. 
                        O provedor selecionado orquestrará todos os insights financeiros e sugestões de tarefas.
                      </p>
                      <p className="mt-2 text-[9px] text-violet-400/70 font-medium italic">
                        Última atualização: {globalConfig.updatedAt ? new Date(globalConfig.updatedAt).toLocaleTimeString() : 'N/A'} por {globalConfig.updatedBy || 'Sistema'}
                      </p>
                    </div>
                  </div>

                  {/* Assistant Appearance - ADMIN ONLY */}
                  <div className="space-y-4 pt-4 border-t border-violet-200 dark:border-violet-900/20">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 ml-1">Aparência da Aimee (Global)</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {[
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
                      ].map((url) => {
                        const isSelected = (globalConfig.aimeeAvatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop') === url;
                        return (
                          <button
                            key={url}
                            onClick={() => updateGlobalConfig({ aimeeAvatarUrl: url })}
                            className={cn(
                              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all active:scale-95 bg-neutral-100 dark:bg-neutral-800",
                              isSelected ? "border-violet-500 shadow-lg scale-105 z-10" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            <img 
                              src={url} 
                              className="w-full h-full object-cover" 
                              alt="Avatar option" 
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-violet-500/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-violet-600" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Space Selection */}
            <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Contexto Ativo</h4>
                <p className="text-[10px] text-neutral-400 font-medium">Selecione o espaço que deseja visualizar e interagir.</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setActiveSpace(null)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98]",
                    activeSpace === null 
                      ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", activeSpace === null ? "bg-white/20" : "bg-white dark:bg-neutral-900")}>
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-left">Meu Espaço Pessoal</span>
                  </div>
                  {activeSpace === null && <Check className="w-4 h-4" />}
                </button>
                
                {shares.filter(s => s.status === 'accepted' && s.ownerId !== user.uid).map(share => (
                  <button 
                    key={share.id}
                    onClick={() => setActiveSpace(share.ownerId)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98]",
                      activeSpace === share.ownerId 
                        ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", activeSpace === share.ownerId ? "bg-white/20" : "bg-white dark:bg-neutral-900")}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-left truncate">Espaço de {share.ownerEmail.split('@')[0]}</span>
                    </div>
                    {activeSpace === share.ownerId && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Invitation Section */}
            <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Colaboração</h4>
                <p className="text-[10px] text-neutral-400 font-medium">Convide outros usuários para seu espaço inteligente.</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 pl-11 pr-4 py-4 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-brand/10 transition-all outline-none placeholder:text-neutral-400 placeholder:font-bold lowercase"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 mb-2">Permissões do convidado</p>
                  <PermissionToggle label="Finanças" icon={Wallet} value={invitePerms.finance} onChange={(val) => setInvitePerms({...invitePerms, finance: val})} />
                  <PermissionToggle label="Compras" icon={ShoppingCart} value={invitePerms.shopping} onChange={(val) => setInvitePerms({...invitePerms, shopping: val})} />
                  <PermissionToggle label="Rotinas" icon={Home} value={invitePerms.routines} onChange={(val) => setInvitePerms({...invitePerms, routines: val})} />
                </div>
                
                <button 
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || !inviteEmail.includes('@')}
                  className="w-full max-w-[320px] py-4 bg-brand text-brand-foreground rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-brand/20 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 mx-auto"
                >
                  <Send className="w-4 h-4" />
                  Convidar Agora
                </button>
              </div>
            </div>
          </div>

          {/* Share Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Gerenciamento de Vínculos</h3>
              <span className="text-[10px] font-bold text-neutral-300">{shares.length} Registro(s)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shares.map((share, i) => (
                <div key={share.id || i} className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between gap-4 shadow-sm hover:border-brand/20 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                        share.ownerId === user.uid ? "bg-brand/10 text-brand" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                      )}>
                        {share.ownerId === user.uid ? <Send className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-neutral-800 dark:text-white truncate max-w-[150px]">
                          {share.ownerId === user.uid ? share.sharedWithEmail : share.ownerEmail}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                          {share.ownerId === user.uid ? 'Enviado por você' : 'Recebido'}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                      share.status === 'accepted' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
                      share.status === 'pending' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                      "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                    )}>
                      {share.status === 'accepted' ? 'Ativo' : share.status === 'pending' ? 'Pendente' : 'Recusado'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-50 dark:border-neutral-800">
                    <span className="text-[9px] text-neutral-300 font-bold uppercase">{new Date(share.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      {share.ownerId !== user.uid && share.status === 'pending' && (
                        <>
                          <button onClick={() => handleAcceptInvite(share)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95">Aceitar</button>
                          <button onClick={() => handleDeclineInvite(share)} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-lg text-[9px] font-black uppercase tracking-wider active:scale-95">Recusar</button>
                        </>
                      )}
                      {share.ownerId !== user.uid && share.status === 'accepted' && (
                        <button 
                          onClick={() => handleRequestUpgrade(share)}
                          disabled={share.upgradeRequested}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                            share.upgradeRequested 
                              ? "bg-neutral-50 dark:bg-neutral-800 text-neutral-400" 
                              : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
                          )}
                        >
                          {share.upgradeRequested ? 'Solicitado' : 'Upgrade'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {shares.length === 0 && (
                <div className="col-span-1 md:col-span-2 py-12 bg-white dark:bg-neutral-900/50 rounded-[2rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center opacity-40">
                  <LayoutGrid className="w-10 h-10 text-neutral-300 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nenhum vínculo registrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
