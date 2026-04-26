import { motion } from 'motion/react';
import { MessageSquare, Wallet, ShoppingCart, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

import { Tab } from '../types';

interface NavigationBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="px-8 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 pb-10 z-20">
      <button 
        onClick={() => setActiveTab('chat')}
        className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'chat' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
      >
        <motion.div whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
          <MessageSquare className={cn("w-6 h-6", activeTab === 'chat' && "fill-current")} />
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Chat</span>
        {activeTab === 'chat' && (
          <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
        )}
      </button>
      <button 
        onClick={() => setActiveTab('finance')}
        className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'finance' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
      >
        <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ duration: 0.3 }}>
          <Wallet className={cn("w-6 h-6", activeTab === 'finance' && "fill-current")} />
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Finanças</span>
        {activeTab === 'finance' && (
          <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
        )}
      </button>
      <button 
        onClick={() => setActiveTab('shopping')}
        className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'shopping' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
      >
        <motion.div whileHover={{ x: [0, 3, -3, 0] }} transition={{ duration: 0.5 }}>
          <ShoppingCart className={cn("w-6 h-6", activeTab === 'shopping' && "fill-current")} />
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Compras</span>
        {activeTab === 'shopping' && (
          <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
        )}
      </button>
      <button 
        onClick={() => setActiveTab('routines')}
        className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'routines' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
      >
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <CheckSquare className={cn("w-6 h-6", activeTab === 'routines' && "fill-current")} />
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Rotinas</span>
        {activeTab === 'routines' && (
          <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
        )}
      </button>
      <button 
        onClick={() => setActiveTab('settings')}
        className={cn("flex flex-col items-center gap-1.5 transition-all group relative", activeTab === 'settings' ? "text-brand" : "text-neutral-400 dark:text-neutral-500")}
      >
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
          <Settings className={cn("w-6 h-6", activeTab === 'settings' && "fill-current")} />
        </motion.div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Ajustes</span>
        {activeTab === 'settings' && (
          <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 bg-brand rounded-full" />
        )}
      </button>
    </nav>
  );
}
