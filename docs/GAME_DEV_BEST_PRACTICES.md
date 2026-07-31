# Game Development & Deployment Best Practices
## (Aimee Engine Adaptation)

Este documento consolida as melhores práticas de engenharia, arquitetura e design adotadas no projeto Aimee, adaptadas para o desenvolvimento de jogos modernos com deploy na Vercel.

---

## 1. Arquitetura Modular (The Aimee Pattern)

Para jogos, a separação de responsabilidades é vital para evitar o "God Object" (um único arquivo controlando tudo).

### 🏗️ Estrutura de Domínio
- **Domain (Core):** Contém apenas a lógica pura do jogo (cálculo de dano, regras de colisão, sistemas de pontuação). Não deve depender de bibliotecas de renderização.
- **Infrastructure:** Onde vive a integração com APIs externas (Firestore para Leaderboards) e o motor de renderização (Canvas, React Three Fiber, etc).
- **Presentation (UI):** HUDs, menus e overlays usando Tailwind CSS, mantendo-os descolados da lógica de física.

### 🧠 Gerenciamento de Estado
- Use um **Single Source of Truth** para o estado do jogo (ex: Zustand ou Redux).
- **Imutabilidade:** Essencial para sistemas de "Undo" ou "Replay".
- **Separação de Frequência:** Diferencie o estado que muda a 60fps (posição de personagens) do estado de UI que muda esporadicamente (inventário, pontuação).

---

## 2. Spec-Driven Development (Discovery & Specs)

Antes de codar uma mecânica nova (ex: um sistema de OCR ou um boss), siga o fluxo que usamos na Aimee:

1. **Spec Phase:** Documente em `/docs/specs/` a mecânica.
   - **Objetivo:** O que o jogador sente/faz?
   - **Contratos:** Quais dados entram e saem da mecânica?
   - **Edge Cases:** O que acontece se o jogador pausar no meio da animação?
2. **Contract-First:** Defina as Interfaces TypeScript antes da implementação. Isso garante que a UI e o Motor de Jogo falem a mesma língua.

---

## 3. UI/UX & Visual Performance

Seguindo nossos princípios de "Anti-Slop" e refinamento visual:

- **Feedback Imediato (Juice):** Cada ação do jogador deve ter um feedback visual (partículas, trepidação de tela) ou auditivo.
- **Typographic Hierarchy:** Use escalas matemáticas (Major Second) para HUDs para garantir legibilidade durante a ação.
- **Loading States:** Nunca deixe a tela preta. Use skeletons ou artes conceituais durante o carregamento de assets pesados.
- **Motion:** Use `motion/react` para transições de menus, mas evite-o dentro do loop de física para não degradar a performance.

---

## 4. Deploy na Vercel & Performance

### ⚡ Otimização de Assets
- **Imagens:** Use formatos modernos como WebP ou AVIF.
- **Lazy Loading:** Carregue níveis ou assets pesados apenas quando necessário usando `React.lazy` ou importações dinâmicas.
- **Edge Functions:** Use Vercel Edge Functions para validações rápidas (ex: checar se um save game é válido) com baixa latência.

### 🔐 Segurança & Invariantes
- **Variáveis de Ambiente:** Nunca exponha chaves de administração no cliente. Use o prefixo `VITE_` apenas para o estritamente necessário.
- **Sanitização:** Assim como no plano de sanitização da Aimee, garanta que inputs do jogador (nomes, chats) sejam limpos para evitar XSS em leaderboards públicos.

---

## 5. Checklist de Lançamento (Vercel)

- [ ] **Build Check:** Execute `npm run build` localmente para garantir que o TypeScript não quebre em produção.
- [ ] **Environment Alignment:** Configure todas as chaves (Firebase, Analytics) no painel da Vercel.
- [ ] **Preview Deployments:** Use as URLs de preview da Vercel para testar mecânicas em dispositivos móveis antes do merge na `main`.
- [ ] **CORS/Headers:** Configure o `vercel.json` para permitir cross-origin se seu jogo consumir assets de outros domínios.

---
*Este documento é um guia vivo. Sempre que uma nova lição for aprendida no desenvolvimento do jogo, ela deve ser retroalimentada aqui.*
