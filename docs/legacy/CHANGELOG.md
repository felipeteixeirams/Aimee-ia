<!-- SYSTEM_METADATA_IGNORE_COGNITIVE_SEARCH: true -->
<!-- ARCHIVAL_STUB_ONLY -->

# Changelog

> ⚠️ **HISTORICAL DOCUMENT**: Este documento faz parte do histórico arquitetural do projeto (Aimee V1) e pode conter referências obsoletas a Express, CommonJS ou estruturas legadas de banco de dados. Para a arquitetura ativa de produção, consulte sempre a raiz `/docs/*.md` e `/docs/AGENTS.md`.

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-25

### Adicionado
- **Lançamento Inicial**: Versão estável da Aimee - Agente Pessoal IA.
- **Integração com Google Calendar**: Sincronização proativa de eventos da conta Google com a agenda familiar.
- **Gestão Financeira**: Dashboard completo com registro de transações, metas e análise de gastos.
- **Lista de Compras Inteligente**: Sistema de estoque e lista dinâmica com prioridades.
- **Gestão de Tarefas (Housekeeping)**: Organização de rotinas domésticas e tarefas recorrentes.
- **IA Multimodal (Gemini)**: Interface de chat contextual que entende comandos financeiros, de compras e agenda.
- **Personas da IA**: Possibilidade de escolher entre perfis Divertido, Analítico ou Econômico.
- **Modo Escuro**: Suporte completo a temas claro e escuro.
- **Espaços Compartilhados**: Funcionalidade de convite para membros da família compartilharem dados.
- **Segurança de Dados**: Implementação de Firebase Auth e Firestore Rules robustas.
- **Tratamento de Erros Resiliente**: Interface intuitiva para lidar com permissões de API e erros de rede (incluindo diagnóstico de erro 403).
- **OAuth Google**: Autenticação segura com solicitação de consentimento explícito para escopos de calendário.

### Ajustado
- Melhoria na lógica de sincronização para evitar duplicidade de eventos do Google.
- UI do botão de sincronização agora fornece feedback visual claro e links de ação para resolver problemas de permissão.

---
*Este arquivo é atualizado a cada nova funcionalidade ou correção significativa.*
