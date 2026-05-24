import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, MapPin, Globe, CreditCard, ChevronDown, ChevronUp, BellRing, Settings2, Filter, Info, InfoIcon, Calendar } from 'lucide-react';
import { MonitorEvent, EventMonitorConfig, EVENT_TAXONOMY } from '../types/index.js';
import { cn, safeFormatDate } from '../lib/utils.js';

interface Props {
  monitorEvents: MonitorEvent[];
  monitorConfig: EventMonitorConfig | null;
  handleSaveConfig: (config: any) => void;
}

export const EventMonitorComponent = ({ monitorEvents, monitorConfig, handleSaveConfig }: Props) => {
  const [showConfig, setShowConfig] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<'daily' | 'weekly'>(monitorConfig?.frequency || 'weekly');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(monitorConfig?.interests || []);
  const [onlineOnly, setOnlineOnly] = useState(monitorConfig?.preferences?.onlineOnly || false);
  const [freeOnly, setFreeOnly] = useState(monitorConfig?.preferences?.freeOnly || false);

  const flatTaxonomy = useMemo(() => {
    const arr: string[] = [];
    Object.values(EVENT_TAXONOMY).forEach(sub => {
      Object.values(sub).forEach(items => {
        arr.push(...items);
      });
    });
    return Array.from(new Set(arr)).sort();
  }, []);

  const handleSave = () => {
    handleSaveConfig({
      ...monitorConfig,
      active: true,
      frequency: activeFrequency,
      interests: selectedInterests,
      preferences: {
        onlineOnly,
        freeOnly,
        languages: monitorConfig?.preferences?.languages || ['pt', 'en']
      }
    });
    setShowConfig(false);
  };

  const filteredEvents = useMemo(() => {
    if (!monitorConfig?.active) return []; // Only show if active

    let events = monitorEvents;
    
    // Config filters
    if (monitorConfig.interests.length > 0) {
      events = events.filter(e => e.freeTextTags.some(tag => monitorConfig.interests.includes(tag)) || e.mentionedTechs.some(tag => monitorConfig.interests.includes(tag)));
    }
    if (monitorConfig.preferences?.onlineOnly) {
      events = events.filter(e => e.format === 'online');
    }
    if (monitorConfig.preferences?.freeOnly) {
      events = events.filter(e => e.cost === 0);
    }
    
    return events;
  }, [monitorEvents, monitorConfig]);

  if (!monitorConfig?.active && !showConfig) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-400">Discovery Engine</h3>
            </div>
            <p className="text-sm text-indigo-700/70 dark:text-indigo-300/60 leading-relaxed max-w-sm mb-4">
              Ative o monitor inteligente de eventos. O sistema fará buscas contínuas na web (background) sobre os temas do seu interesse.
            </p>
            <button 
              onClick={() => setShowConfig(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Configurar Monitoramento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Descoberta em Background</p>
            <p className="text-lg font-black text-neutral-800 dark:text-white tracking-tight">Monitor de Eventos</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="w-10 h-10 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl flex items-center justify-center transition-colors text-neutral-500 border border-neutral-100 dark:border-neutral-800"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 mb-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Frequência de Busca</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveFrequency('daily')}
                    className={cn(
                      "flex-1 py-3 rounded-2xl text-xs font-bold transition-all border",
                      activeFrequency === 'daily' ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    Diária
                  </button>
                  <button 
                    onClick={() => setActiveFrequency('weekly')}
                    className={cn(
                      "flex-1 py-3 rounded-2xl text-xs font-bold transition-all border",
                      activeFrequency === 'weekly' ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    Semanal
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Temas de Interesse</label>
                <div className="flex flex-wrap gap-2">
                  {flatTaxonomy.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedInterests.includes(tag)) {
                          setSelectedInterests(selectedInterests.filter(t => t !== tag));
                        } else {
                          setSelectedInterests([...selectedInterests, tag]);
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                        selectedInterests.includes(tag) ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-500"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Filtros Restritivos</label>
                 <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={onlineOnly}
                        onChange={(e) => setOnlineOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600 bg-white"
                      />
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 group-hover:text-indigo-600 transition-colors">Apenas Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={freeOnly}
                        onChange={(e) => setFreeOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600 bg-white"
                      />
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 group-hover:text-indigo-600 transition-colors">Apenas Gratuitos</span>
                    </label>
                 </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[0.98] transition-transform"
              >
                Salvar Configurações
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
        {filteredEvents.length > 0 ? filteredEvents.map((event, i) => (
          <div key={event.id || i} className="p-5 glass rounded-[2rem] border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="text-base font-black text-neutral-800 dark:text-white leading-tight">
                {event.title}
              </h4>
              <span className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-[9px] font-bold uppercase tracking-widest text-neutral-500 border border-neutral-100 dark:border-neutral-800 shrink-0">
                {event.format === 'online' ? '🌐 Online' : '📍 ' + (event.location || event.format)}
              </span>
            </div>
            
            <p className="text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-2">
              {event.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.startDate ? safeFormatDate(event.startDate, 'dd MMM yyyy') : 'Em breve'}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                  <CreditCard className="w-3.5 h-3.5" />
                  {event.cost === 0 ? 'Gratuito' : `Pago`}
                </div>
              </div>
              
              {event.sourceLink && (
                <a 
                  href={event.sourceLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-colors"
                >
                  Ver Detalhes
                </a>
              )}
            </div>
          </div>
        )) : (
          <div className="py-10 text-center">
            <Search className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-xs text-neutral-400 font-bold">Nenhum evento encontrado para seus filtros.</p>
            <p className="text-[10px] text-neutral-500 mt-1">Nossa IA está constantemente buscando novidades.</p>
          </div>
        )}
      </div>
    </div>
  );
};
