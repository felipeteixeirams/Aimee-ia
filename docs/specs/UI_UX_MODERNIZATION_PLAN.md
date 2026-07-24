# Especificação de Modernização UI/UX (Premium "State of the Art")

## 1. Objetivo Geral
Elevar a interface e a experiência do usuário do aplicativo (PWA) a um padrão de excelência de mercado, aplicando princípios de design Premium, Context-Driven Engineering e "Anti-Slop". Inspirado nas melhores práticas de agências de UX globais e produtos de ponta (como Linear, Vercel, Airbnb e Apple). O foco é obter responsividade mobile-first, micro-interações fluidas, consistência matemática de tipografia/espaçamento e acessibilidade de alto nível, sem introduzir regressões de software ou alterar a lógica de negócio subjacente.

## 2. Escopo (O que será feito)
*   **Sistema de Cores (Sofisticação & Contraste):** Implementação de tons neutros com ajuste fino (evitando pretos puros `#000` ou brancos puros `#FFF`). Controle rigoroso do limite de diferença de brilho entre backgrounds e containers (≤12% no dark mode, ≤7% no light mode).
*   **Tipografia & Escala Matemática:** Aplicação de uma escala tipográfica estrita (ex: Major Second 1.125 para app density) combinando fontes de alta legibilidade. Limitação de largura de linha para leitura (65-75 `ch`).
*   **Espaçamento e Layout "Flatten Depth":** Uso rigoroso de matemática para composição visual (`Inner Radius = Outer Radius - Padding`). Remoção de aninhamentos desnecessários (cards dentro de cards) substituídos pelo uso estratégico de espaço em branco (whitespace) e divisores sutis.
*   **Componentes Core & Navegação:**
    *   Touch targets (alvos de toque) mínimos de 44px para mobile.
    *   Labels em botões/pills obrigatoriamente restritas a uma única linha (sem truncation indesejado).
    *   Responsividade fluida utilizando patterns do Tailwind (`w-full max-w-7xl mx-auto`) para telas ultrawide.
*   **Micro-interações e Transições:**
    *   Animações de entrada refinadas (Fade-in sutil, offset no eixo Y utilizando framer-motion/tailwind).
    *   Feedback tátil dinâmico (hover em desktop, active scale de `0.98` em mobile).
*   **Estados de Carregamento (Loading):** Utilização de *Skeleton Screens* bem estruturados e adaptativos em vez de simples spinners isolados.

## 3. Fora do Escopo (O que NÃO será feito)
*   Nenhuma alteração na lógica de negócios ou entidades (`src/domain/`).
*   Modificação da estrutura do banco de dados (Firestore) ou da orquestração de LLMs (`AimeeOrchestrator.ts`).
*   Criação de novas features ou fluxos operacionais inteiramente novos.
*   **Proibido uso de "AI Slop":** Gradientes genéricos (purple-to-blue), glassmorphism não justificado, textos cyan brilhantes em dark mode ou "hero eyebrows" (labels minúsculas sobre headings).

## 4. Arquitetura e Módulos Impactados
*   **Design Tokens Globais:** `src/client/index.css` (Para CSS Variables e configuração do Tailwind).
*   **Utilitários de UI:** `src/lib/utils.ts` (Implementação sólida de `cn()` usando `clsx` e `tailwind-merge` para overrides seguros).
*   **Componentes de UI Base:** `src/client/components/` (Modificação estrutural em botões, modais, headers, menus bottom).
*   **Views (Páginas):** `src/client/pages/` (Refatoração de layouts complexos como `FinanceView.tsx`, `ChatView.tsx`, `RoutinesView.tsx`, `SettingsView.tsx`).

## 5. Contratos
*   **Sem quebras de API:** O tráfego de dados e os hooks consumidos pela UI (ex: `useAimeeData`, `useAimeeActions`) permanecem inalterados.
*   **Padronização de Props:** Os componentes visuais passarão a usar tipos restritos e variantes fixas (ex: via `class-variance-authority` ou tipagem explícita `variant: 'primary' | 'secondary' | 'ghost'`) reduzindo propriedades soltas.

## 6. Fluxo de Implementação (Fases Recomendadas para Agentes)

**Fase 1: Fundação Visual e Dependências (Design Tokens)**
*   Garantir presença/instalação de dependências estritamente necessárias (Tailwind, `clsx`, `tailwind-merge`, `lucide-react`, `motion/react`).
*   Configurar a base em `index.css` estabelecendo paleta neutra e controle de safe-areas (`env(safe-area-inset-bottom)`) para PWA.

**Fase 2: Refatoração Primitiva (Core Components)**
*   Remodelar botões, links, e cards primários.
*   Garantir a matemática de raio/bordas (`border-radius`) e espaçamentos internos (padding).

**Fase 3: Layouts Mestres e Navegação (Header/Bottom Menu)**
*   Garantir adaptatividade responsiva do container mestre (`App.tsx` / `main.tsx`).
*   Atualizar menus para touch base e comportamentos de navegação polidos.

**Fase 4: Modernização das Views Módulo a Módulo**
*   Refatorar uma view de cada vez (`FinanceView`, depois `RoutinesView`, etc).
*   Substituir gráficos básicos por renderizações polidas (usando `recharts` ou equivalente já mapeado), e eliminar aninhamentos (flattening UI).

## 7. Corner Cases (Casos Extremos de UI)
*   **Acessibilidade / Motion:** Respeitar o `prefers-reduced-motion` para usuários sensíveis à animação.
*   **Teclado Virtual PWA (Mobile):** Garantir que inputs em telas (ex: Chat, Settings) nunca fiquem escondidos sob o teclado virtual em iOS e Android.
*   **Monitores Ultrawide:** As telas não devem sofrer estiramento infinito; utilizar o pattern de stage centralizado.

## 8. Critérios de Aceite
*   [x] Contrastes visuais passam no teste WCAG AA (mínimo de 4.5:1 para body text).
*   [x] Todos os elementos clicáveis no modo mobile têm no mínimo 44x44px.
*   [x] Não há cards encapsulando outros cards desnecessariamente (UI Flattened).
*   [x] Telas carregam com esqueletos de loading (Skeletons) onde aplicável (dados Firebase/AI).
*   [x] Nenhuma regra de negócio (backend, AI, Firestore) foi degradada.
*   [x] Todos os 57 testes automatizados de integração/unidade passam com 100% de sucesso.
*   [x] Build orquestrado e linter de código executam 100% sem falhas.
