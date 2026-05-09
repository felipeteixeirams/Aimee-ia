import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAimeeActions } from './useAimeeActions.js';
import { chatRepository } from '../infrastructure/repositories/index.js';
import { aimeeClientOrchestrator } from '../services/aiService.js';

// Mock dependencies
vi.mock('../lib/firebase.js', () => ({
  auth: { currentUser: { uid: 'user-1' } },
  signOut: vi.fn(),
  googleProvider: {},
  signInWithPopup: vi.fn()
}));

vi.mock('../infrastructure/repositories/index.js', () => ({
  chatRepository: { create: vi.fn().mockResolvedValue('msg-id') },
  taskRepository: {},
  transactionRepository: {},
  shoppingRepository: {},
  profileRepository: {},
  eventRepository: {},
  configRepository: {}
}));

vi.mock('../services/aiService.js', () => ({
  aimeeClientOrchestrator: vi.fn().mockResolvedValue('Olá!')
}));

vi.mock('../components/ToastProvider.js', () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

vi.mock('../lib/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn() }
}));

describe('useAimeeActions', () => {
  const mockUser = { uid: 'user-1' } as any;
  const mockProfile = { selectedPersona: 'funny' } as any;
  const mockAimeeData = {
    messages: [],
    transactions: [],
    shoppingList: [],
    goals: [],
    tasks: [],
    events: [],
    shares: [],
    globalConfig: { aiProvider: 'gemini' }
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('should return action functions', () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    expect(result.current.sendMessage).toBeDefined();
    expect(result.current.manageTasks).toBeDefined();
  });

  it.skip('should process sendMessage flow', async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    
    const setTyping = vi.fn();
    const typeText = vi.fn().mockResolvedValue(undefined);
    const setTypingContent = vi.fn();

    await result.current.sendMessage(
      'Test message', 
      null, 
      setTyping, 
      typeText, 
      setTypingContent
    );

    expect(chatRepository.create).toHaveBeenCalled();
    expect(aimeeClientOrchestrator).toHaveBeenCalled();
    expect(setTyping).toHaveBeenCalledWith(true);
    expect(typeText).toHaveBeenCalledWith('Olá!');
    expect(setTyping).toHaveBeenCalledWith(false);
  });

  it.skip('should handle actions in AI response', async () => {
    vi.mocked(aimeeClientOrchestrator).mockResolvedValue('Resposta com ação [ACTIONS: [{"id": "1", "label": "Ok", "value": "check", "type": "button"}]]');
    
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    
    const typeText = vi.fn().mockResolvedValue(undefined);

    await result.current.sendMessage('oi', null, vi.fn(), typeText, vi.fn());

    expect(typeText).toHaveBeenCalledWith('Resposta com ação');
    expect(chatRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ 
          actions: expect.arrayContaining([expect.objectContaining({ label: 'Ok' })]) 
        }),
        'user-1'
    );
  });

  it.skip('should manage tasks toggle', async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    const { taskRepository } = await import('../infrastructure/repositories/index.js');
    (taskRepository.update as any) = vi.fn().mockResolvedValue({});
    
    await result.current.manageTasks.toggle('task-1', 'todo', 'user-1');
    
    expect(taskRepository.update).toHaveBeenCalledWith('task-1', { status: 'done' }, 'user-1');
  });

  it.skip('should manage shopping addItem', async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    const { shoppingRepository } = await import('../infrastructure/repositories/index.js');
    (shoppingRepository.create as any) = vi.fn().mockResolvedValue({});

    await result.current.manageShopping.addItem({ name: 'Leite', purchased: false }, 'user-1');

    expect(shoppingRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Leite', purchased: false }),
        'user-1'
    );
  });
});
