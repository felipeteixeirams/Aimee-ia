# 🗺️ Roadmap Estratégico: Aimee V3 (Inteligência Preditiva e Ecossistema)

**Autor:** AI Coding Agent / Arquiteto de Software Sênior
**Status:** 📋 Proposta de Backlog (Aguardando Aprovação)
**Data:** 24 de Julho

---

## 🎯 Visão Geral
Com a fundação V2 totalmente saneada, testada (100% verde) e modernizada (UI/UX Anti-Slop, Flattened Depth), o sistema atingiu estabilidade estrutural. As próximas fases devem focar em transformar a Aimee de uma ferramenta **reativa** (espera comandos) para uma assistente **proativa** e expandir seu ecossistema.

Abaixo estão sequenciadas as propostas de escopo para as próximas etapas de engenharia (Etapas 11, 12 e 13).

---

## 📦 Etapa 11: Ecossistema e Alertas Proativos (Push & Notificações)
*Objetivo: Romper a barreira do navegador e notificar a família de forma assíncrona.*

*   **FWM (Firebase Cloud Messaging) Integration:**
    *   Setup de Service Workers para Push Notifications no PWA.
    *   Gestão de tokens FCM associados aos perfis dos usuários.
*   **Triggers Proativos:**
    *   Notificação de vencimento de contas (ex: "A conta de luz vence amanhã").
    *   Notificações de delegação de tarefas (ex: "Sua esposa delegou a compra de pão").
    *   Lembretes de geofencing (ex: "Você está perto do mercado X, não esqueça de comprar leite").
*   **Arquitetura:** `NotificationRepository` + Cloud Functions / Cron Jobs (ou webhooks no Fastify).

## ✅ Etapa 12: Processamento Multimodal de Documentos e Cupons Fiscais (Storage + Vision) - CONCLUÍDA
*Objetivo: Automatizar a entrada de dados financeiros e rotineiros via câmera do celular.*

*   **OCR Inteligente (Gemini Vision):**
    *   Upload de foto de nota fiscal de supermercado via UI (Integração com Câmera no PWA).
    *   Processamento assíncrono para extrair itens comprados, preços e categorizar automaticamente, populando `FinanceView` e deduzindo do `ShoppingView`.
*   **Gestão de Documentos:**
    *   Bucket no Google Cloud Storage (via Firebase Storage) para arquivamento de receitas médicas, garantias e contratos domésticos.
*   **Arquitetura:** Novo módulo `StorageService` e expansão da `AimeeTools` para ingestão de imagem (Base64/URL).

## 📺 Etapa 13: "Kitchen Hub" (Modo Tablet / Kiosk)
*Objetivo: Uma view dedicada, always-on, projetada para tablets montados em paredes ou geladeiras.*

*   **Dashboard Agregado (Glanceable UI):**
    *   Relógio proeminente, widgets de clima local, status da agenda do dia de todos os membros da casa.
    *   Fila do carrinho de compras compartilhada rodando em tempo real.
*   **Screensaver Mode / Ambient Mode:**
    *   Componente de inatividade que exibe carrossel de memórias ou apaga a tela para preservar energia.
*   **Arquitetura:** Roteamento de view específica (`/hub`), proteção contra sleep/lock screen via Wake Lock API.

## 🤖 Etapa 14: Agente Autônomo e Relatórios Periódicos (Deep Analysis)
*Objetivo: Agendamento autônomo de análise sem prompt direto do usuário.*

*   **Relatório Semanal/Mensal (Cron):**
    *   No domingo à noite, a Aimee compila automaticamente os gastos e tarefas não feitas, passando pelo `InsightEngine` e enviando um push notification de briefing semanal.
*   **Contexto Familiar de Longo Prazo:**
    *   Vetorização de gostos, restrições alimentares e metas financeiras da família, armazenados na raiz do domiciliário, afetando sugestões (ex: "Posso sugerir uma marca de queijo sem lactose que entrou em promoção").

---

## 🚦 Decisão Arquitetural
Para iniciarmos a Spec Phase, precisamos definir qual frente agrega mais valor no curto prazo.

**Recomendação Técnica:** Sugiro iniciarmos pela **Etapa 12 (Processamento Multimodal via OCR/Câmera)**, pois aproveita a infraestrutura do Gemini já consolidada na V2 e entrega enorme valor prático de UX, reduzindo atrito de digitação.
