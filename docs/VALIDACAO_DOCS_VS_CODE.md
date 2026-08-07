# Validação de Documentação vs. Código (Aimee)

Este documento apresenta o resultado da auditoria de aderência entre as especificações técnicas e a implementação real do sistema.

## 1. Score de Aderência Documental: **82%**

| Categoria | Aderência | Observação |
| :--- | :--- | :--- |
| **Arquitetura Core** | 90% | Clean Arq e BFF bem representados. |
| **Padrões de Design** | 75% | Drift identificado no uso de Injeção de Dependência (DI). |
| **Inteligência (AI)** | 85% | Arquitetura 2.0 funcional, mas IntentRouter é rudimentar. |
| **Integrações** | 80% | Google Calendar/Maps ok. Stripe é apenas planejado. |
| **Novas Funcionalidades** | 40% | Event Discovery Engine está quase totalmente sem documentação. |

---

## 2. Diagnóstico de Drift e Divergências

### 2.1 Drift Arquitetural: Injeção de Dependência (DI)
- **Documentado**: `AGENTS.md` e `analise-consolidada-geral.md` afirmam que Repositórios e Skills usam DI (tsyringe) de forma extensiva.
- **Realidade**: No código, apenas `EmailService` e `AimeeOrchestrator` estão no container (`infrastructure/container.ts`). Todos os Repositórios são instanciados como constantes singleton em seus próprios arquivos (`repositories/index.ts`), o que foge do padrão DI documentado.

### 2.2 Drift Funcional: IntentRouter
- **Documentado**: Descrito como um classificador de intenção sofisticado (Pipeline de Inteligência).
- **Realidade**: `IntentRouter.ts` contém apenas heurísticas básicas de string (`includes`). A classificação via LLM está comentada/planejada, mas não operacional.

### 2.3 Divergência de Status: Stripe
- **Documentado**: Referenciado em estratégias de escala.
- **Realidade**: Não há vestígios de SDK ou rotinas de pagamento no código. Documentação está correta ao dizer "Planejado", mas pode confundir agentes de IA que buscam implementação.

---

## 3. Código Crítico Sem Documentação

As seguintes funcionalidades foram implementadas recentemente, mas não constam nos documentos mestres:

1.  **Event Discovery Engine**:
    - `EventDiscoverySkill.ts`: Motor de busca proativa de eventos via LLM (Gemini/DeepSeek/OpenAI).
    - `EventMonitorComponent.tsx`: Interface de configuração de descoberta.
    - `MonitorEventRepository.ts`: Persistência de eventos descobertos.
2.  **ReactiveFeed**:
    - Componente `ReactiveFeed.tsx` que gerencia a exibição de insights proativos na UI ("Para Você").

---

## 4. Classificação de Documentos

### ✅ Atualizados Corretamente
- `docs/specs/UI_UX_SPECIFICATION.md`: Reflete bem a estética Apple-style e componentes mobile-first.
- `docs/integrations/IOS_SPM_INTEGRATION.md`: Válido para o contexto de build nativo.

### ⚠️ Parcialmente Desatualizados
- `AGENTS.md`: Precisa incluir o Bounded Context de "Event Discovery" e corrigir a afirmação sobre DI nos Repositórios.
- `docs/specs/IMPLEMENTATION_BLUEPRINT.md`: Embora o log esteja em dia, as tarefas "Concluídas" do Blueprint escondem a simplicidade atual do `IntentRouter`.
- `docs/analise-consolidada-geral.md`: O fluxo operacional não menciona a descoberta proativa de eventos em background.

### ❌ Totalmente Obsoletos
- **Nenhum**. O processo de reorganização recente limpou os documentos mortos.

---

## 5. Recomendações de Atualização (Prioridade Alta)

1.  **Consolidação Técnica**: Executar a proposta em `PROPOSTA_CONSOLIDACAO_DOCUMENTAL.md` para criar o `SYSTEM_MASTER.md` que inclua o **Event Discovery Engine**.
2.  **Sincronização de DI**: Decidir entre migrar Repositórios para Tsyringe ou atualizar os docs para refletir o padrão singleton atual.
3.  **Refino do IntentRouter**: Atualizar o `IntentRouter` para usar o `AimeeOrchestrator` (LLM) para classificação, conforme o design original, ou documentar a limitação por heurística.
4.  **Documentar ReactiveFeed**: Adicionar a lógica de proatividade (Insights Sweep) ao `SYSTEM_MASTER.md`.

---
**Score Final**: 8.2 / 10.
A documentação é de alta qualidade, mas o rápido desenvolvimento de novas features (Discovery/ReactiveFeed) gerou uma pequena fragmentação de conhecimento.
