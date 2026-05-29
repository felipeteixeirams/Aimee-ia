# AGENTS.md - Contextual Bootstrap & Rules

Este documento é o ponto de entrada principal para agentes de IA. Ele define as regras de operação, o mapa do projeto e o contexto necessário para interações eficientes e seguras.

## 1. Visão Geral do Sistema
Aimee é um orquestrador pessoal inteligente (BFF - Backend For Frontend) focado em gestão doméstica: Finanças, Compras e Rotinas. Utiliza Clean Architecture, Pipeline de Inteligência Determinística (Arquitetura 2.0) e integração multimodal (Voz/Texto).

## 2. Estrutura do Monorepo
- `src/`: Core da aplicação.
  - `src/domain/`: Lógica de negócio pura (Entities, Skills, Intelligence).
  - `src/infrastructure/`: Portas e Adaptadores (DB, LLM Adapters, Repositories).
  - `src/services/`: Orquestração de serviços de aplicação.
- `api/`: Configuração de funções Vercel/Serverless.
- `android/` & `ios/`: Projetos nativos via CapacitorJS.
- `docs/`: Documentação técnica organizada (Arquitetura, Specs, Decisões).

## 3. Responsabilidades
- **Frontend**: React 19, Vite, Tailwind 4. Gerencia UI e orquestração local de IA.
- **Backend (Server)**: Fastify (Node 20+). Gerencia OAuth, Proxy de Localização, e logs centralizados.
- **Shared**: Schemas Zod e Types (centralizados em `src/models/index.ts`).

## 4. Documentos Obrigatórios (Ler antes de qualquer análise)
1. `docs/architecture/DIAGNOSTIC.md`: Estado técnico e dívidas.
2. `docs/specs/IMPLEMENTATION_BLUEPRINT.md`: Roadmap e progresso real.
3. `docs/conventions/palette.md`: Padrões de acessibilidade e micro-UX.

## 5. Regras para Análise Incremental
- Sempre verifique o `docs/specs/IMPLEMENTATION_BLUEPRINT.md` para entender em qual etapa o sistema se encontra.
- Não sugira funcionalidades que já constam como "Concluídas" no Blueprint.

## 6. Bounded Contexts
- **Finance**: Transações, metas e análise de economia.
- **Shopping**: Inventário (estoque) e lista de compras com geolocalização.
- **Routine**: Tarefas domésticas, recorrências e sincronização com Google Agenda.
- **Intelligence**: Roteamento de intenções, motores de insight e adaptadores de LLM.

## 7. Regras de Implementação
- **Clean Architecture**: Mantenha lógica de negócio fora dos componentes e hooks.
- **Repository Pattern**: Todo acesso a dados deve passar por `BaseRepository`.
- **DI (Tsyringe)**: Use para serviços e repositórios (especialmente no backend).
- **Zod First**: Types devem ser inferidos de Schemas Zod (`src/models/index.ts`).
- **I18n**: UI e ARIA labels devem ser em Português (Brasil).

## 8. Regras de Documentação
- Novos documentos devem seguir a estrutura em `docs/`.
- Antes de mover/renomear arquivos, apresente uma tabela de proposta.
- Mantenha o `docs/specs/IMPLEMENTATION_BLUEPRINT.md` atualizado após grandes mudanças.

## 9. Anti-patterns
- Chamadas diretas ao Firebase/Firestore fora de Repositories.
- Lógica de negócio complexa dentro de components ou `useEffect`.
- Redundância de Tipos (não crie interfaces manuais se houver um Schema Zod).
- Prompt engineering "livre" (use o pipeline determinístico em `src/domain/intelligence`).

## 10. Fluxo Recomendado para Agentes IA
1. `list_files` para entender o escopo.
2. `read_file` nos **Documentos Obrigatórios** (Seção 4).
3. Analisar `src/models/index.ts` para entender as entidades.
4. Elaborar plano (`set_plan`) seguindo as diretrizes de Clean Architecture.
5. Implementar e validar via `pnpm test`.

## 11. Index de Documentações (`docs/`)
- `architecture/`: Diagnósticos e visões de sistema.
- `specs/`: Blueprints de implementação e UI/UX.
- `conventions/`: palette.md (UX). (Nota: AGENTS.md reside na raiz).
- `decisions/`: Estratégias de lançamento e decisões arquiteturais.
- `integrations/`: Documentação de APIs externas (iOS, Google Maps).
- `legacy/`: Changelog e histórico.

## 12. Convenções de Contexto
- **Usuário**: Identificado pelo `uid` do Firebase Auth.
- **IA**: Sempre "Aimee". Respostas curtas (máximo 2 frases), determinísticas e baseadas em dados reais.

## 13. Economia de Tokens
- Não leia arquivos de `node_modules`, `dist` ou `build`.
- Use `grep` para localizar strings antes de ler arquivos inteiros.
- Evite re-ler documentos já processados na mesma sessão.

## 14. Regras de Não Reanálise Desnecessária
- Se um passo do plano foi verificado, não o repita.
- Use a memória da sessão para manter o estado dos arquivos lidos.
- Confie no `IMPLEMENTATION_BLUEPRINT.md` como fonte da verdade para o estado atual.
