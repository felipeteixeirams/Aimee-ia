# Matriz de Redundância Documental - Projeto Aimee

Este documento identifica sobreposições, redundâncias e conflitos na base de conhecimento atual, classificando o impacto e propondo ações de mitigação.

## 1. Matriz de Redundância

| Funcionalidade/Conceito | Documentos Envolvidos | Classificação | Impacto |
| :--- | :--- | :--- | :--- |
| **Clean Architecture / BFF** | `analise-consolidada-geral.md`, `DIAGNOSTIC.md`, `AGENTS.md` | **Redundância Saudável** | Baixo (Contexto replicado para bootstrap rápido). |
| **Acessibilidade (ARIA/Labels)** | `UI_UX_SPECIFICATION.md`, `palette.md` | **Redundância Problemática** | Médio (Risco de desatualização de padrões micro-UX). |
| **Pipeline de Inteligência** | `AGENTS.md`, `IMPLEMENTATION_BLUEPRINT.md`, `DIAGNOSTIC.md` | **Redundância Crítica** | Alto (IA pode confundir intenção teórica com implementação real). |
| **Regras de Repositório/Firestore** | `DIAGNOSTIC.md`, `analise-consolidada-geral.md` | **Redundância Problemática** | Médio (Duplicidade na descrição de vulnerabilidades vs padrões). |
| **Roadmap e Progresso** | `IMPLEMENTATION_BLUEPRINT.md`, `DIAGNOSTIC.md` | **Redundância Crítica** | Alto (Conflitos entre tarefas "concluídas" e "vulnerabilidades estruturais"). |

---

## 2. Conflitos Identificados

### 2.1 Conflito de "Fonte da Verdade" (Schemas)
- **Documento A**: `DIAGNOSTIC.md` sugere unificação Zod-to-Types.
- **Documento B**: `VALIDACAO_DOCS_VS_CODE.md` confirma que a fonte real é `src/models/index.ts`.
- **Conflito**: Agentes de IA podem ler diagnósticos antigos e sugerir refatorações que já foram parcialmente executadas ou decididas.

### 2.2 Conflito de Status Técnico
- **DIAGNOSTIC.md**: Aponta vulnerabilidades estruturais graves no `BaseRepository`.
- **IMPLEMENTATION_BLUEPRINT.md**: Lista a refatoração do `BaseRepository` como concluída na Etapa 1.
- **Risco**: Confusão extrema para agentes sobre a confiabilidade do código atual.

---

## 3. Riscos de Confusão

### 3.1 Risco para Agentes IA (Hallucination by Redundancy)
Quando uma funcionalidade (ex: `IntentRouter`) é descrita em múltiplos lugares com níveis de detalhe diferentes (Heurística vs LLM), o agente tende a assumir a versão mais complexa como real, ignorando as limitações do código fonte documentadas em relatórios de drift.

### 3.2 Risco de Múltiplas Fontes de Verdade (Split Brain)
A existência de `AGENTS.md` na raiz e `analise-consolidada-geral.md` em `./docs` cria dois pontos de entrada para "Visão Geral", o que pode levar a um "fan-out" de leitura desnecessário, desperdiçando tokens.

---

## 4. Sugestões de Consolidação e Remoção

### 4.1 Sugestões de Merge
1.  **Merge Arquitetural**: Unificar `analise-consolidada-geral.md` com a Seção A/B de `DIAGNOSTIC.md` no novo `SYSTEM_MASTER.md`.
2.  **Merge de Convenções**: Unificar `palette.md` com as seções de design de `UI_UX_SPECIFICATION.md` no novo `UX_DESIGN_SYSTEM.md`.

### 4.2 Sugestões de Remoção (ou Arquivamento)
- **Sugestão**: Mover `DIAGNOSTIC.md` para `docs/archive/` após o merge, pois seu conteúdo de "vulnerabilidades" é datado e causa conflito com o Blueprint atual.
- **Sugestão**: Remover a descrição detalhada do monorepo de `analise-consolidada-geral.md` e manter apenas no `AGENTS.md`.

---
**Score de Redundância**: 6/10 (Moderadamente redundante).
A consolidação proposta em `PROPOSTA_CONSOLIDACAO_DOCUMENTAL.md` resolverá a maioria desses pontos críticos.
