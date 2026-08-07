import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAimeeActions } from "./useAimeeActions.js";
import { chatRepository, taskRepository, shoppingRepository } from "../../infrastructure/repositories/index.js";
import { aimeeClientOrchestrator } from "../services/aiService.js";

// Mock dependencies (Must be before other imports to ensure hoisted correctly)
vi.mock("../../lib/firebase.js", () => ({
  auth: { currentUser: { uid: "user-1" } },
  signOut: vi.fn(),
  googleProvider: {},
  signInWithPopup: vi.fn(),
  db: {}
}));

vi.mock("../../infrastructure/repositories/index.js", () => ({
  chatRepository: { create: vi.fn().mockResolvedValue("msg-id"), update: vi.fn() },
  taskRepository: { update: vi.fn(), create: vi.fn(), getById: vi.fn(), delete: vi.fn(), list: vi.fn() },
  transactionRepository: { create: vi.fn(), list: vi.fn() },
  shoppingRepository: { create: vi.fn(), update: vi.fn(), delete: vi.fn(), list: vi.fn() },
  profileRepository: { updateProfile: vi.fn(), getProfile: vi.fn(), getGoogleCredentials: vi.fn() },
  eventRepository: { delete: vi.fn(), create: vi.fn(), list: vi.fn(), update: vi.fn() },
  configRepository: { updateGlobal: vi.fn() },
  usageRepository: { logUsage: vi.fn() },
  BaseRepository: class {}
}));

vi.mock("../services/aiService.js", () => ({
  aimeeClientOrchestrator: vi.fn().mockResolvedValue("Olá!")
}));

vi.mock("../components/ToastProvider.js", () => ({
  useToast: () => ({
    showToast: vi.fn()
  })
}));

const mockUser = { uid: "user-1", email: "user@example.com" } as any;
const mockProfile = { uid: "user-1", nickname: "User", role: "admin", displayPreference: "nickname" } as any;
const mockAimeeData = {
  messages: [],
  transactions: [],
  shoppingList: [],
  goals: [],
  tasks: [],
  events: [],
  shares: [],
  globalConfig: { aiProvider: "gemini" } as any
};

describe("useAimeeActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return action functions", () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    expect(result.current.sendMessage).toBeDefined();
    expect(result.current.manageTasks).toBeDefined();
  });

  it("should process sendMessage flow", async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    
    const setTyping = vi.fn();
    const typeText = vi.fn();
    const setTypingContent = vi.fn();

    await result.current.sendMessage(
      "Olá, Aimee!",
      null, 
      setTyping, 
      typeText,
      setTypingContent
    );

    expect(chatRepository.create).toHaveBeenCalled();
    expect(aimeeClientOrchestrator).toHaveBeenCalled();
    expect(typeText).toHaveBeenCalledWith("Olá!");
    expect(setTypingContent).toHaveBeenCalledWith(null);
    expect(setTyping).toHaveBeenCalledWith(false);
  });

  it("should handle actions in AI response", async () => {
    vi.mocked(aimeeClientOrchestrator).mockResolvedValue("Resposta com ação [ACTIONS: [{\"id\": \"1\", \"label\": \"Ok\", \"value\": \"check\", \"type\": \"button\"}]]");
    
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    
    const setTyping = vi.fn();
    const typeText = vi.fn();
    const setTypingContent = vi.fn();

    await result.current.sendMessage(
      "Executar",
      null,
      setTyping,
      typeText,
      setTypingContent
    );

    expect(chatRepository.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        content: "Resposta com ação",
        role: "assistant",
        actions: [{ id: "1", label: "Ok", value: "check", type: "button" }]
      }),
      "user-1"
    );
  });

  it("should manage tasks toggle", async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    (taskRepository.update as any) = vi.fn().mockResolvedValue({});
    
    await result.current.manageTasks.toggle("task-1", "todo", "user-1");
    
    expect(taskRepository.update).toHaveBeenCalledWith("task-1", { status: "done" }, "user-1");
  });

  it("should manage shopping addItem", async () => {
    const { result } = renderHook(() => useAimeeActions(mockUser, mockProfile, mockAimeeData));
    (shoppingRepository.create as any) = vi.fn().mockResolvedValue({});

    await result.current.manageShopping.addItem({ name: "Maçã", quantity: 5 }, "user-1");

    expect(shoppingRepository.create).toHaveBeenCalled();
  });
});
