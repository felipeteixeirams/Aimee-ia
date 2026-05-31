# 🏛️ Plano de Saneamento Abrangente e Alinhamento Técnico (Aimee V2)

**Autor:** AI Coding Agent / Arquiteto de Software Sênior  
**Status:** 🏆 Plano 100% Concluído, Homologado e em Conformidade Estrita  
**Data:** 31 de Maio de 2026  
**Revisão:** v1.0.0  

---

## 📋 1. Visão Geral e Objetivos do Plano

Este **Plano de Alinhamento e Saneamento Abrangente** foi desenhado para resolver as complexidades e redundâncias acumuladas entre o código-fonte operacional e a base documental técnica (especialmente os arquivos de contexto arquitetural localizados em `/docs` e `/docs/legacy`). 

O objetivo principal é elevar o **Score de Aderência Documental para 100%** e assegurar que o repositório possua uma **Única Fonte de Verdade (Single Source of Truth - SSOT)**, eliminando riscos de desvio arquitetural (*drift*), poluição por arquivos mortos e *hallucination* contextual por parte de agentes cognitivos de IA que interagem com a base de código.

---

## 🗺️ 2. Divisão Estrutural por Fases de Execução

O plano está estruturado de forma incremental e segura para garantir **zero regressão funcional**, garantindo validações de integridade automática através de ciclos integrados ao compilador e linter.

```
                  ┌──────────────────────────────────────────────┐
                  │   FASE 1: ALINHAMENTO DE CÓDIGO FONTE        │
                  │   - Estabilização de interfaces legadas      │
                  │   - Acoplamento estrito de BaseRepository/Entity│
                  │   - Centralização estrita de Zod no models   │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │   FASE 2: GOVERNANÇA DE CONTEXTO DE IA       │
                  │   - Estruturação do fluxo de busca legada    │
                  │   - Blindagem e rotulagem de legacy docs      │
                  │   - Harmonização de manuais de AI Tools      │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │   FASE 3: AUTOMAÇÃO E VALIDAÇÃO CONTÍNUA     │
                  │   - Automação integrada de fix-imports       │
                  │   - Definição de regras de revisão (PR/MR)   │
                  │   - Check de integridade de schemas Zod      │
                  └──────────────────────────────────────────────┘
```

---

## 🛠️ 3. Detalhamento Técnico das Fases

### 📦 FASE 1: Alinhamento de Código Fonte & Melhores Práticas
*Foco: Elevar a consistência de design patterns e manter o código enxuto, tipado e centralizado.*

*   **Ação 1.1: Refatoração Limpa do `BaseRepository.ts`**
    *   **Problema:** Embora o `BaseRepository<T>` herde contratos abstratos, precisamos forçar que o tipo genérico `T` estenda formalmente a interface `BaseEntity` (que contém os atributos obrigatórios `id`, `userId`, `createdAt`, `updatedAt`).
    *   **Implementação sem regressão:**
        ```typescript
        // Em src/infrastructure/repositories/BaseRepository.ts
        import { BaseEntity } from '../../domain/entities/BaseEntity.js';
        
        export abstract class BaseRepository<T extends BaseEntity> {
          // Métodos existentes mantêm suas assinaturas estruturais intactas
        }
        ```
*   **Ação 1.2: Redirecionamento Estrito de Imports Obsoletos**
    *   Garantir a depreciação física de `/src/domain/validation/schemas.ts` e `/src/types/schemas.ts`.
    *   Caso haja alguma chamada residual, redefinir estes arquivos como simples re-exportadores das definições em `src/models/index.ts`, evitando duplicação lógica:
        ```typescript
        // Em src/domain/validation/schemas.ts
        export { financialGoalSchema, householdTaskSchema } from '../../models/index.js';
        ```

*   **Ação 1.3: Higienização de Scripts Temporários em `/scripts`**
    *   Registrar descrições detalhadas dentro de `docs/pipelines/automation_and_scripts.md` para cada utilitário:
        *   `fix-imports.ts`: Rotina de autocorreção automática de importações legadas.
        *   `sync-env.ts`: Sincronizador determinístico de variáveis locais para o ambiente de desenvolvimento.
        *   `build-orch.js`: Motor de transpilação focada do barramento de IA do Fastify.

---

### 🧠 FASE 2: Governança do Contexto Documental para IAs
*Foco: Blindar a base de documentação clássica técnica, evitando falsos positivos e contradições estruturais.*

*   **Ação 2.1: Isolamento de Busca Hermética da Pasta `/docs/legacy/*`**
    *   **Problema:** Ferramentas de busca contextual de IA frequentemente indexam arquivos históricos (onde Fastify/Express coiniciam, etc.) causando respostas ambíguas.
    *   **Implementação:** Anexar uma marca d'água técnica padronizada em todos os `README.md` e arquivos de especificação anteriores para sinalização rápida ao analisador léxico da LLM:
        ```markdown
        <!-- SYSTEM_METADATA_IGNORE_COGNITIVE_SEARCH: true -->
        <!-- ARCHIVAL_STUB_ONLY -->
        ```
*   **Ação 2.2: Alinhamento de Terminologias de Framework**
    *   Substituir referências dispersas ao "servidor Express" em favor do "servidor Fastify compilado via esbuild" em todos os documentos técnicos principais (`/docs/MASTER_ARCHITECTURE.md`, `/docs/MASTER_DOMAINS_AND_CONTRACTS.md`, e `AGENTS.md`).

---

### 🚀 FASE 3: Automação e Validação de Campo
*Foco: Prevenir novos desvios (drift) através de automações de entrega contínua.*

*   **Ação 3.1: Integração de Checagem Pré-Commit / Pré-Push**
    *   Vincular a execução de `npm run lint` e de `scripts/fix-imports.ts` ao pipeline local de commits. Caso um script ou módulo tente expor uma importação para as pastas legadas de schemas depreciados, o commit falha e aponta para `src/models/index.ts`.
*   **Ação 3.2: Suite de Testes de Sanidade Documental**
    *   Adicionar um teste automatizado sob o diretório `BaseRepository.test.ts` para verificar se todas as entidades salvas na coleção passam pelo schema Zod central em tempo de persistência de domínio.

---

## ⚠️ 4. Análise de Impactos e Prevenção de Regressões

Como este plano trata principalmente de **refatorações de assinaturas abstratas e documentação técnica**, os seguintes critérios de isolamento garantem a máxima integridade do ecossistema:

1.  **Imutabilidade Funcional do Frontend:** A camada do SPA em React (`src/client/`) não sofre alterações lógicas, apenas o modelo de contrato de dados que já se encontra centralizado no models é blindado.
2.  **Validação Dinâmica de Ambiente:** O linter é executado após cada modificação incremental e o build final (`npm run build`) assegura que as importações explícitas de ESModules terminadas em `.js` permaneçam em conformidade com o Node runtime.

---

## 🎯 5. Critérios de Conclusão e Entrega da V2

1.  [x] Classe abstrata `BaseRepository` tipada formalmente para receber apenas herdeiros de `BaseEntity`.
2.  [x] Arquivos depreciados redefinidos como stubs re-exportadores do `src/models/index.ts`.
3.  [x] Marcação estéril de proteção a buscas de IA implementada em toda a pasta `/docs/legacy/*`.
4.  [x] Compilação de produção (`npm run build`) concluída com sucesso e emitindo Zero avisos de tipos quebrados.
