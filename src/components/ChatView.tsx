import { ChatMessage, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, ChevronDown, Check, Copy, Edit2, X, TrendingUp, Mic, Square } from 'lucide-react';
import { cn } from '../lib/utils';
import { AimeeAvatar } from './AimeeAvatar';
import React, { useState } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { AudioVisualizer } from './AudioVisualizer';

interface ChatViewProps {
  messages: ChatMessage[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  showScrollButton: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: (overrideText?: string, skipAddDoc?: boolean) => void;
  handleSendVoiceMessage: (audioBlob: Blob) => Promise<void>;
  isTyping: boolean;
  typingContent: string | null;
  formatDateSeparator: (dateStr: string) => string;
  editingMessage: ChatMessage | null;
  setEditingMessage: (msg: ChatMessage | null) => void;
  editValue: string;
  setEditValue: (text: string) => void;
  handleEditMessage: (msg: ChatMessage) => void;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  profile: UserProfile | null;
  GLOBAL_AIMEE_AVATAR: string;
}

export const ChatView = ({
  messages,
  scrollRef,
  handleScroll,
  showScrollButton,
  scrollToBottom,
  inputText,
  setInputText,
  handleSendMessage,
  handleSendVoiceMessage,
  isTyping,
  typingContent,
  formatDateSeparator,
  editingMessage,
  setEditingMessage,
  editValue,
  setEditValue,
  handleEditMessage,
  copyToClipboard,
  copiedId,
  profile,
  GLOBAL_AIMEE_AVATAR
}: ChatViewProps) => {
  const { isRecording, startRecording, stopRecording, getFrequencyData } = useVoiceRecorder();

  const onStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      await handleSendVoiceMessage(blob);
    }
  };
  return (
    <motion.div 
      key="chat"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col relative"
    >
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
            </div>
            <p className="text-neutral-400 text-sm">Como posso te ajudar hoje?</p>
          </div>
        )}
        {messages.reduce((acc: any[], msg, i) => {
          const dateStr = msg.timestamp.split('T')[0];
          const prevDateStr = i > 0 ? messages[i-1].timestamp.split('T')[0] : null;
          
          if (dateStr !== prevDateStr) {
            acc.push(
              <div key={`sep-${dateStr}`} className="flex justify-center my-6">
                <span className="px-3 py-1 bg-neutral-50 dark:bg-neutral-900/50 text-[10px] text-neutral-400 font-medium rounded-full uppercase tracking-widest">
                  {formatDateSeparator(msg.timestamp)}
                </span>
              </div>
            );
          }
          
          acc.push(
            <motion.div 
              key={msg.id || i} 
              id={`msg-${msg.id}`}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex group items-end gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              {msg.role === 'assistant' && (
                <div className="shrink-0 mb-1">
                  <AimeeAvatar src={profile?.avatarUrl || GLOBAL_AIMEE_AVATAR} size="sm" className="w-8 h-8 rounded-xl shadow-lg border border-white dark:border-neutral-800" />
                </div>
              )}
              <div className={cn(
                "relative max-w-[85%] px-5 py-4 rounded-[1.75rem] text-[15px] leading-relaxed transition-all break-words whitespace-pre-wrap shadow-xl shadow-black/5",
                msg.role === 'user' 
                  ? "bg-brand text-white rounded-br-sm shadow-brand/10 font-medium" 
                  : msg.isInsight
                    ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 text-amber-900 dark:text-amber-100 rounded-bl-sm ring-1 ring-amber-500/10"
                    : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-sm"
              )}>
                {msg.isInsight && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200/50 dark:border-amber-800/50">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Insight Financeiro</span>
                  </div>
                )}
                {editingMessage?.id === msg.id ? (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm p-0 text-brand-foreground placeholder:text-brand-foreground/50"
                      autoFocus
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingMessage(null)} className="p-1 hover:bg-black/10 rounded transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleEditMessage(msg)} className="p-1 hover:bg-black/10 rounded transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {msg.content}
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex gap-1",
                      msg.role === 'user' ? "right-full mr-2" : "left-full ml-2"
                    )}>
                      <button 
                        onClick={() => copyToClipboard(msg.content, msg.id || i.toString())}
                        className="p-1.5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg shadow-sm text-neutral-400 hover:text-brand transition-colors relative"
                        title="Copiar"
                      >
                        {copiedId === (msg.id || i.toString()) ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <AnimatePresence>
                          {copiedId === (msg.id || i.toString()) && (
                            <motion.span 
                              initial={{ opacity: 0, y: 10, x: '-50%' }}
                              animate={{ opacity: 1, y: 0, x: '-50%' }}
                              exit={{ opacity: 0, y: -10, x: '-50%' }}
                              className="absolute bottom-full mb-2 left-1/2 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-xl border border-neutral-700/50 z-50"
                            >
                              Copiado para a área de transferência!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                      {msg.role === 'user' && (
                        <button 
                          onClick={() => {
                            setEditingMessage(msg);
                            setEditValue(msg.content);
                          }}
                          className="p-1.5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg shadow-sm text-neutral-400 hover:text-brand transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
          return acc;
        }, [])}
        {typingContent && (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm text-sm leading-relaxed break-words whitespace-pre-wrap">
              {typingContent}
            </div>
          </motion.div>
        )}
        {isTyping && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-32 right-6 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-2xl text-brand transition-all z-30 active:scale-90"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-50/90 via-neutral-50/50 to-transparent dark:from-neutral-950/90 dark:via-neutral-950/50 dark:to-transparent pt-12 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pointer-events-none z-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-3 pointer-events-auto">
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-6 py-3 bg-brand/10 dark:bg-brand/20 backdrop-blur-xl border border-brand/20 rounded-2xl mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand">Gravando Áudio...</span>
              </div>
              <AudioVisualizer isRecording={isRecording} getFrequencyData={getFrequencyData} />
            </motion.div>
          )}
          
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isRecording ? "Solte o botão para enviar..." : "Fale com sua Aimee..."}
                disabled={isRecording}
                className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-100 dark:border-neutral-800 rounded-[2rem] px-8 py-5 text-sm focus:ring-8 focus:ring-brand/5 focus:border-brand/30 transition-all outline-none dark:text-white shadow-2xl shadow-black/5 group-hover:shadow-xl group-hover:border-neutral-200 dark:group-hover:border-neutral-700 disabled:opacity-50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button
                  onClick={isRecording ? onStopRecording : startRecording}
                  className={cn(
                    "p-2 rounded-full transition-all active:scale-90",
                    isRecording 
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/40" 
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-brand"
                  )}
                 >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                 </button>
              </div>
            </div>
            <button 
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping || isRecording}
              className="w-16 h-16 bg-brand text-brand-foreground rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand/40 active:scale-90 transition-all disabled:opacity-50 disabled:scale-100 group shrink-0"
            >
              <Send className="w-7 h-7 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
