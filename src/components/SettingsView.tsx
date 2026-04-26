import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Send, Link as LinkIcon, Lock, Check, Copy, Wallet, ShoppingCart, Home, Shield, Sparkles, Moon, Sun, LayoutGrid, Zap } from 'lucide-react';
import { UserProfile, Share, GlobalConfig } from '../types';
import { cn } from '../lib/utils';
import { AimeeAvatar } from './AimeeAvatar';
import React from 'react';

interface SettingsViewProps {
  profile: UserProfile | null;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isSuperAdmin: boolean;
  globalConfig: GlobalConfig;
  updateGlobalAIProvider: (provider: 'gemini' | 'deepseek') => void;
  shares: Share[];
  activeSpace: string | null;
  setActiveSpace: (space: string | null) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  invitePerms: any;
  setInvitePerms: (perms: any) => void;
  handleInvite: () => void;
  handleAcceptInvite: (share: Share) => void;
  handleDeclineInvite: (share: Share) => void;
  handleRequestUpgrade: (share: Share) => void;
  user: any;
}

export const SettingsView = ({
  profile,
  isDarkMode,
  setIsDarkMode,
  isSuperAdmin,
  globalConfig,
  updateGlobalAIProvider,
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
  user
}: SettingsViewProps) => {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-full overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar pb-32"
    >
      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3rem] border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand/10 transition-colors" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <AimeeAvatar src={profile?.avatarUrl || ''} size="lg" className="ring-8 ring-neutral-50 dark:ring-neutral-800 rounded-[2.5rem]" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">{profile?.displayName}</h3>
            <p className="text-sm font-bold text-brand uppercase tracking-widest mt-1">@{profile?.username}</p>
            <p className="text-xs text-neutral-400 mt-2 font-medium max-w-sm">{profile?.bio}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-brand transition-all border border-neutral-100 dark:border-neutral-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Admin Config */}
      {isSuperAdmin && (
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Painel Master Admin</p>
              <h4 className="text-base font-black text-indigo-900 dark:text-indigo-100 tracking-tight">Configurações do Sistema</h4>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 block ml-1">Provedor de IA (Global)</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => updateGlobalAIProvider('gemini')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all",
                    globalConfig.aiProvider === 'gemini' 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                      : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400"
                  )}
                >
                  <Sparkles className={cn("w-6 h-6", globalConfig.aiProvider === 'gemini' ? "text-white" : "text-brand")} />
                  <span className="text-xs font-black uppercase tracking-widest">Google Gemini 2.0</span>
                </button>
                <button 
                  onClick={() => updateGlobalAIProvider('deepseek')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all",
                    globalConfig.aiProvider === 'deepseek' 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                      : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400"
                  )}
                >
                   <Zap className={cn("w-6 h-6", globalConfig.aiProvider === 'deepseek' ? "text-white" : "text-brand")} />
                  <span className="text-xs font-black uppercase tracking-widest">DeepSeek R1</span>
                </button>
              </div>
              <p className="mt-3 text-[10px] text-indigo-400/70 font-medium italic">
                Última alteração: {globalConfig.updatedAt ? new Date(globalConfig.updatedAt).toLocaleString() : 'N/A'} por {globalConfig.updatedBy || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share Space Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-black tracking-tight px-2 uppercase text-[12px] text-neutral-400">Espaço e Compartilhamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Space Selection */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Seu Espaço Ativo</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveSpace(null)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                  activeSpace === null 
                    ? "bg-brand border-brand text-white font-bold" 
                    : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500"
                )}
              >
                <span>Meu Espaço Pessoal</span>
                {activeSpace === null && <Check className="w-4 h-4" />}
              </button>
              
              {shares.filter(s => s.status === 'accepted' && s.ownerId !== user.uid).map(share => (
                <button 
                  key={share.id}
                  onClick={() => setActiveSpace(share.ownerId)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                    activeSpace === share.ownerId 
                      ? "bg-brand border-brand text-white font-bold" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500"
                  )}
                >
                  <span className="truncate">Espaço de {share.ownerEmail.split('@')[0]}</span>
                  {activeSpace === share.ownerId && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* New Invitation */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Convidar para seu Espaço</h4>
            <div className="space-y-4">
              <input 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-4 rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 transition-all outline-none"
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Finanças</span>
                  </div>
                  <select 
                    value={invitePerms.finance}
                    onChange={(e) => setInvitePerms({...invitePerms, finance: e.target.value as any})}
                    className="bg-transparent text-[10px] font-bold uppercase text-brand outline-none"
                  >
                    <option value="none">Nenhum</option>
                    <option value="read">Leitura</option>
                    <option value="write">Escrita</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Compras</span>
                  </div>
                  <select 
                    value={invitePerms.shopping}
                    onChange={(e) => setInvitePerms({...invitePerms, shopping: e.target.value as any})}
                    className="bg-transparent text-[10px] font-bold uppercase text-brand outline-none"
                  >
                    <option value="none">Nenhum</option>
                    <option value="read">Leitura</option>
                    <option value="write">Escrita</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-[10px] font-bold uppercase text-neutral-500">Rotinas</span>
                  </div>
                  <select 
                    value={invitePerms.routines}
                    onChange={(e) => setInvitePerms({...invitePerms, routines: e.target.value as any})}
                    className="bg-transparent text-[10px] font-bold uppercase text-brand outline-none"
                  >
                    <option value="none">Nenhum</option>
                    <option value="read">Leitura</option>
                    <option value="write">Escrita</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="w-full py-4 bg-brand text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Convite
              </button>
            </div>
          </div>
        </div>

        {/* Existing Invitations */}
        <div className="space-y-3">
          {shares.map((share, i) => (
            <div key={share.id || i} className="bg-white dark:bg-neutral-900 p-5 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  share.ownerId === user.uid ? "bg-brand/10 text-brand" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                )}>
                  {share.ownerId === user.uid ? <Send className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black text-neutral-800 dark:text-white">
                    {share.ownerId === user.uid ? `Convite para ${share.sharedWithEmail}` : `Convite de ${share.ownerEmail}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                      share.status === 'accepted' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
                      share.status === 'pending' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                      "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                    )}>
                      {share.status === 'accepted' ? 'Ativo' : share.status === 'pending' ? 'Pendente' : 'Recusado'}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">v. {new Date(share.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {share.ownerId !== user.uid && share.status === 'pending' && (
                  <>
                    <button onClick={() => handleAcceptInvite(share)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">Aceitar</button>
                    <button onClick={() => handleDeclineInvite(share)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-xl text-[10px] font-bold uppercase tracking-wider">Recusar</button>
                  </>
                )}
                {share.ownerId !== user.uid && share.status === 'accepted' && (
                  <button 
                    onClick={() => handleRequestUpgrade(share)}
                    disabled={share.upgradeRequested}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      share.upgradeRequested 
                        ? "bg-neutral-50 dark:bg-neutral-800 text-neutral-400" 
                        : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    )}
                  >
                    {share.upgradeRequested ? 'Upgrade Solicitado' : 'Solicitar Upgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {shares.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <LayoutGrid className="w-10 h-10 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">Nenhum compartilhamento ativo</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
