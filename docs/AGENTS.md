# Diretrizes de Desenvolvimento Aimee

## Auditoria de Tokens LLM (Rastreabilidade)
Toda interação com LLM deve ser auditada para controle de custos e monitoramento de performance.
- **Repositório**: `UsageRepository` salva em `llm_usage` (coleção global).
- **Dados Capturados**: `userId`, `model`, `promptTokens`, `completionTokens`, `totalTokens`, `context` (ex: chat, insight).
- **Boas Práticas**:
  - O orquestrador (`AimeeOrchestrator` no backend e `aimeeClientOrchestrator` no frontend) cuida do log automaticamente.
  - Ao adicionar novos provedores ou fluxos de IA, garanta que os metadados de `usage` sejam extraídos e passados para o repositório.

## PWA & Performance
- **Caching**: Utiliza `vite-plugin-pwa` com estratégias `CacheFirst` para fontes e `NetworkFirst` para APIs.
- **Offline**: O app é capaz de carregar instantaneamente após o primeiro acesso via Service Worker.

## Notificações
- **Push & Local**: Sistema de notificações via `notificationService` que "vaza" para fora do app quando insights premium ou conclusões de tarefas ocorrem.
- **Controle do Usuário**: O usuário deve ter a opção de ativar/desativar em Configurações.

## UI/UX
- Seguir o estilo Apple Music para sugestões ("Para Você").
- Usar `lucide-react` para ícones.
- Animações com `motion/react`.
