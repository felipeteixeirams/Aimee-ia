import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { ChatMessage } from '../types/index.js';
import { cn } from '../lib/utils.js';

interface ReactiveFeedProps {
  insights: ChatMessage[];
  onDismiss: (id: string) => void;
  onAction: (insight: ChatMessage) => void;
}

export function ReactiveFeed({ insights, onDismiss, onAction }: ReactiveFeedProps) {
  const latestInsight = insights[0]; // Show only the most recent unread one

  if (!latestInsight) return null;

  const getIcon = () => {
    if (latestInsight.content.toLowerCase().includes('alerta')) return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (latestInsight.content.toLowerCase().includes('economia')) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    return <Lightbulb className="w-4 h-4 text-amber-500" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className="px-4 py-2 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent border-b border-brand/10"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          
          <button 
            onClick={() => onAction(latestInsight)}
            className="flex-1 text-left min-w-0 group"
          >
            <p className="text-[11px] font-black text-brand uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Insight da Aimee
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate group-hover:text-brand transition-colors">
              {latestInsight.content}
            </p>
          </button>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => onDismiss(latestInsight.id!)}
              className="p-2 text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onAction(latestInsight)}
              className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
