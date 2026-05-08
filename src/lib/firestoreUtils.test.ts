import { describe, it, expect, vi } from 'vitest';
import { getFriendlyErrorMessage, handleFirestoreError, OperationType } from './firestoreUtils.js';
import { logger } from './logger.js';

vi.mock('./firebase.js', () => ({
  auth: {
    currentUser: {
      uid: 'user-123',
      email: 'test@aimee.ai',
      emailVerified: true,
      isAnonymous: false,
      providerData: [
        { providerId: 'google.com', displayName: 'Test User', email: 'test@aimee.ai', photoURL: 'http://image' }
      ]
    }
  }
}));

vi.mock('./logger.js', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('firestoreUtils', () => {
  describe('getFriendlyErrorMessage', () => {
    it('should return specific messages for known codes', () => {
      expect(getFriendlyErrorMessage({ code: 'permission-denied' })).toContain('permissão');
      expect(getFriendlyErrorMessage({ code: 'unauthenticated' })).toContain('expirou');
      expect(getFriendlyErrorMessage({ code: 'resource-exhausted' })).toContain('Limite');
      expect(getFriendlyErrorMessage({ code: 'unavailable' })).toContain('indisponível');
      expect(getFriendlyErrorMessage({ code: 'not-found' })).toContain('não foi encontrado');
    });

    it('should handle offline messages', () => {
      expect(getFriendlyErrorMessage({ message: 'The client is offline' })).toContain('offline');
    });

    it('should handle quota messages', () => {
      expect(getFriendlyErrorMessage({ message: 'Quota exceeded' })).toContain('quota');
    });

    it('should return default message for unknown errors', () => {
      expect(getFriendlyErrorMessage({})).toContain('inesperado');
    });
  });

  describe('handleFirestoreError', () => {
    it('should log warning and not throw if offline', () => {
      const error = new Error('Client is offline');
      const result = handleFirestoreError(error, OperationType.GET, 'path');
      
      expect(result).toBeUndefined();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should log error and throw JSON error otherwise', () => {
      const error = { code: 'permission-denied', message: 'Denied' };
      
      try {
        handleFirestoreError(error, OperationType.WRITE, 'users/1');
      } catch (err: any) {
        const parsed = JSON.parse(err.message);
        expect(parsed.code).toBe('permission-denied');
        expect(parsed.operationType).toBe('write');
        expect(parsed.path).toBe('users/1');
      }
      
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
