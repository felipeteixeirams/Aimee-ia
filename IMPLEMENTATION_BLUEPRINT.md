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
*Objetivo: Garantir estabilidade e atingir 80% de cobertura de código.*
- [x] **Tarefa F.1 (2h)**: Configurar infraestrutura de testes (`vitest`, `jsdom`) e filtros de cobertura (ignorar config/deps).
- [ ] **Tarefa F.2 (8h)**: Implementar Testes Unitários para Regras de Negócio (`domain/services`).
- [ ] **Tarefa F.3 (6h)**: Implementar Testes de Integração para Repositórios e Orquestradores.
- [ ] **Tarefa F.4 (4h)**: Automatizar geração de relatório de cobertura e garantir threshold de 80%.

---

## 🚀 Log de Progresso Detalhado

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
**Entregável A - Tarefa A.1**: Refatoração do `aiService.ts` e criação da infraestrutura de Repositórios para limpar o código do frontend de chamadas diretas ao `addDoc`/`updateDoc`.

