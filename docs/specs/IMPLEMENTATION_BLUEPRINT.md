# 🏛️ Aimee: Blueprint de Implementação e Progresso

Este documento serve como a "Fonte da Verdade" para o roteiro técnico e funcional da Aimee. Organizamos o progresso em etapas modulares alinhadas à nossa **Clean Architecture**.

---

## ✅ Etapa 1: Fundamentos (Concluído)
- **1.1 Configurar LLM**: Gemini integrado via `AimeeOrchestrator` e `server.ts`.
- **1.2 Refatoração Inicial**: Estrutura de pastas `domain`, `infrastructure`, `tools` criada.
- **1.3 Autenticação**: Login Google via Firebase operando.
- **1.4 Regras Firestore**: Segurança para espaços familiares e multiusuário configurada.

---

## 🏗️ Backlog de Desenvolvimento (Próximas Etapas)

### 📦 Entregável A: Refatoração Arquitetural Profunda (Etapa 1 - Extensão)
*Objetivo: Migrar lógica dispersa para o padrão Repository e Domain Services.*
- [x] **Tarefa A.1 (4h)**: Criar `BaseRepository` genérico e repositórios específicos (`TaskRepository`, `TransactionRepository`). 
  - *Critério: Remover todos os `addDoc` e `updateDoc` do front-end e do `aiService.ts`.*
- [x] **Tarefa A.2 (4h)**: Implementar Camada de `Skills` (Orquestradores de lógica).
  - *Critério: Aimee deve conseguir executar sequências (ex: adicionar gasto -> atualizar meta) em uma única "Skill".*
- [x] **Tarefa A.3 (4h)**: Centralizar validações de negócio em `domain/services`.
  - *Critério: Impedir gastos negativos ou tarefas sem título antes de chegar ao Firestore.*
- [x] **Tarefa A.4 (2h)**: Configurar Observabilidade e Structured Logging.
  - *Critério: Logs estruturados (JSON) compatíveis com Cloud Logging e captura de erros globais.*

### 🎙️ Entregável B: Chat Multimodal & Voice (Etapa 2)
*Objetivo: Expandir a interação para além do texto.*
- [x] **Tarefa B.1 (6h)**: Implementar interface de gravação (`MediaRecorder`) e integração com Gemini para "Audio Understanding".
- [x] **Tarefa B.2 (4h)**: Atualizar o ChatView com suporte a áudio visualizer e transcrição em tempo real.

### 📅 Entregável C: Sincronização Google Agenda (Etapa 3)
*Objetivo: Conectar o calendário familiar ao mundo externo.*
- [x] **Tarefa C.1 (6h)**: Implementar fluxo OAuth para permissões `calendar.events` (Escrita).
- [x] **Tarefa C.2 (8h)**: Criar worker de sincronização bidirecional (Firestore Events <-> Google Calendar).

### 🛒 Entregável D: Compras Inteligentes & Geo (Etapa 4)
*Objetivo: Transformar a lista de compras em um assistente de mercado.*
- [x] **Tarefa D.1 (4h)**: Integrar Google Maps API para geolocalização e sugestões de mercado mais próximo.
- [x] **Tarefa D.2 (6h)**: Criar interface mobile-first de "Modo Compra" (registro de preço e check rápido).
- [x] **Tarefa D.3 (6h)**: Implementar captura de geolocalização e persistência de coordenadas por item de compra.
- [x] **Tarefa D.4 (4h)**: Lógica de atualização automática de estoque ao finalizar "Modo Compra".

### 🧪 Entregável F: Qualidade e Cobertura de Testes (Etapa 6)
*Objetivo: Garantir estabilidade e atingir 80% de cobertura de branches (Caminhos de Decisão).*
*Métricas Atuais (2026-05-02):*
- **Linhas**: 82.24%
- **Branches**: 84.80%
- **Funções**: 81.25%
- **Statements**: 81.60%
- **Core Logic Coverage**: >80% (Domínio, Infra, Lib)

- [x] **Tarefa F.1 (2h)**: Configurar infraestrutura de testes (`vitest`, `jsdom`) e filtros de cobertura (ignorar config/deps).
- [x] **Tarefa F.2 (8h)**: Implementar Testes Unitários para Regras de Negócio (`domain/services`) com foco em branches lógicas.
- [x] **Tarefa F.3 (6h)**: Implementar Testes de Integração para Repositórios e Orquestradores.
- [x] **Tarefa F.4 (4h)**: Automatizar geração de relatório de cobertura e garantir threshold de 80% em branches.

### 🛡️ Entregável G: Resiliência e Recuperação de Falhas (Concluido)
*Objetivo: Garantir que a Aimee opere de forma ininterrupta e recupere-se de erros de API/Rede de forma graciosa.*
- [x] **Tarefa G.1 (4h)**: Centralizar Configurações e Validar Variáveis de Ambiente no boot (Server/Client).
- [x] **Tarefa G.2 (4h)**: Auditar e Padronizar Tratamento de Erros em todas as integrações externas (Firebase, Gemini, Google Maps).
- [x] **Tarefa G.3 (4h)**: Implementar Circuit Breaker ou mecanismos de Retry exponencial para falhas de rede em APIs críticas.
- [x] **Tarefa G.4 (2h)**: Padronizar logs de erro para diagnóstico via sistema AI (JSON Error Pattern).

### 💎 Entregável H: Refino UI/UX Premium & Estética AI Player (Concluido)
*Objetivo: Elevar o visual da Aimee para o nível das principais IAs do mercado (ChatGPT, Gemini, Copilot).*
- [x] **Tarefa H.1 (6h)**: Refatoração Visual Mobile-First: Garantir que 100% dos componentes sejam adaptativos e táteis.
- [x] **Tarefa H.2 (4h)**: Tipografia e Iconografia: Migrar para fontes de alta legibilidade (Inter/Outfit) e set de ícones consistentes (Lucide).
- [x] **Tarefa H.3 (6h)**: Micro-animações e Feedback: Adicionar transições fluidas no chat, estados de "typing" sofisticados e toasts não intrusivos.
- [x] **Tarefa H.4 (4h)**: Design de Componentes Avançados: Cards de insight, visualizadores de orçamento e listas de tarefas inspirados em apps de produtividade premium.

### 🔐 Entregável I: Autenticação Híbrida e Recuperação (Etapa 9) ✅
*Objetivo: Tornar e-mail/senha o método principal de acesso, mantendo Google como opcional e protegendo integrações específicas.*
- [x] **Tarefa I.1 (4h)**: Reformular Interface de Login: Criar modal com abas "Login" e "Registro" com design premium e mobile-first.
- [x] **Tarefa I.2 (4h)**: Fluxo de Registro Simplificado: Implementar validação inicial de e-mail e redirecionamento para formulário de cadastro completo.
- [x] **Tarefa I.3 (2h)**: Recuperação de Senha: Implementar funcionalidade "Esqueci minha senha" com envio de link via Firebase Auth.
- [x] **Tarefa I.4 (4h)**: Lógica de Integração Condicional: Restringir sincronização de Google Calendar apenas para e-mails Google (@gmail ou Workspace).

### 🚀 Entregável J: Modernização da Experiência de Login (Etapa 10)
*Objetivo: Criar uma interface ultra-minimalista e mobile-first baseada em padrões de Elite (ChatGPT/Copilot).*
- [x] **Tarefa J.1 (4h)**: Hero Animation Engine: Implementar sistema de digitação letra-a-letra com cursor, frases cíclicas e vibração haptica.
- [x] **Tarefa J.2 (4h)**: Layout Stacked Bottom: Reposicionar todos os controles para a base da tela, otimizando o alcance dos polegares.
- [x] **Tarefa J.3 (2h)**: Fluxo de Descoberta Progressiva: Input único de e-mail que alterna dinamicamente entre login e registro baseado na existência do usuário.
- [x] **Tarefa J.4 (2h)**: Sistema de Memória Local: Implementar "Lembrar de mim" e exibição do último perfil acessado.

### 🧠 Entregável K: Arquitetura Aimee 2.0 (Inteligência Determinística)
*Objetivo: Migrar de um modelo de "Prompt Livre" para um fluxo de "Pipeline de Inteligência" modular e confiável.*
- [x] **Tarefa K.1 (4h)**: Implementar **Intent Router** (Classificador de Intenção).
  - *Status: Criado `src/ai/IntentRouter.ts` com heurísticas iniciais e suporte para roteamento modular.*
- [x] **Tarefa K.2 (6h)**: Refatorar **Skills Especializadas** para lógica determinística.
  - *Status: Finalizado. Adicionados métodos analíticos (Savings Rate, Stock Report, Routine Health) permitindo que o `InsightEngine` forneça fatos brutos.*
- [x] **Tarefa K.3 (6h)**: Desenvolver o **Insight Engine** e **Confidence Layer**.
  - *Status: Criado `src/ai/InsightEngine.ts` com suporte a níveis de confiança (confirmed, inferred) baseados em dados reais.*
- [x] **Tarefa K.4 (4h)**: Otimização de Tokens e Concisão.
  - *Status: Regras de Ouro implementadas no `aiService.ts` (máximo 2 frases, proibição de estimativas fictícias).*

### 🧹 Entregável L: Harmonização Arquitetural e Limpeza
*Objetivo: Uniformizar o código, eliminar redundâncias e garantir que todos os adaptadores sigam os mesmos padrões.*
- [x] **Tarefa L.1 (4h)**: Padronização de Adapters LLM.
  - *Status: Unificado `getAimeeSystemInstruction` em `AimeePrompts.ts`. Gemini, OpenAI e DeepSeek agora usam o mesmo "DNA" de prompt.*
- [x] **Tarefa L.2 (4h)**: Consolidação de Orquestradores.
  - *Status: Renomeado `orchestrator` para `aimeeClientOrchestrator` (frontend). Backend segue usando `AimeeOrchestrator` (singleton).*
- [x] **Tarefa L.3 (2h)**: Reorganização de Pastas.
  - *Status: Criado `src/domain/intelligence`. Movidos `IntentRouter` e `InsightEngine` para lá.*
- [x] **Tarefa L.4 (2h)**: Auditoria de Adapters.
  - *Status: Criado `DeepSeekAdapter.ts` explícito. Removidos prompts legados do adapter OpenAI.*

### 📍 Entregável M: Serviços de Localização e Robustez
*Objetivo: Garantir que funcionalidades baseadas em localização funcionem corretamente e com feedback claro.*
- [x] **Tarefa M.1 (2h)**: Correção do erro 500 no Proxy de Localização.
  - *Status: Melhorado o tratamento de erros em `routes.ts` e `locationService.ts`. Agora retorna 403/400 com mensagens claras em vez de 500 genérico.*
- [x] **Tarefa M.2 (2h)**: Resiliência de Interface e Log Centralizado.
  - *Status: Implementado endpoint `/api/logs` para captura de erros do frontend. Adicionado `safeFormatDate` e hardening de hooks UI contra dados malformados.*

---

## 🚀 Log de Progresso Detalhado

- **2026-05-12**: **Refatoração Arquitetural Concluída**: Removidas chamadas diretas ao Firestore em `App.tsx`, movendo toda a persistência para a camada de Repositórios e Skills através do hook `useAimeeActions`. Expansão do `InsightEngine` com insights determinísticos de produtividade e categorização financeira. Build verificado e estável.

- **2026-05-09**: **Robustez Frontend & Observabilidade**: Implementado sistema de log centralizado (Client -> Server). Hardening de componentes React contra erros de parsing de data e campos nulos. Corrigido erro 500 no serviço de localização (nearby markets).

- **2026-05-09**: **Arquitetura Aimee 2.0 Concluída**: `IntentRouter`, `InsightEngine` e `Skills` analíticas integrados. Otimização radical de tokens e fim das alucinações de dados via pipeline determinístico. Harmonização de adapters (Gemini, DeepSeek, OpenAI) via `AimeePrompts`.
- **2026-05-09**: Implementadas as fundações da **Arquitetura Aimee 2.0**: `IntentRouter`, `InsightEngine` e refatoração do `aiService` para concisão extrema (máximo 2 frases) e fidelidade aos dados (fim das alucinações de custos/estoque).
- **2026-05-09**: Início da definição da **Arquitetura Aimee 2.0**. Objetivo: Reduzir alucinações, custos de tokens e aumentar a previsibilidade através de lógica determinística fora do prompt.
- **2026-05-04**: Início da Etapa 10. Design de transição para interface "Elite" inspirada em ChatGPT/Copilot, com foco em animações hapticas e layout mobile-first.
- **2026-05-03**: Finalização da Etapa 9. Implementação de Autenticação Híbrida (E-mail/Senha + Google), fluxo de registro em 2 etapas, recuperação de senha e restrições de domínio para Google Calendar.
- **2026-05-02**: Finalização da Etapa 8 (Premium UI/UX). Aimee agora possui uma estética moderna inspirada nos principais players de IA, com navegação flutuante, fontes premium (Outfit) e micro-interações fluidas.
- **2026-05-02**: Finalização da Etapa 7 (Resiliência). Implementação de Retry com backoff exponencial, Global Error Boundary e validação rigorosa de variáveis de ambiente no boot.
- **2026-05-02**: Início da Etapa 7. Centralização de configurações em `src/lib/config.ts` e padronização de erros no `FirestoreUtils` (Tarefa G.1/G.4).
- **2026-05-02**: Ajuste no build e deploy para suportar servidor Express compilado no `dist/server.js`.
- **2026-05-02**: Finalização da Etapa 6 (Qualidade). Cobertura de branches atingiu **84.8%** no Core da aplicação.
- **2026-05-02**: Implementação da Tarefa F.3: Testes de integração para `BaseRepository` (CRUD) e `AimeeOrchestrator` (LLM Integration Mocked).
- **2026-05-02**: Implementação da Tarefa F.2: Cobertura de 100% para `ValidationService` e >90% para as Skills de domínio (Finance, Shopping, Routine).
- **2026-05-02**: Configuração da infraestrutura de testes e refinamento do ignore list em `vite.config.ts` (Tarefa F.1).

- **2026-05-02**: Implementação das Tarefas D.3 e D.4: Captura de geolocalização por item no checkout e atualização automática de estoque em batch.
- **2026-05-02**: Implementação da Tarefa D.2: Interface de "Modo Compra" com registro tátil de preços e somatório de carrinho em tempo real.
- **2026-05-02**: Implementação da Tarefa D.1: Integração com Google Maps/Places API para sugestão de mercados próximos via geolocalização.
- **2026-05-02**: Implementação da Tarefa C.2: Sincronização bidirecional completa entre Firestore e Google Calendar via backend API.
- **2026-05-02**: Implementação da Tarefa C.1: Configuração do OAuth Flow para Google Calendar e armazenamento seguro de tokens no subcoleção privada.
- **2026-05-02**: Implementação da Tarefa B.2: Adicionado Audio Visualizer em tempo real e melhorias na UI de gravação no ChatView.
- **2026-05-02**: Implementação da Tarefa B.1: Interface de voz nativa e compreensão multimodal de áudio via Gemini 2.0.
- **2026-05-02**: Migração das chamadas de LLM para o servidor via `/api/ai` e limpeza do `aiService.ts`. Sincronização de ferramentas (tools) entre cliente e servidor.
- **2026-05-02**: Estruturação do Backlog de 8h e alinhamento com Etapas 1-7.
- **2026-05-01**: Refatoração para Clean Architecture (Orchestrator, Tools, Domain Entities).
- **2026-04-30**: Motor de Recorrência (Diário/Semanal/Mensal) e Lógica de Ajuste de calendário automática.

---

## 🎯 Atividade Iniciada agora
**Arquitetura Aimee 2.0**: Refatoração do `aiService.ts` e `AimeeOrchestrator` para o modelo de Inteligência Determinística e Modular.

