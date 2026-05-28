import { ChatMessage, UserProfile } from '../types/index.js';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, ChevronDown, Check, Copy, Edit2, X, TrendingUp, Mic, Square, RefreshCcw, Wallet, Calendar, Sparkles, ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { format } from 'date-fns';
import { AimeeAvatar } from '../components/AimeeAvatar.js';
import React, { useState, memo, useCallback, useMemo } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder.js';
import { AudioVisualizer } from '../components/AudioVisualizer.js';
import { ReactiveFeed } from '../components/ReactiveFeed.js';
import { ChatRole } from '../types/index.js';
import Markdown from 'react-markdown';

interface ChatMessageItemProps {
  msg: ChatMessage;
  index: number;
  profile: UserProfile | null;
  user: User | null;
  GLOBAL_AIMEE_AVATAR: string;
  editingMessage: ChatMessage | null;
  editValue: string;
  setEditValue: (text: string) => void;
  setEditingMessage: (msg: ChatMessage | null) => void;
  handleEditMessage: (msg: ChatMessage) => void;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  handleSendMessage: (overrideText?: string, skipAddDoc?: boolean) => void;
  handleRetry: (index: number) => void;
}

const ChatMessageItem = memo(({
  msg,
  index,
  profile,
  user,
  GLOBAL_AIMEE_AVATAR,
  editingMessage,
  editValue,
  setEditValue,
  setEditingMessage,
  handleEditMessage,
  copyToClipboard,
  copiedId,
  handleSendMessage,
  handleRetry
}: ChatMessageItemProps) => {
  return (
    <motion.div 
      key={msg.id || index} 
      id={`msg-${msg.id}`}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex group gap-4 max-w-3xl mx-auto w-full", 
        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "shrink-0 flex flex-col justify-start pt-1",
        msg.role === 'user' ? "items-end hidden" : "items-start"
      )}>
        {msg.role === 'assistant' && (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 shrink-0">
             <AimeeAvatar 
               src={GLOBAL_AIMEE_AVATAR} 
               size="sm" 
               className="w-full h-full" 
             />
          </div>
        )}
      </div>

      <div className={cn(
        "relative flex flex-col gap-1 w-full max-w-[88%] md:max-w-[82%]",
        msg.role === 'user' ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative text-[15px] leading-relaxed transition-all break-words whitespace-pre-wrap group-hover:shadow-md",
          msg.role === 'user' 
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-[1.5rem] rounded-tr-[0.5rem] px-5 py-3.5 font-medium shadow-[0_4px_14px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_14px_rgba(255,255,255,0.05)]" 
            : msg.status === 'error'
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100 rounded-[1.5rem] rounded-tl-[0.5rem] px-5 py-3.5 shadow-sm"
              : msg.isInsight
                ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-100 rounded-[1.5rem] rounded-tl-[0.5rem] px-5 py-3.5 shadow-sm ring-1 ring-amber-500/10 ai-bubble"
                : "bg-transparent text-neutral-800 dark:text-neutral-200 py-2 pt-1 px-1"
        )}>
          {msg.isInsight && msg.status !== 'error' && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-amber-200/50 dark:border-amber-800/50">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Insight Premium</span>
            </div>
          )}
          {msg.status === 'error' && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-200/50 dark:border-red-800/50">
              <X className="w-3 h-3 text-red-600 dark:text-red-400" aria-hidden="true" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Falha no Envio</span>
            </div>
          )}
          {editingMessage?.id === msg.id ? (
            <div className="flex flex-col gap-3 min-w-[300px]">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand resize-none text-[15px] p-3 text-neutral-900 dark:text-white"
                autoFocus
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingMessage(null)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors text-sm font-medium">
                  Cancelar
                </button>
                <button onClick={() => handleEditMessage(msg)} className="px-4 py-2 bg-brand text-brand-foreground rounded-xl transition-colors text-sm font-medium">
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
              {msg.status === 'error' && (
                <button 
                  onClick={() => handleRetry(index)}
                  className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Tentar Novamente
                </button>
              )}
              <div className={cn(
                "mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5",
                msg.role === 'user' ? "justify-end absolute -bottom-8 right-0" : "justify-start"
              )}>
                <button 
                  onClick={() => copyToClipboard(msg.content, msg.id || index.toString())}
                  className="p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="Copiar"
                  aria-label="Copiar mensagem"
                >
                  {copiedId === (msg.id || index.toString()) ? (
                    <Check className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
                {msg.role === 'user' && (
                  <button 
                    onClick={() => {
                      setEditingMessage(msg);
                      setEditValue(msg.content);
                    }}
                    className="p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all"
                    title="Editar"
                    aria-label="Editar mensagem"
                  >
                    <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </>
          )}
          {msg.actions && msg.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {msg.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSendMessage(action.value, true)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-95 border",
                    msg.role === 'user' 
                      ? "bg-white/50 dark:bg-neutral-700 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600" 
                      : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';

interface ChatViewProps {
  messages: ChatMessage[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  showScrollButton: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  inputText: string;
  setInputText: (text: string) => void;
  unreadInsights: ChatMessage[];
  handleGoToInsight: (msg: ChatMessage) => void;
  handleDismissInsight: (id: string) => void;
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
  user: User | null;
  GLOBAL_AIMEE_AVATAR: string;
  availableAIProviders: string[];
}

const ChatSkeleton = memo(({ GLOBAL_AIMEE_AVATAR }: { GLOBAL_AIMEE_AVATAR: string }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className="flex group gap-2.5 max-w-2xl mx-auto w-full flex-row"
  >
    <div className="shrink-0 flex flex-col justify-end pb-0.5 items-start">
      <AimeeAvatar 
        src={GLOBAL_AIMEE_AVATAR} 
        size="sm" 
        className="w-8 h-8 rounded-xl shadow-lg border border-white dark:border-neutral-800" 
      />
    </div>
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 px-6 py-4 rounded-[1.5rem] rounded-tl-[0.5rem] shadow-sm flex items-center justify-center gap-1.5 h-12 w-16">
      <div className="w-1.5 h-1.5 bg-brand/40 dark:bg-brand/60 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.32s]" />
      <div className="w-1.5 h-1.5 bg-brand/40 dark:bg-brand/60 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] [animation-delay:-0.16s]" />
      <div className="w-1.5 h-1.5 bg-brand/40 dark:bg-brand/60 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]" />
    </div>
  </motion.div>
));

export const ChatView = memo(({
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
  user,
  GLOBAL_AIMEE_AVATAR,
  unreadInsights,
  handleGoToInsight,
  handleDismissInsight,
  availableAIProviders
}: ChatViewProps) => {
  const { 
    isRecording, 
    isSupported, 
    startRecording, 
    stopRecording, 
    getFrequencyData, 
    transcript 
  } = useVoiceRecorder((text) => {
    setInputText(inputText + (inputText.endsWith(' ') || inputText === '' ? '' : ' ') + text);
  });
  const [isTranscribing, setIsTranscribing] = useState(false);

  const onStopRecording = useCallback(async () => {
    await stopRecording();
    // No longer auto-sending audio blob, we rely on the transcript in the input field
  }, [stopRecording]);

  const handleRetry = useCallback((index: number) => {
    // Find the last user message before this error
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === ChatRole.USER) {
        handleSendMessage(messages[i].content, true);
        return;
      }
    }
  }, [messages, handleSendMessage]);

  const renderedMessages = useMemo(() => {
    return messages.reduce((acc: any[], msg, i) => {
      const dateStr = msg.timestamp.split('T')[0];
      const prevDateStr = i > 0 ? messages[i-1].timestamp.split('T')[0] : null;
      
      if (dateStr !== prevDateStr) {
        acc.push(
          <div key={`sep-${dateStr}`} className="flex justify-center my-6">
            <span className="px-3 py-1 bg-neutral-100/50 dark:bg-neutral-900/50 text-[9px] text-neutral-400 font-bold rounded-full uppercase tracking-[0.15em] border border-neutral-200/50 dark:border-neutral-800/50">
              {formatDateSeparator(msg.timestamp)}
            </span>
          </div>
        );
      }
      
      acc.push(
        <ChatMessageItem 
          key={msg.id || i}
          msg={msg}
          index={i}
          profile={profile}
          user={user}
          GLOBAL_AIMEE_AVATAR={GLOBAL_AIMEE_AVATAR}
          editingMessage={editingMessage}
          editValue={editValue}
          setEditValue={setEditValue}
          setEditingMessage={setEditingMessage}
          handleEditMessage={handleEditMessage}
          copyToClipboard={copyToClipboard}
          copiedId={copiedId}
          handleSendMessage={handleSendMessage}
          handleRetry={handleRetry}
        />
      );
      return acc;
    }, []);
  }, [
    messages, 
    profile, 
    user, 
    GLOBAL_AIMEE_AVATAR, 
    editingMessage, 
    editValue, 
    setEditValue, 
    setEditingMessage, 
    handleEditMessage, 
    copyToClipboard, 
    copiedId, 
    handleSendMessage, 
    handleRetry,
    formatDateSeparator
  ]);

  // Filter out any typing content that might already be in the messages to avoid duplication
  const filteredTypingContent = useMemo(() => {
    if (!typingContent) return null;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === ChatRole.ASSISTANT && lastMessage.content === typingContent) {
      return null;
    }
    return typingContent;
  }, [typingContent, messages]);

  return (
    <motion.div 
      key="chat"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col relative"
    >
      <ReactiveFeed 
        insights={unreadInsights} 
        onDismiss={handleDismissInsight} 
        onAction={handleGoToInsight} 
      />
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden pt-4 px-4 pb-[140px] md:pb-[160px] space-y-4"
      >
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
            {/* Elegant Logo / Greeting */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center mb-8 md:mb-12"
            >
              <div className="relative inline-flex items-center justify-center p-0.5 rounded-full bg-linear-to-tr from-brand via-amber-400 to-rose-400 dark:from-brand dark:to-emerald-400 mb-6 group">
                <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300 overflow-hidden">
                  <AimeeAvatar src={GLOBAL_AIMEE_AVATAR} size="lg" className="w-14 h-14 rounded-full" />
                </div>
                {/* Floating active dot */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950 shadow-sm" />
              </div>

              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
                Olá, <span className="bg-linear-to-r from-brand via-brand-muted to-brand/80 bg-clip-text text-transparent dark:from-brand dark:to-emerald-400">{profile?.displayName ? profile.displayName.split(' ')[0] : 'aí'}</span>.
              </h2>
              <p className="text-sm md:text-base font-medium text-neutral-400 dark:text-neutral-500 mt-2">
                Como posso facilitar seu dia hoje?
              </p>
            </motion.div>

            {/* Starter Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {[
                {
                  id: 'finance',
                  title: 'Análise de Gastos',
                  caption: 'Analisar despesas recentes por categoria e ver conselhos.',
                  prompt: 'Gostaria de uma análise detalhada dos meus gastos recentes e conselhos de como atingir minhas economias.',
                  icon: Wallet,
                  colorClass: 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400'
                },
                {
                  id: 'saving_challenge',
                  title: 'Desafio Financeiro',
                  caption: 'Criar um plano prático para poupar nos próximos 7 dias.',
                  prompt: 'Mande ideias para um plano prático ou desafio financeiro de 7 dias para me ajudar a economizar R$ 100 essa semana.',
                  icon: Sparkles,
                  colorClass: 'text-amber-500 bg-amber-500/10 dark:text-amber-400'
                },
                {
                  id: 'shopping_list',
                  title: 'Lista de Compras',
                  caption: 'Planejar minhas compras de forma eficiente.',
                  prompt: 'Ajude-me a planejar minha lista de compras adicionando itens essenciais e saudáveis para a semana.',
                  icon: ShoppingCart,
                  colorClass: 'text-rose-500 bg-rose-500/10 dark:text-rose-400'
                },
                {
                  id: 'smart_routine',
                  title: 'Rotinas Inteligentes',
                  caption: 'Otimizar minha rotina de hábitos diários.',
                  prompt: 'Sugira uma rotina saudável e produtiva de 15 minutos para otimizar meu foco e bem-estar no dia-a-dia.',
                  icon: Calendar,
                  colorClass: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400'
                }
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSendMessage(card.prompt)}
                    className="text-left p-5 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.015)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:bg-white dark:hover:bg-neutral-800 focus:outline-none transition-all flex flex-col justify-between h-[140px] group cursor-pointer"
                  >
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border-0 font-bold", card.colorClass)}>
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-neutral-800 dark:text-white group-hover:text-brand dark:group-hover:text-amber-400 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 leading-normal mt-1 line-clamp-2">
                        {card.caption}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
        {renderedMessages}
        {filteredTypingContent && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex group gap-2.5 max-w-2xl mx-auto w-full flex-row"
          >
            <div className="shrink-0 flex flex-col justify-end pb-0.5 items-start">
              <AimeeAvatar 
                src={GLOBAL_AIMEE_AVATAR} 
                size="sm" 
                className="w-8 h-8 rounded-xl shadow-lg border border-white dark:border-neutral-800" 
              />
            </div>

            <div className="relative flex flex-col gap-0.5 max-w-[88%] md:max-w-[82%] items-start">
              <div className="relative text-[15px] leading-relaxed transition-all break-words whitespace-pre-wrap bg-transparent text-neutral-800 dark:text-neutral-200 py-2 pt-1 px-1 ai-bubble">
                <div className="markdown-body">
                  <Markdown>{filteredTypingContent}</Markdown>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand mt-1 px-2 text-left animate-pulse hidden">
                Transcrevendo...
              </span>
            </div>
          </motion.div>
        )}
        {isTyping && !filteredTypingContent && (
          <ChatSkeleton GLOBAL_AIMEE_AVATAR={GLOBAL_AIMEE_AVATAR} />
        )}
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-44 right-6 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-2xl text-brand transition-all z-30 active:scale-90"
            aria-label="Rolar para o fim"
          >
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 pt-6 pb-4 px-4 bg-gradient-to-t from-white via-white to-transparent dark:from-neutral-950 dark:via-neutral-950 dark:to-transparent z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col gap-2 pointer-events-auto">
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between px-4 py-2 bg-brand/10 dark:bg-brand/20 border border-brand/20 rounded-2xl mb-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-medium text-brand">Gravando...</span>
              </div>
              <AudioVisualizer isRecording={isRecording} getFrequencyData={getFrequencyData} />
            </motion.div>
          )}
          
          <div className="relative group flex items-end bg-white/70 dark:bg-neutral-900/70 backdrop-blur-3xl rounded-[2rem] border border-neutral-200/50 dark:border-neutral-700/50 focus-within:bg-white dark:focus-within:bg-neutral-900 focus-within:ring-4 focus-within:ring-brand/10 focus-within:border-brand/30 dark:focus-within:ring-brand/20 dark:focus-within:border-brand/30 transition-all p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = '42px';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                  e.currentTarget.style.height = '42px';
                }
              }}
              placeholder={isRecording ? "Solte para enviar..." : isTranscribing ? "Aimee está ouvindo..." : "Mensagem para Aimee"}
              disabled={isRecording || isTranscribing}
              rows={1}
              className="w-full bg-transparent border-none rounded-[1.5rem] pl-5 pr-[100px] py-3 text-[15px] focus:ring-0 outline-none dark:text-white disabled:opacity-50 resize-none leading-relaxed font-medium"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            <div className="absolute right-2 bottom-1.5 flex items-center gap-1.5 pb-0">
              <button
                onClick={isRecording ? onStopRecording : startRecording}
                disabled={isTranscribing || (!isSupported && !availableAIProviders.includes('gemini'))}
                title={!isSupported && !availableAIProviders.includes('gemini') ? "Transcrição não suportada" : "Falar"}
                aria-label={isRecording ? "Parar gravação" : "Começar gravação de voz"}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all group-hover/btn:scale-105 active:scale-95",
                  isRecording 
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse" 
                    : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  (isTranscribing || (!isSupported && !availableAIProviders.includes('gemini'))) && "opacity-50 cursor-not-allowed"
                )}
                aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
              >
                {isTranscribing ? (
                  <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                ) : isRecording ? (
                  <Square className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Mic className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping || isRecording || isTranscribing}
                aria-label="Enviar mensagem"
                className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-[1.2rem] flex items-center justify-center transition-all hover:scale-105 hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-white/20 active:scale-95 disabled:hover:scale-100 disabled:opacity-30 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 disabled:shadow-none shrink-0"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="text-[11px] text-neutral-400">Aimee pode cometer erros. Considere verificar informações importantes.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ChatView.displayName = 'ChatView';

