# 📋 Plano de Alinhamento e Saneamento de Drifts Documentais (Aimee)

**Autor:** AI Coding Agent / Arquiteto de Software Sênior  
**Status:** ✅ Aprovado, Executado e Validado  
**Data:** 31 de Maio de 2026  
**Revisão:** v1.0.0  

---

## 🔍 1. Mapeamento de Drifts (Código vs. Documentação)

Durante a varredura estrutural profunda, identificamos as seguintes discrepâncias em que o código real superou ou divergiu da documentação contida em `MASTER_ARCHITECTURE.md` e `MASTER_DOMAINS_AND_CONTRACTS.md`:

### A. Repositórios Órfãos na Documentação
Os seguintes arquivos existem fisicamente em `/src/infrastructure/repositories` mas não estão listados na tabela de controle de repositórios do `MASTER_ARCHITECTURE.md`:
1.  **`ChatRepository.ts`**: Mantém as sessões, mensagens e o histórico do chat em tempo de execução.
2.  **`ConfigRepository.ts`**: Governa as configurações globais de espaço e preferências de domicílio.
3.  **`EventRepository.ts`**: Repositório complementar para eventos locais agregados de calendário.
4.  **`EventMonitorConfigRepository.ts`**: Controla as configurações de disparo de varredura do robô minerador de eventos brasileiros.

### B. O Ecossistema de AI Tools Sem Registro
*   **Arquivo:** `/src/server/tools/AimeeTools.ts`
*   **Problema:** O backend implementa um conjunto robusto de ferramentas que a IA pode invocar por meio de Function Calling (chamadas de função estruturada). No entanto, não há seção nos manuais mestres descrevendo quais ferramentas estão disponíveis para os agentes de IA, seu ciclo de vida ou tratamento de parâmetros.

### C. Abstração de Entidades
*   **Arquivo:** `/src/domain/entities/BaseEntity.ts`
*   **Problema:** A camada estrutural do domínio conta com herança de entidades base que ditam as propriedades universais dos modelos de dados (createdAt, updatedAt, id). Esta engrenagem abstrata de design não está detalhada em `MASTER_DOMAINS_AND_CONTRACTS.md`.

---

## 🛠️ 2. Passos do Plano de Alinhamento (Não-Invasivos)

Diferente do saneamento anterior que tratou de redundâncias, estes passos visam **enriquecer os documentos mestres** para que reflitam estritamente a verdade técnica do monorepo, com **zero alteração de código fonte operacional** (garantindo 100% de integridade funcional).

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│  Etapa 1: Atualizar Repositórios     ├────►│  Etapa 2: Registrar AI Tools         ├────►│  Etapa 3: Integrar Entidades Base    │
│  Mapear repositórios residuais       │     │  Adicionar seção de Function Calling │     │  Explicar BaseEntity e fluxo Zod     │
│  na tabela do MASTER_ARCHITECTURE.md │     │  nos manuais de arquitetura/domínio  │     │  em MASTER_DOMAINS_AND_CONTRACTS.md  │
└──────────────────────────────────────┘     └──────────────────────────────────────┘     └──────────────────────────────────────┘
```

### 🛰️ Etapa 1: Registro de Repositórios na Arquitetura Mestre
*   **Objetivo:** Adicionar os 4 repositórios órfãos no mapeamento de persistência de `MASTER_ARCHITECTURE.md`.
*   **Impacto de Alteração:** Apenas edição de documentação estática.

### 🧠 Etapa 2: Documentar AI Tools e Barramento de Funções
*   **Objetivo:** Adicionar uma seção em `MASTER_ARCHITECTURE.md` (ou `MASTER_DOMAINS_AND_CONTRACTS.md`) detalhando `/src/server/tools/AimeeTools.ts`.
*   **Tópicos a Abordar:**
    *   Como a IA descobre as funções nativas.
    *   Tabela de funções disponíveis (ex: criar tarefa, registrar transação, buscar mercados próximos).
    *   O papel do `AimeeOrchestrator` em interceptar a intent e acionar o barramento de ferramentas.

### 📐 Etapa 3: Integração das Entidades de Domínio e BaseEntity
*   **Objetivo:** Enriquecer a modelagem de domínio em `MASTER_DOMAINS_AND_CONTRACTS.md` detalhando as propriedades abstratas herdadas de `BaseEntity`.

---

## ⚠️ 3. Garantias Anti-Regressão

*   **Isolamento Estrito:** Nenhuma linha de lógica operacional (`.ts`, `.tsx`) em `/src` será editada neste alinhamento.
*   **Validação Automatizada:** Após cada ajuste documental, serão executados o compilador (`npm run build`) e o linter (`npm run lint`) do monorepo para garantir consistência estrutural contínua.

---

> **Aprovação do Usuário:** Responda com *"Aprovado"* para autorizar a incorporação destas melhorias técnico-documentais de forma segura e imediata nos documentos mestres correspondentes.
