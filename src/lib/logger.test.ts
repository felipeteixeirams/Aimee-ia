import { describe, it, expect, vi } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  it('should call console.log on info()', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('Test info', { foo: 'bar' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should call console.log on warn()', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.warn('Test warn');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should call console.log on error()', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.error('Test error', { err: 'msg' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
