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

### 🎙️ Entregável B: Chat Multimodal & Voice (Etapa 2)
*Objetivo: Expandir a interação para além do texto.*
- [ ] **Tarefa B.1 (6h)**: Implementar interface de gravação (`MediaRecorder`) e integração com Gemini para "Audio Understanding".
- [ ] **Tarefa B.2 (4h)**: Atualizar o ChatView com suporte a áudio visualizer e transcrição em tempo real.

### 📅 Entregável C: Sincronização Google Agenda (Etapa 3)
*Objetivo: Conectar o calendário familiar ao mundo externo.*
- [ ] **Tarefa C.1 (6h)**: Implementar fluxo OAuth para permissões `calendar.events` (Escrita).
- [ ] **Tarefa C.2 (8h)**: Criar worker de sincronização bidirecional (Firestore Events <-> Google Calendar).

### 🛒 Entregável D: Compras Inteligentes & Geo (Etapa 4)
*Objetivo: Transformar a lista de compras em um assistente de mercado.*
- [ ] **Tarefa D.1 (6h)**: Criar interface mobile-first de "Modo Compra" (registro de preço e check rápido).
- [ ] **Tarefa D.2 (6h)**: Implementar captura de geolocalização e persistência de coordenadas por item de compra.
- [ ] **Tarefa D.3 (4h)**: Lógica de atualização automática de estoque ao finalizar "Modo Compra".

### 💡 Entregável E: Sistema de Insights & Feedback (Etapa 5 e 7)
*Objetivo: IA proativa que aprende com o usuário.*
- [ ] **Tarefa E.1 (8h)**: Implementar agente de `FinancialInsights` cruzando dados de gastos com metas.
- [ ] **Tarefa E.2 (6h)**: Sistema de Feedback (estrelas/correção) no chat e ajuste dinâmico da `systemInstruction` baseado no histórico.

---

## 🚀 Log de Progresso Detalhado

- **2026-05-02**: Estruturação do Backlog de 8h e alinhamento com Etapas 1-7.
- **2026-05-01**: Refatoração para Clean Architecture (Orchestrator, Tools, Domain Entities).
- **2026-04-30**: Motor de Recorrência (Diário/Semanal/Mensal) e Lógica de Ajuste de calendário automática.

---

## 🎯 Atividade Iniciada agora
**Entregável A - Tarefa A.1**: Refatoração do `aiService.ts` e criação da infraestrutura de Repositórios para limpar o código do frontend de chamadas diretas ao `addDoc`/`updateDoc`.

