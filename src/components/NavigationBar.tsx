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
    <nav className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[90%] max-w-lg glass dark:bg-neutral-900/80 border border-neutral-200/50 dark:border-white/5 rounded-[2.5rem] px-6 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 transition-all duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)] md:hover:scale-[1.02]">
      <button 
        onClick={() => setActiveTab('chat')}
        className={cn("flex flex-col items-center gap-1 transition-all group relative", activeTab === 'chat' ? "text-brand" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400")}
      >
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <MessageSquare className={cn("w-6 h-6", activeTab === 'chat' && "fill-brand/10")} />
        </motion.div>
        <span className={cn("text-[8px] font-black uppercase tracking-widest", activeTab === 'chat' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>Chat</span>
        {activeTab === 'chat' && (
          <motion.div layoutId="nav-bg" className="absolute -inset-x-3 -inset-y-2 bg-brand/5 dark:bg-brand/10 rounded-2xl -z-10" />
        )}
      </button>

      <button 
        onClick={() => setActiveTab('finance')}
        className={cn("flex flex-col items-center gap-1 transition-all group relative", activeTab === 'finance' ? "text-brand" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400")}
      >
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Wallet className={cn("w-6 h-6", activeTab === 'finance' && "fill-brand/10")} />
        </motion.div>
        <span className={cn("text-[8px] font-black uppercase tracking-widest", activeTab === 'finance' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>Money</span>
        {activeTab === 'finance' && (
          <motion.div layoutId="nav-bg" className="absolute -inset-x-3 -inset-y-2 bg-brand/5 dark:bg-brand/10 rounded-2xl -z-10" />
        )}
      </button>

      <button 
        onClick={() => setActiveTab('shopping')}
        className={cn("flex flex-col items-center gap-1 transition-all group relative", activeTab === 'shopping' ? "text-brand" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400")}
      >
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className={cn("w-6 h-6", activeTab === 'shopping' && "fill-brand/10")} />
        </motion.div>
        <span className={cn("text-[8px] font-black uppercase tracking-widest", activeTab === 'shopping' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>Shop</span>
        {activeTab === 'shopping' && (
          <motion.div layoutId="nav-bg" className="absolute -inset-x-3 -inset-y-2 bg-brand/5 dark:bg-brand/10 rounded-2xl -z-10" />
        )}
      </button>

      <button 
        onClick={() => setActiveTab('routines')}
        className={cn("flex flex-col items-center gap-1 transition-all group relative", activeTab === 'routines' ? "text-brand" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400")}
      >
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <CheckSquare className={cn("w-6 h-6", activeTab === 'routines' && "fill-brand/10")} />
        </motion.div>
        <span className={cn("text-[8px] font-black uppercase tracking-widest", activeTab === 'routines' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>Tasks</span>
        {activeTab === 'routines' && (
          <motion.div layoutId="nav-bg" className="absolute -inset-x-3 -inset-y-2 bg-brand/5 dark:bg-brand/10 rounded-2xl -z-10" />
        )}
      </button>

      <button 
        onClick={() => setActiveTab('settings')}
        className={cn("flex flex-col items-center gap-1 transition-all group relative", activeTab === 'settings' ? "text-brand" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400")}
      >
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Settings className={cn("w-6 h-6", activeTab === 'settings' && "fill-brand/10")} />
        </motion.div>
        <span className={cn("text-[8px] font-black uppercase tracking-widest", activeTab === 'settings' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>Set</span>
        {activeTab === 'settings' && (
          <motion.div layoutId="nav-bg" className="absolute -inset-x-3 -inset-y-2 bg-brand/5 dark:bg-brand/10 rounded-2xl -z-10" />
        )}
      </button>
    </nav>
  );
}
