import { useEffect } from 'react';

/**
 * No app instalado na tela inicial do iPhone (display-mode: standalone), remove
 * `viewport-fit=cover` do meta viewport. Os demais parâmetros são mantidos.
 *
 * Motivo: com `viewport-fit=cover`, o WebKit do app instalado não pinta a faixa
 * da barra inferior (ela aparece branca sob o menu lateral) e a barra de status
 * `black-translucent` cria um efeito de vidro sobre o topo. Não há regra CSS que
 * cubra essa faixa, porque ela é desenhada fora do conteúdo da página.
 * Relatos abertos: https://bugs.webkit.org/show_bug.cgi?id=236445 e
 * https://bugs.webkit.org/show_bug.cgi?id=254868
 *
 * Efeito colateral: sem `cover`, env(safe-area-inset-bottom) vale 0 no app instalado.
 * Por isso o padding inferior usa `--safe-bottom` (src/client/index.css), que tem
 * mínimo de 16px nesse modo.
 *
 * No navegador comum o efeito não roda, então nada muda fora do app instalado.
 * Ver docs/DISTRIBUTION_AND_MOBILE.md (seção de solução de problemas do PWA).
 */
export function StandaloneViewport() {
  useEffect(() => {
    if (!window.matchMedia('(display-mode: standalone)').matches) return;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) return;

    const directives = (meta.getAttribute('content') ?? '')
      .split(',')
      .map((directive) => directive.trim())
      .filter((directive) => directive !== '' && !directive.startsWith('viewport-fit'));

    meta.setAttribute('content', directives.join(', '));
  }, []);

  return null;
}
