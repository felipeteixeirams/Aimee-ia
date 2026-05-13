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
  if (!insights || insights.length === 0) return null;

  const getIcon = (text: string) => {
    if (text.toLowerCase().includes('alerta')) return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (text.toLowerCase().includes('economia')) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    return <Lightbulb className="w-4 h-4 text-amber-500" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className="w-full relative py-3"
      >
        <div className="px-4 mb-3 flex items-center justify-between max-w-4xl mx-auto">
          <h3 className="text-sm font-['Inter'] font-black text-neutral-800 dark:text-neutral-200 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            Para Você
          </h3>
          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {insights.length} {insights.length === 1 ? 'novo' : 'novos'}
          </span>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 pt-1 px-4 gap-4 max-w-4xl mx-auto">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              layoutId={insight.id}
              className="snap-center shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-neutral-900 rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-neutral-100 dark:border-neutral-800 relative group"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(insight.id!);
                }}
                className="absolute top-4 right-4 w-6 h-6 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-3 h-3 text-neutral-500" />
              </button>

              <button 
                className="text-left w-full h-full flex flex-col focus:outline-none"
                onClick={() => onAction(insight)}
              >
                <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                  {getIcon(insight.content)}
                </div>
                
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Insight Aimee</h4>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 line-clamp-3 leading-relaxed mb-4">
                  {insight.content}
                </p>

                <div className="mt-auto flex items-center text-brand text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                  Ver detalhes
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
