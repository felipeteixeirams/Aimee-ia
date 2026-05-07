import { ChatMessage, UserProfile } from '../types';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, ChevronDown, Check, Copy, Edit2, X, TrendingUp, Mic, Square, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { AimeeAvatar } from './AimeeAvatar';
import React, { useState, memo, useCallback, useMemo } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { AudioVisualizer } from './AudioVisualizer';
import { ReactiveFeed } from './ReactiveFeed';
import { ChatRole } from '../types';

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
        "flex group gap-2.5 max-w-2xl mx-auto w-full", 
        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "shrink-0 flex flex-col justify-end pb-0.5",
        msg.role === 'user' ? "items-end" : "items-start"
      )}>
        {msg.role === 'assistant' ? (
          <AimeeAvatar 
            src={GLOBAL_AIMEE_AVATAR} 
            size="sm" 
            className="w-8 h-8 rounded-xl shadow-lg border border-white dark:border-neutral-800" 
          />
        ) : (
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-brand/10 dark:bg-brand/20 flex items-center justify-center border border-brand/20">
            {(profile?.avatarUrl || profile?.photoUrl || user?.photoURL) ? (
              <img 
                src={profile?.avatarUrl || profile?.photoUrl || user?.photoURL || ''} 
                className="w-full h-full object-cover" 
                alt="User" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[10px] font-bold text-brand uppercase">{profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}</span>
            )}
          </div>
        )}
      </div>

      <div className={cn(
        "relative flex flex-col gap-0.5 max-w-[85%] md:max-w-[75%]",
        msg.role === 'user' ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative px-4 py-3 rounded-2xl text-[14px] leading-relaxed transition-all break-words whitespace-pre-wrap",
          msg.role === 'user' 
            ? "bg-brand text-brand-foreground rounded-tr-none font-medium" 
            : msg.status === 'error'
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100 rounded-tl-none shadow-sm"
              : msg.isInsight
                ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-100 rounded-tl-none shadow-sm ring-1 ring-amber-500/10 ai-bubble"
                : "bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/30 text-neutral-800 dark:text-neutral-200 rounded-tl-none shadow-sm ai-bubble"
        )}>
          {msg.isInsight && msg.status !== 'error' && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-amber-200/50 dark:border-amber-800/50">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Insight Premium</span>
            </div>
          )}
          {msg.status === 'error' && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-200/50 dark:border-red-800/50">
              <X className="w-3 h-3 text-red-600 dark:text-red-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Falha no Envio</span>
            </div>
          )}
          {editingMessage?.id === msg.id ? (
            <div className="flex flex-col gap-3 min-w-[200px]">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-[15px] p-0 text-white placeholder:text-white/50"
                autoFocus
                rows={3}
              />
              <div className="flex justify-end gap-2 border-t border-white/20 pt-2">
                <button onClick={() => setEditingMessage(null)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-bold">
                  Cancelar
                </button>
                <button onClick={() => handleEditMessage(msg)} className="px-3 py-1 bg-white text-brand rounded-lg transition-colors text-xs font-bold">
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="block">{msg.content}</span>
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
                "absolute top-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1",
                msg.role === 'user' ? "right-full mr-3" : "left-full ml-3"
              )}>
                <button 
                  onClick={() => copyToClipboard(msg.content, msg.id || index.toString())}
                  className="p-2 glass rounded-xl text-neutral-400 hover:text-brand transition-colors relative"
                  title="Copiar"
                >
                  {copiedId === (msg.id || index.toString()) ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {msg.role === 'user' && (
                  <button 
                    onClick={() => {
                      setEditingMessage(msg);
                      setEditValue(msg.content);
                    }}
                    className="p-2 glass rounded-xl text-neutral-400 hover:text-brand transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
          {msg.actions && msg.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-brand/5 dark:border-white/5">
              {msg.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSendMessage(action.value, true)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 border",
                    msg.role === 'user' 
                      ? "bg-white/10 text-white border-white/20 hover:bg-white/20" 
                      : "bg-brand/5 text-brand border-brand/10 hover:bg-brand/10 dark:bg-brand/20 dark:text-brand-foreground"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-1 px-2",
          msg.role === 'user' ? "text-right" : "text-left"
        )}>
          {format(new Date(msg.timestamp), 'HH:mm')}
        </span>
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
}

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
  handleDismissInsight
}: ChatViewProps) => {
  const { isRecording, startRecording, stopRecording, getFrequencyData } = useVoiceRecorder();

  const onStopRecording = useCallback(async () => {
    const blob = await stopRecording();
    if (blob) {
      await handleSendVoiceMessage(blob);
    }
  }, [stopRecording, handleSendVoiceMessage]);

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
        className="flex-1 overflow-y-auto overflow-x-hidden pt-4 px-4 pb-28 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
            </div>
            <p className="text-neutral-400 text-sm">Como posso te ajudar hoje?</p>
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

            <div className="relative flex flex-col gap-0.5 max-w-[85%] md:max-w-[75%] items-start">
              <div className="relative px-4 py-3 rounded-2xl text-[14px] leading-relaxed transition-all break-words whitespace-pre-wrap bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/30 text-neutral-800 dark:text-neutral-200 rounded-tl-none shadow-sm ai-bubble">
                {filteredTypingContent}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-1 px-2 text-left">
                Digitando...
              </span>
            </div>
          </motion.div>
        )}
        {isTyping && !filteredTypingContent && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex group gap-2.5 max-w-2xl mx-auto w-full flex-row"
          >
            <div className="shrink-0 flex flex-col justify-end pb-0.5 items-start">
              <AimeeAvatar 
                src={GLOBAL_AIMEE_AVATAR} 
                size="sm" 
                className="w-8 h-8 rounded-xl shadow-lg border border-white dark:border-neutral-800" 
              />
            </div>
            <div className="bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/30 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm h-10 flex items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-36 right-6 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-2xl text-brand transition-all z-30 active:scale-90"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-neutral-50/90 via-neutral-50/50 to-transparent dark:from-neutral-950/90 dark:via-neutral-950/50 dark:to-transparent pt-8 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none z-20">
        <div className="max-w-xl mx-auto flex flex-col gap-2 pointer-events-auto">
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between px-4 py-2 bg-brand/10 dark:bg-brand/20 backdrop-blur-xl border border-brand/20 rounded-2xl mb-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-brand">Gravando...</span>
              </div>
              <AudioVisualizer isRecording={isRecording} getFrequencyData={getFrequencyData} />
            </motion.div>
          )}
          
          <div className="relative group">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? "Solte para enviar..." : "Fale com sua Aimee..."}
              disabled={isRecording}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] pl-6 pr-24 py-4 text-sm focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all outline-none dark:text-white shadow-xl shadow-black/5 disabled:opacity-50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                onClick={isRecording ? onStopRecording : startRecording}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90",
                  isRecording 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/40" 
                    : "text-neutral-400 hover:text-brand bg-neutral-50 dark:bg-neutral-800"
                )}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping || isRecording}
                className="w-10 h-10 bg-brand text-brand-foreground rounded-full flex items-center justify-center shadow-lg shadow-brand/20 active:scale-90 transition-all disabled:opacity-30 disabled:scale-100 group shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ChatView.displayName = 'ChatView';

