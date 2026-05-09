# Estratégia de Lançamento e Evolução - Aimee

Este documento apresenta a análise profunda dos caminhos para o lançamento da aplicação Aimee, bem como as necessidades técnicas, estratégias de negócios e infraestrutura para escalar o produto ao nível de produção sustentável.

---

## 1. Frentes de Lançamento (Go-to-Market)

Dado o estado atual do projeto (Construído em React, Vite, Tailwind, com Firebase e integração de LLMs), existem dois caminhos principais para entregar o App ao usuário final.

### Frente A: Web App & PWA (Progressive Web App)
O produto funciona primariamente pelo navegador, podendo ser "instalado" na tela inicial do celular através das tecnologias PWA, ignorando as lojas de aplicativos tradicionais.

* **Nível de Dificuldade:** Baixo / Médio
* **Progresso Atual Estimado:** 85%
* **Prós:** Deploy instantâneo, atualizações silenciosas sem aprovação de lojas, zero comissão (30% da Apple/Google).

**Passo a Passo Macro para o Lançamento (Web/PWA):**
1. **Polimento do Manifest & Service Worker:** Garantir que o `manifest.json` tenha os ícones corretos, cor de tema e comportamento `standalone`. Configurar o registro do PWA com `vite-plugin-pwa` (CacheFirst para assets, NetworkFirst para API).
2. **Setup de Domínio e SSL:** Conectar um domínio real (ex: `getaimee.com`) na Vercel ou Firebase Hosting, garantindo HTTPS ativo (obrigatório para PWA).
3. **Mecanismo de Push Notifications Web:** Implementar VAPID keys no Firebase Cloud Messaging (FCM) para suportar notificações no navegador quando houver insights cruciais.
4. **Setup de Analytics & SEO básico:** Adicionar tags de Open Graph e configurar Google Analytics / PostHog para mapear as métricas de primeiro uso (AARRR funnel).
5. **Políticas Legais:** Criar páginas estáticas públicas para "Termos de Serviço" e "Política de Privacidade" (obrigatórias para autenticação com Google OAuth).

---

### Frente B: Aplicativo Nativo (Android & iOS)
Envelopar (ou reescrever peças de) seu código React para ser distribuído diretamente pela Google Play Store e Apple App Store. O caminho mais lógico dado o stack atual é utilizar **CapacitorJS**, que traduz sua aplicação Web para nativo usando webviews turbinadas e provê acesso às APIs de hardware, ao invés de reescrever tudo em React Native.

* **Nível de Dificuldade:** Alto
* **Progresso Atual Estimado:** 40% (A UI é mobile-first, mas tudo de "sistema operacional" falta ser integrado).
* **Prós:** Distribuição global nas lojas, confiança dos usuários, acesso robusto a sensores (notificações push nativas, biometria).

**Passo a Passo Macro para o Lançamento (Mobile Nativo):**
1. **Integração CapacitorJS:** Configurar `npx cap init`, `npx cap add android`, e `npx cap add ios`.
2. **Adequação de Plugins Nativos:** Substituir funções baseadas apenas em navegador (ex: geolocalização por API Web) pela API do Capacitor correspondente (`@capacitor/geolocation`, `@capacitor/push-notifications`). Ajustar permissões em `AndroidManifest.xml` e `Info.plist`.
3. **Ajustes Críticos de Interface (UX Nativa):** Tratar SafeArea (Notch do iPhone), barra de status e barra de navegação virtual do Android. Implementar captura via botão de "voltar" nativo no Android.
4. **Fluxo In-App Purchases (IAP):** Integrar SDKs de assinatura como **RevenueCat**. Apple e Google exigem que a cobrança no app passe pelos sistemas deles (taxa de 15~30%).
5. **Processos Burocráticos e Build:**
   * Abrir/Pagar contas: Apple Developer ($99/ano) e Google Play Console ($25 vitalício).
   * Gerar os certificados e _provisioning profiles_.
   * Passar pelo rigoroso e exaustivo processo de revisão técnica e de design da Apple, que frequentemente rejeita apps que parecem "apenas sites".

---

## 2. Análise Profunda Base para Escala (Em todos os níveis)

Apesar da Aimee ter uma ótima fundação com a **Arquitetura 2.0 (Determinística)**, um aplicativo "production-ready" exige suporte, resiliência e processos financeiros estruturados.

### 2.1. Pipeline e Ciclo de Vida do Software (CI/CD)
* **Ambientes Segregados:** Atualmente estamos misturando tudo. Precisamos de no mínimo dois projetos no Firebase: `aimee-dev` e `aimee-prod`.
* **Deployment Automatizado:** 
  * Para Web: Utilizar fluxos Vercel (já mapeados em branch `main` e `develop`).
  * Para Mobile: Implementar o **Fastlane** para compilar automaticamente os binários nativos (`.apk`/`.aab` e `.ipa`) em Github Actions e enviar para o TestFlight/Google Play Internal Track.
* **Feature Flags:** Habilidade de ligar/desligar features para usuários via plataforma externa (ex: Firebase Remote Config ou LaunchDarkly), o que evita quebra generalizada se um LLM provar-se instável.

### 2.2. Interface e UX
* **Onboarding & O "Aha Moment":** Uma UI bonita não substitui um tutorial. O usuário precisa sentir o valor da Aimee nos primeiros 40 segundos e ter seus dados preenchidos de forma automatizada de preferência.
* **Micro-interações de Espera (Awaiting AI):** A IA leva tempo. Loading spinners não bastam; use *skeletons* orgânicos ou textos variando (ex: "Cruzando dados...", "Calculando previsões...").
* **Acessibilidade (a11y):** Garantir alto contraste, compatibilidade com VoiceOver e navegação por teclado (especial ao mudar para web nativa).

### 2.3. Precificação, Gatekeeping e Negócios
Para que um agente baseado em LLM seja sustentável (cada prompt custa $), deve existir uma trava.
* **Controle de Custos:** `UsageRepository` atual rastreia métricas, o que é brilhante. Agora precisamos conectá-lo a cotas: "Você usou seus 20 Insights Avançados do mês".
* **Modelo Sugerido:** Freemium Híbrido.
  * **Free:** Registro manual de finanças, lembretes de rotina, e respostas determinísticas (sem uso pesado de IA).
  * **Aimee Plus ($/mês):** Insights preditivos usando DeepSeek/Gemini complexo, digitalização de recibos visuais e relatórios sofisticados.
* **Gateway de Pagamentos:** Utilize o ecossistema Stripe Checkout (ou Stripe Payment Element) para PWA. Para Android/iOS, use o **RevenueCat**. Lembre-se, o Stripe não é permitido pela Apple para liberar recursos in-app (a menos que seja fora do app, exigindo contorcionismos proibidos).

### 2.4. LLMs, Modelos e Proxy de Tráfego
* **Rate Limiting no Backend:** Os endpoints `/api/ai` precisam ter limitação severa (ex: `express-rate-limit`) e checagem forte de token Firebase de usuário para prevenir ataques DDoS ou esgotamento do cartão de crédito de sua API.
* **Cache Semântico e Custo Computacional:** Se o usuário pergunta duas vezes a mesma coisa ("O que tem pra vencer?"), não chame a IA; o seu insight engine deve ter uma hash persistida e trazer dados.
* **Conformidade em IA e Localidade:** LLMs estão enviando possivelmente dados financeiros do usuário. Políticas de privacidade devem declarar explicitamente quais parceiros recebem a nuvem destes dados para cumprir com (GDPR, LGPD).

### 2.5. Banco de Dados e Persistência
* **Firestore Rules Hardening:** Atualmente possuímos regras rígidas, mas uma auditoria em "Segurança em Nível de Coleção" deve ser feita.
* **Offline-First Resolving Contlicts:** Aimee vai ser operada em corredores de mercado com 3G ruim. O Firebase Offline Mode (`enableIndexedDbPersistence`) deve ser garantido na inicialização do service, junto com tratamento robusto para não gerar duplicação de transações durante sincronismo tardio.
* **Rotina de Cópia (Backup):** Configurar Google Cloud Scheduler e uma Cloud Function para tirar snapshots automáticos do Firebase a cada 24 horas, essencial na versão Premium.

### 2.6. Novas Funcionalidades para o "Aha Moment"
* **Conexão Bancária (Open Finance Integration):** Digitar transações manualmente em 2026 causa abandono de apps (churn). Integrar ferramentas como **Pluggy** (Brasil) ou Plaid, permitindo que a Aimee classifique gastos assim que o cartão passe.
* **Processamento de Câmera (Computer Vision Vision):** Bater a foto de uma nota de supermercado e o LLM multimodal transformar os itens automaticamente na lista de despesas já classificada, aproveitando as capacidades do Gemini 1.5 Flash nativamente.
* **Widgets Nativos:** (Apenas via path Nativo) Widget iOS mostrando a "Próxima Rotina" e os "Gastos vs Orçamento".

---

## 3. Próximo Passo Prático Pós-Avaliação

Se a intenção for **validação de mercado** RÁPIDA com capital baixo, siga 100% no caminho Web (PWA), invista na Landing Page, implemente Stripe + Feature Flag para limitar chamadas do backend de IA. Assim que os *Unit Economics* (Custo de Servidor de IA vs Lifetime Value do usuário pagante) estiverem positivos, utilize esses fundos para injetar a tecnologia nas Lojas da Apple/Google.
