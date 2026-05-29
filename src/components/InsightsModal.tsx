import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, TrendingUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InsightsModalProps {
  showInsightsModal: boolean;
  setShowInsightsModal: (show: boolean) => void;
  unreadInsights: any[];
  handleGoToInsight: (insight: any) => void;
}

export function InsightsModal({
  showInsightsModal,
  setShowInsightsModal,
  unreadInsights,
  handleGoToInsight
}: InsightsModalProps) {
  return (
    <AnimatePresence>
      {showInsightsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInsightsModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[3rem] shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Insights de IA</h3>
                  <p className="text-xs text-neutral-500 font-medium">{unreadInsights.length} novos insights da Aimee</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInsightsModal(false)}
                className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all shadow-sm"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 no-scrollbar">
              {unreadInsights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => handleGoToInsight(insight)}
                  className="w-full text-left p-5 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-brand/5 dark:hover:bg-brand/10 border border-neutral-100 dark:border-neutral-800 rounded-[2rem] transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed line-clamp-3">
                        {insight.content}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          {format(new Date(insight.timestamp), "HH:mm '•' d 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronDown className="w-5 h-5 text-brand -rotate-90" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-6 bg-neutral-50/50 dark:bg-neutral-800/50 text-center">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Clique em um insight para ler o contexto completo no chat
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
