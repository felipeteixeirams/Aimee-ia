import { motion } from 'motion/react';
import { MessageSquare, Wallet, ShoppingCart, Calendar, Settings } from 'lucide-react';
import { Tab } from '../../types/index.js';
import { cn } from '../../lib/utils.js';

interface BottomMenuProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  shoppingItemsCount: number;
}

export function BottomMenu({ activeTab, setActiveTab, shoppingItemsCount }: BottomMenuProps) {
  const tabs = [
    { id: 'chat' as Tab, label: 'Chat', icon: MessageSquare },
    { id: 'finance' as Tab, label: 'Finanças', icon: Wallet },
    { id: 'shopping' as Tab, label: 'Compras', icon: ShoppingCart },
    { id: 'routines' as Tab, label: 'Rotinas', icon: Calendar },
    { id: 'settings' as Tab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-3xl border-t border-neutral-200/50 dark:border-neutral-800/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-12 outline-none group active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-menu-indicator"
                  className="absolute inset-0 bg-brand/10 dark:bg-brand/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-colors duration-200", 
                      isActive 
                        ? "text-brand" 
                        : "text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                    )} 
                  />
                  {tab.id === 'shopping' && shoppingItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-[1.5px] border-white dark:border-neutral-900">
                      {shoppingItemsCount > 9 ? '9+' : shoppingItemsCount}
                    </span>
                  )}
                </div>
                <span 
                  className={cn(
                    "text-[9px] font-black uppercase tracking-wider transition-colors duration-200",
                    isActive 
                      ? "text-brand" 
                      : "text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                  )}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
