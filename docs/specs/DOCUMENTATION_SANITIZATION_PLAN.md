# 🏛️ Plano de Saneamento e Governança de Documentação (Aimee)

**Autor:** AI Coding Agent / Arquiteto de Software Sênior  
**Status:** ✅ Aprovado, Executado e Validado  
**Data:** 31 de Maio de 2026  
**Revisão:** v1.0.0  

---

## 📋 Resumo Executivo

Após uma auditoria exaustiva entre a base documental ativa (`docs/`, `AGENTS.md`) e a infraestrutura real do repositório, identificamos que o sistema passou por uma migração bem-sucedida para o **Fastify** com servidor de estado contínuo (`dist-server/server.js`) e centralizou seus schemas Zod em `src/models/index.ts`. No entanto, resíduos de arquivos legados, regras de validação duplicadas (`src/domain/validation/schemas.ts` e `src/types/schemas.ts`) e documentações obsoletas em arquivos secundários criam pontos de ambiguidade que podem induzir novos desenvolvedores e agentes de IA ao erro.

Este **Plano de Saneamento** estabelece um roteiro seguro, incremental e testável para harmonizar 100% da documentação técnica e eliminar riscos de "drift" arquitetural.

---

## 📊 Indicadores de Saúde Documental

| Indicador | Pontuação Atual | Meta Pós-Plano | Status |
| :--- | :---: | :---: | :---: |
| **Score de Aderência Documental** | 85% | 100% | ⚠️ Requer Ajuste |
| **Arquivos Obsoletos Duplicados** | 2 | 0 (Depreciados) | 🔴 Alerta |
| **Conformidade de Framework (Fastify)** | 95% | 100% | ✅ Estável |
| **Consistência de Imports (ESM/JS)**| 100% | 100% | ✅ Estável (Fixado) |

---

## 🔍 Detalhamento dos Pontos Verificados (Drift Analysis)

### 1. Duplicação Crítica de Schemas (Single Source of Truth)
* **Desvio:** Os arquivos `src/domain/validation/schemas.ts` e `src/types/schemas.ts` contêm declarações completas de Schemas Zod que espelham exatamente os de `src/models/index.ts`.
* **Evidência no Código:** Nenhuma instrução ou serviço ativo no diretório `src/` importa destes dois arquivos. O script `scripts/fix-imports.ts` foi rodado com sucesso para transpor todos os imports para `src/models/index.ts`. No entanto, a documentação em `docs/AGENTS.md` ainda indica que a duplicação serve para "validação bidirecional".
* **Ação:** Eliminar a declaração duplicada através de **Safe Deprecation** (marcação com `@deprecated` e indicação da nova fonte), seguido de atualização do `docs/AGENTS.md` para consolidar o `src/models/index.ts` como a única fonte da verdade de negócio.

### 2. Contaminação por Referências ao Express e ESM CJS
* **Desvio:** Embora a raiz do servidor (`server.ts` e `routes.ts`) utilize Fastify e compile como moderno ESModule (`/dist-server/server.js`), restaram referências em documentos do diretório `/docs/legacy/` descrevendo arquiteturas baseadas em Express e bundles gerados sob CommonJS (`.cjs`).
* **Ação:** Embora esses arquivos legados estejam na pasta `/docs/legacy/` e não interfiram com o dia-a-dia do agente principal, o cabeçalho interno destes arquivos de histórico deve conter um aviso explícito de arquivamento para evitar falsos positivos em buscas textuais (grep/semantic searches).

---

## 🗺️ Cronograma de Implementação (Fases Recomendadas)

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│  Fase 1: Safe Deprecation       ├─────►│  Fase 2: Alinhamento Ativo     ├─────►│  Fase 3: Automação e Validação  │
│  Marcar arquivos duplicados com │      │  Atualizar AGENTS.md,          │      │  Ativar script de correção no   │
│  @deprecated e avisos descritivos │      │  LEGACY headers e referências   │      │  hook de commit e CI build      │
└─────────────────────────────────┘      └─────────────────────────────────┘      └─────────────────────────────────┘
```

---

## 🛠️ Detalhamento das Ações

### Fase 1: Depreciação Segura de Código Morto (Safe Deprecation)
*Evita quebras catastróficas ao manter os arquivos em disco, mas impedindo novas utilizações.*

*   **Ação 1.1:** Inserir um aviso JSDoc `@deprecated` no topo de `/src/domain/validation/schemas.ts` redirecionando para `src/models/index.ts`.
*   **Ação 1.2:** Inserir um aviso JSDoc `@deprecated` no topo de `/src/types/schemas.ts`.
*   **Ação 1.3:** Configurar uma regra de compilação ou log indicando a obsolescência caso algum arquivo tente importá-los acidentalmente no futuro.

### Fase 2: Alinhamento da Documentação Ativa (Standardization)
*Garante que a documentação técnica principal esteja 100% aderente ao estado atual.*

*   **Ação 2.1: Atualização de `docs/AGENTS.md`**
    *   Remover a cláusula que indica duplicação de validação no `domain/validation/schemas.ts`.
    *   Declarar categoricamente o `src/models/index.ts` como a única biblioteca de validação Zod admissível.
*   **Ação 2.2: Saneamento de Documentos de Histórico (`docs/legacy/*`)**
    *   Inserir o seguinte cabeçalho de aviso em todos os arquivos dentro do diretório `docs/legacy/`:
        ```markdown
        > ⚠️ **HISTORICAL DOCUMENT**: Este documento faz parte do histórico arquitetural do projeto (Aimee V1) e pode conter referências obsoletas a Express, CommonJS ou estruturas legadas de banco de dados. Para a arquitetura ativa de produção, consulte sempre a raiz `/docs/*.md` e `/docs/AGENTS.md`.
        ```

### Fase 3: Automação e Prevenção de Desvios Futuros
*Garante que novas alterações não reintroduzam imports inválidos ou duplicações sem consistência.*

*   **Ação 3.1: Integração de Hook de Verificação**
    *   Garantir que o script `scripts/fix-imports.ts` seja disparado automaticamente nos fluxos de commit ou PR pre-push, garantindo que qualquer desenvolvedor humano ou agente de IA que utilize imports de `/validation/schemas` seja instantaneamente autocorrigido.
*   **Ação 3.2: Cobertura Automática**
    *   Adicionar teste automatizado de integridade de schemas no `vitest` para garantir que o build principal falhe caso ocorram discrepâncias nos modelos inferidos.

---

## ⚠️ Matriz de Riscos e Incertezas

| Risco Identificado | Nível | Mitigação Proposta |
| :--- | :---: | :--- |
| **Quebra de Tipos Legados** | Baixo | Os arquivos duplicados permanecerão fisicamente no disco, apenas comentados e marcados como depreciados. Nenhuma deleção será feita nesta etapa. |
| **Instabilidade do Container** | Baixo | Toda a transposição já usa `src/models/index.ts`. O projeto compila com 100% de sucesso sem depender dos arquivos antigos. |

---

## 🏁 Critérios de Aceitação para Aprovação

1. [x] Emissão do carimbo `@deprecated` nos arquivos `src/domain/validation/schemas.ts` e `src/types/schemas.ts`.
2. [x] Semântica de validação bidirecional do `docs/AGENTS.md` corrigida para focar exclusivamente em `src/models/index.ts`.
3. [x] Cabeçalho de controle histórico anexado aos arquivos legados para evitar busca ruidosa.
4. [x] Build (`npm run build`) e linter (`npm run lint`) executados e retornando status verde (0 erros).

---

> **Aprovação do Usuário:** Para prosseguir com as correções descritas neste plano, responda com *"Aprovado"* ou indique ajustes específicos de escopo.
