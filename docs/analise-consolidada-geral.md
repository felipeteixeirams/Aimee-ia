# Análise Consolidada Geral - Projeto Aimee

## 1. Visão Geral
Aimee é um ecossistema de inteligência pessoal voltado para a orquestração residencial e familiar. O sistema integra gestão financeira, controle de estoque/compras e sincronização de rotinas (tarefas e calendário) através de uma interface conversacional multimodal (texto e voz) e um motor de insights proativos.

## 2. Responsabilidades
- **Frontend (React 19)**: Responsável pela interface do usuário (UI), reatividade de dados via Firebase Web SDK e execução de ferramentas (tool calling) disparadas pela IA para garantir atualizações imediatas no estado local.
- **Backend/BFF (Fastify/Node.js)**: Atua como um Proxy Seguro e Orquestrador. Gerencia autenticação OAuth sensível (Google Calendar), integrações com APIs de terceiros (Google Maps, LLMs), dispara notificações (e-mail) e provê segurança para chamadas de IA.
- **Camada de Domínio (`src/domain`)**: Centraliza as regras de negócio puras através de "Skills" (Shopping, Finance, Routine) e a lógica de inteligência (Roteador de Intenções e Motor de Insights).
- **Camada de Infraestrutura (`src/infrastructure`)**: Implementa o acesso a dados (Repositórios), adaptadores para diferentes provedores de LLM e ferramentas de servidor.

## 3. Fluxo Operacional
1. O usuário interage via ChatView (texto ou voz).
2. O `useAimeeActions` (Hook) envia o prompt para o `aimeeClientOrchestrator` (Proxy no FE).
3. O Proxy faz um POST para `/api/ai` no Backend.
4. O `AimeeOrchestrator` (BE) processa a requisição através do `IntentRouter` e solicita a resposta ao LLM configurado (Gemini, DeepSeek ou OpenAI).
5. O LLM retorna o conteúdo e possíveis "Function Calls" (ferramentas).
6. O Backend devolve a resposta para o Frontend.
7. O Frontend executa as ferramentas localmente através das `Skills` para atualizar o Firestore e garantir reatividade na UI.

## 4. Serviços Principais
- **AimeeOrchestrator**: O "cérebro" do backend que unifica múltiplos adaptadores de LLM.
- **IntentRouter**: Classificador de intenções que decide qual contexto e ferramentas são necessários.
- **InsightEngine**: Gera análises determinísticas baseadas nos dados reais do usuário (Financeiro e Produtividade).
- **CalendarService**: Gerencia a sincronização bidirecional entre Firestore e Google Calendar.
- **LocationService**: Integra com Google Places para sugerir estabelecimentos (ex: mercados próximos).

## 5. Dependências Internas
- As **Skills** de domínio dependem dos **Repositories** de infraestrutura (atualmente acoplados via injeção no frontend).
- O **AimeeOrchestrator** depende dos **Adapters** de LLM específicos.
- O sistema de tipos (`src/types`) e validação (`src/models`) são a fundação compartilhada por todo o monorepo.

## 6. Dependências Externas
- **Firebase**: Autenticação, Firestore (Banco NoSQL) e Hosting.
- **Google Cloud Platform**: Gemini AI (LLM), Google Calendar API e Google Places API.
- **Provedores de IA**: OpenAI (fallback) e DeepSeek.
- **CapacitorJS**: Para o empacotamento nativo Android/iOS.

## 7. Fluxos Assíncronos
- **Event Discovery Job**: Processo de varredura global para descoberta de eventos proativos.
- **Sincronização de Calendário**: Atualização em lote disparada pelo usuário ou via triggers.
- **Processamento de Áudio**: Captura e envio de MediaRecorder para transcrição e análise via Gemini Multimodal.

## 8. Integrações
- **OAuth Google**: Fluxo de consentimento para acesso a escopos de calendário (`calendar.events`).
- **Nodemailer**: Envio de notificações transacionais de sistema (aprovação de acesso, alertas).
- **Stripe (Planejado)**: Referenciado em documentos de estratégia para monetização/assinaturas.

## 9. Estrutura Simplificada
```text
/root
  /api (Vercel Functions)
  /server.ts (Express-like Fastify Server)
  /src
    /domain (Entities, Skills, Intelligence)
    /infrastructure (LLM Adapters, Repositories, Server logic)
    /services (Application Proxies)
    /pages (Views do App)
    /hooks (React Data & Actions bridge)
```

## 10. Riscos Técnicos
- **Latência de IA**: O processamento sequencial (Intent -> LLM -> Tool -> Response) pode levar segundos, exigindo excelente feedback visual de loading.
- **Acoplamento de Repositórios**: A execução de ferramentas no frontend exige que o estado de autenticação e rede estejam perfeitos no momento do retorno da IA.
- **Custos de Tokens**: Uso intensivo de contexto pode elevar custos; mitigado pelo uso de heurísticas no `IntentRouter`.

## 11. Pontos Críticos
- **AimeeOrchestrator.ts**: Ponto único de falha para a inteligência do sistema.
- **Firestore Rules**: Como o acesso é direto via frontend, a segurança reside inteiramente na configuração das regras de segurança do Firebase.
- **Sincronização de Estado**: Manter o Firestore em sintonia com calendários externos sem gerar loops de atualização.

## 12. Sugestões Arquiteturais
- **Migração para Server-Side Tools**: Mover a execução de ferramentas para o backend usando `firebase-admin` para garantir atomicidade e permitir que a Aimee execute ações mesmo se o usuário fechar o app antes do processamento terminar.
- **Cache Semântico**: Implementar uma camada de cache para perguntas frequentes ou insights que não mudaram para economizar tokens de LLM.
- **Unificação de Repositórios**: Criar uma abstração única que funcione tanto em ambiente Node (BE) quanto Web (FE) para evitar duplicação de lógica de persistência.

## 13. Resumo Executivo
O projeto Aimee apresenta uma arquitetura madura e escalável, seguindo princípios de Clean Architecture e Hexagonal. O uso de um padrão BFF (Backend for Frontend) permite que a aplicação seja leve e segura ao mesmo tempo. A integração profunda com ecossistemas de IA e serviços Google posiciona o produto como um assistente residencial de alto valor agregado, com fundações técnicas sólidas para expansão mobile e web.
