<!-- SYSTEM_METADATA_IGNORE_COGNITIVE_SEARCH: true -->
<!-- ARCHIVAL_STUB_ONLY -->

# Diagnóstico de Arquitetura e Engenharia (Aimee)

> ⚠️ **HISTORICAL DOCUMENT**: Este documento faz parte do histórico arquitetural do projeto (Aimee V1) e pode conter referências obsoletas a Express, CommonJS ou estruturas legadas de banco de dados. Para a arquitetura ativa de produção, consulte sempre a raiz `/docs/*.md` e `/docs/AGENTS.md`.

## A. Arquitetura e Padrões de Design Adotados

1. **Paradigma Front-Heavy com Backend BFF (Backends for Frontends)**
   - O projeto adota uma arquitetura onde o cliente React possui papéis intensos de negócio (`domain/skills`, `aimeeClientOrchestrator`), acessando o Firestore diretamente usando Firebase Web SDK.
   - O Backend (Fastify) atua primariamente como Edge Proxy / Orquestrador Secundário (para OAuth do Google, disparo de emails e fallback LLM em `AimeeOrchestrator.ts`).
   
2. **Design Patterns Identificados**
   - **Repository Pattern:** Utilizado na pasta `infrastructure/repositories/`. Cobre classes que estendem o `BaseRepository.ts` para uniformizar chamadas à `collection` e tratar erros do Firestore. 
   - **Service Layer (DDD Lite):** Os casos de uso e as regras de negócio se fundem visualmente entre `domain/skills/` e `services/`.
   - **Dependency Injection:** Tsyringe é utilizado (`infrastructure/container.ts`), contudo, o uso prático está largamente focado na resolução do `EmailService` e `AimeeOrchestrator` em background. A UI majoritariamente não consome esses serviços via container, criando uma fratura arquitetural estrutural (o Backend usa DI, o Frontend usa acoplamento direto ou hooks customizados).

3. **Inconsistência Analítica (Firebase no Backend Node)**
   - **Vulnerabilidade Estrutural:** O `BaseRepository` utiliza `auth.currentUser?.uid` (Firebase Client SDK). Quando o Backend (Fastify) via `Server.ts` aciona a infraestrutura LLM (ex: falhou o Gemini local e fez call pra API `/api/ai`), e este, por sua vez, invoca `usageRepository.logUsage()`, a falha *Missing or insufficient permissions* é iminente. O servidor Node roda sem contexto web, não detendo credenciais web, portanto as Firebase Rules vetarão gravações sistêmicas provenientes dali a não ser que utilize o SDK de `firebase-admin`.

## B. Estrutura de Arquivos e Pastas

Atualmente, há forte granularidade mas alta sobreposição de responsabilidades:

- **`src/`**
  - **`components/`**: Bem isolada (Padrão Component-based tradicional). Mistura Views inteiras (ex: `FinanceView.tsx`) com componentes visuais unitários (ex: `AimeeAvatar.tsx`).
  - **`domain/`**:
    - `entities/`: Base. 
    - `intelligence/`: Prompts e roteador local da IA. (Boa abstração).
    - `services/`: Validações (`ValidationService.ts`). Não condiz perfeitamente com nomenclatura genérica e colide semânticamente com `/src/services`.
    - `skills/`: Comportamentos específicos para IA. Centraliza manipulação do BD em ações AI. (Poderia estar sob `features/`).
    - `validation/`: Possui o `schemas.ts` que duplica em semântica o `/src/types/schemas.ts`. Múltiplos repositórios de Zod schemas poluem as referências.
  - **`infrastructure/`**: Padrão de portas/adaptadores. É bom para código Node, mas confuso quando a maioria opera no React no cliente (ex: `/repositories`). 
  - **`services/`**: Fica em paralelo a `domain/services`. Onde `aiService.ts` está acoplado ao front de forma bem imperativa.
  - **`types/`**: Interfaces e Tipos + Zod schemas backend (`schemas.ts`).

## C. Limpeza Técnica (Diagnóstico de "Lixos" e Inconsistências)

1. **Zod vs Interfaces TypeScript Redundantes**
   - Em `types/index.ts`, existem cerca de 300 linhas de interfaces e tipos clássicos TS. Na pasta `domain/validation/schemas.ts`, todos os equivalentes destas propriedades são espelhados em validadores Zod, derivando pseudo-types (ex: `TransactionInput`). Ao alterar um modelo de negócio, exige modificação em dois arquivos e validação manual. A boa prática determina inferir todo TS via `z.infer<typeof ...>`.

2. **Dicotomia de AI Orchestrator**
   - O projeto possui `src/services/aiService.ts` (Orquestração de Inteligência de Múltiplos Provedores local no cliente) AND `src/infrastructure/llm/AimeeOrchestrator.ts` (Feita pela via Edge/Fastify). O código de roteamento é similar em ambos, gerando dívida técnica com `IntentRouter` para atualizar em duas pontas.
   - Os Prompts e LLMs geram dependência circular ou não escalável ao importar `allAimeeTools` e injetar dados (Mocks versus Contexts).

3. **Duplicação da Nomenclatura (Services)**
   - `src/services/` versus `src/domain/services/`. (Decidir: ou mantém-se camadas físicas puras (Toda Action = Controller, etc.) ou features verticais (Screaming architecture)).

4. **Incompatibilidade Node SDK no Firebase Repo (Falhas Silenciosas)**
   - Conforme apontado na auditoria, repasses de auditoria de Tokens (`usageRepository`) disparados pelo Fastify darão loop negativo sem `firebase-admin` e serão jogados para o `catch()` apenas poluindo logs de servidor.
   
5. **Gerenciamento de Testes Unitários**
   - Os arquivos de teste (`.test.ts`) convivem diretamente colados aos arquivos implementados (ex. `FinanceSkill.test.ts`). Isso é saudável, contudo, nota-se ausência de testes end-to-end ou de testes de integração robusta com contexto Firebase local no Github Actions.

## D. Plano de Ação Sustentável (Refatoração Sugerida)

1. **Unificação Zod-to-Types**
   - Consolidar toda a pasta `/types` e `/domain/validation` em um arquivo ou pasta único chamado `models/`. Usar Zod como fonte da verdade, extraindo interfaces puramente por derivação (`z.infer<>`). Remover arquivos passivos que hoje correm risco de serem defasados.

2. **Cisão Clara de Frontend vs Backend**
   - Como temos 2 execuções em `package.json` (`vite build` e `esbuild server.ts`), separar a raiz `src/` em 3 grandes diretórios:
     - `/src/client` (Todo o frontend React em Vite, Hooks e UI).
     - `/src/server` (Fastify routes, Middlewares, OAuth do Google, e a injeção Tsyringe).
     - `/src/shared` (Schemas Zod, Types, Configurações úteis, Utilidades lógicas neutras).

3. **Adoção de Camada Admin do Firebase (Para o Server)**
   - Integrar `firebase-admin` no Fastify (pasta `/src/server/infrastructure/db`) invés de usar o SDK do Web Client. Garantirá que qualquer Log de Usage, Analytics da LLM e Envio de e-mail atrelando ao backend escreva nativamente na Collection contornando a falha de Auth Rule.

4. **Remoção de Arquivos / Trechos Mortos (Limpeza)**
   - O uso anterior do `useVoiceRecorder` e transcrição já parece não ser a lógica central que vai para o Fastify.
   - Refatorar Views como arquivos `.page` sob uma pasta `/pages` ou `/views` diferenciando a abstração UI genérica (`/components`) de telas plenas roteadas (`AimeeAvatar` x `FinanceView`).

### Conclusão

O ecossistema está avançado, adotou patterns de segurança escaláveis para o client, mas esbarra no limite do modelo monolítico de ter misturado código Universal (Node+Browser) na mesma camada conceitual de domínio através de dependências como Firebase Web. Uma refatoração tática de **Pastas Módulos CBO (Client/Backend/Shared)** sanará a arquitetura completamente e reduzirá dívidas técnicas com Types vazados.
