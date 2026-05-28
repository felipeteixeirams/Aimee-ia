# Auditoria Estrutural de Documentação - Projeto Aimee

Esta auditoria avalia a organização, taxonomia e coerência do ecossistema documental após a recente reorganização em `./docs`.

## 1. Diagnóstico Estrutural

### 1.1 Organização Estrutural
- **Status**: ✅ Bom estado inicial.
- **Observação**: A separação por categorias (`architecture`, `specs`, `decisions`) é clara, mas a presença de documentos soltos na raiz de `/docs` (`analise-consolidada-geral.md`) enfraquece a taxonomia.

### 1.2 Taxonomia Documental
- **Problema**: Inconsistência linguística. Temos nomes em Português (`analise-consolidada-geral.md`) e Inglês (`IMPLEMENTATION_BLUEPRINT.md`).
- **Problema**: O termo `palette.md` em `conventions/` é pouco descritivo para uma IA que busca diretrizes de design ou acessibilidade.

### 1.3 Hierarquia e Ponto de Entrada
- **Conflito**: `AGENTS.md` e `analise-consolidada-geral.md` competem como "Visão Geral".
- **Hierarquia**: Atualmente, a hierarquia é **Plana**. Não há uma distinção clara entre o que é "Verdade Canônica" (Master) e o que é "Contexto de Etapa" (Satellite).

---

## 2. Pontos Fortes
- **Rastreabilidade**: O uso de `legacy/` para o Changelog preserva o histórico sem poluir a visão atual.
- **Especialização**: Pastas como `integrations/` e `decisions/` permitem isolar complexidade técnica de decisões de negócio.
- **Foco em IA**: O `AGENTS.md` como bootstrap é uma prática de elite para projetos AI-native.

## 3. Problemas Encontrados e Conflitos

### 3.1 Conflitos de Navegação
- **Duplicidade de Caminhos**: Informações sobre Clean Architecture aparecem em `DIAGNOSTIC.md`, `analise-consolidada-geral.md` e `AGENTS.md`. Um agente de IA pode ler os três documentos, desperdiçando tokens e arriscando encontrar dados levemente divergentes.

### 3.2 Conflitos Hierárquicos
- **Documentos Mestres vs Satélites**: O `IMPLEMENTATION_BLUEPRINT.md` (Satélite de Status) é listado como "Obrigatório" no `AGENTS.md`, enquanto a análise arquitetural consolidada é omitida ou secundária.

---

## 4. Sugestões de Melhoria

### 4.1 Reorganização Sugerida
1. **Mover** `analise-consolidada-geral.md` para `architecture/SYSTEM_OVERVIEW.md`.
2. **Renomear** `palette.md` para `conventions/UX_GUIDELINES.md` para melhor descoberta semântica.
3. **Estabelecer** a `Fonte da Verdade` explicitamente no `AGENTS.md` (apontando para documentos Mestres).

### 4.2 Melhoria do Knowledge Graph
- **Fragmentação**: O sistema está levemente fragmentado (muitos arquivos pequenos). A consolidação proposta em `PROPOSTA_CONSOLIDACAO_DOCUMENTAL.md` é **crítica** para reduzir o "fan-out" de leitura das IAs.
- **Centralização**: Há um excesso de centralização de regras de implementação no `AGENTS.md`. Estas regras deveriam residir em um `docs/conventions/ENGINEERING.md`.

---

## 5. Score Estrutural Geral: **7.5/10**

- **Organização**: 8/10
- **Taxonomia**: 6/10
- **Hierarquia**: 7/10
- **Coerência para IA**: 9/10

## 6. Riscos para Agentes IA
- **Risco de Alucinação por Contradição**: Se o `DIAGNOSTIC.md` diz que algo é uma "vulnerabilidade" e o `BLUEPRINT.md` diz que está "concluído/seguro", o agente pode não saber como proceder.
- **Risco de Ineficiência (Tokens)**: A falta de consolidação obriga o agente a processar ~4-5 arquivos para ter um contexto básico de desenvolvimento.

---
**Conclusão**: A estrutura é sólida, mas precisa migrar de uma organização "baseada em arquivos" para uma organização "baseada em domínios de conhecimento" (Consolidação).
