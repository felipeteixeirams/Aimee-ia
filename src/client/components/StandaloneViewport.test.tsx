import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { StandaloneViewport } from './StandaloneViewport.js';

const VIEWPORT_WITH_COVER =
  'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

function mockDisplayMode(standalone: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: standalone && query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function setViewportMeta(content: string): HTMLMetaElement {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.content = content;
  return meta;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.querySelector('meta[name="viewport"]')?.remove();
});

describe('StandaloneViewport', () => {
  it('remove viewport-fit=cover no app instalado e mantém os demais parâmetros', () => {
    mockDisplayMode(true);
    const meta = setViewportMeta(VIEWPORT_WITH_COVER);

    render(<StandaloneViewport />);

    expect(meta.getAttribute('content')).toBe(
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    );
  });

  it('não altera o viewport no navegador comum', () => {
    mockDisplayMode(false);
    const meta = setViewportMeta(VIEWPORT_WITH_COVER);

    render(<StandaloneViewport />);

    expect(meta.getAttribute('content')).toBe(VIEWPORT_WITH_COVER);
  });

  it('não falha quando a página não tem meta viewport', () => {
    mockDisplayMode(true);

    expect(() => render(<StandaloneViewport />)).not.toThrow();
  });
});
