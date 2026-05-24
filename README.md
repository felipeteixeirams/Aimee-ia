# Aimee - Agente Pessoal IA

Aimee é uma **Agente Orquestradora de Inteligência Pessoal** projetada para simplificar a gestão da vida cotidiana. Atuando como uma consultora proativa, ela integra finanças, compras domésticas, rotinas familiares e calendário em uma interface incrivelmente polida, imersiva e gamificada — com um toque *Premium*.

## 🚀 Funcionalidades Principais

### 💰 Gestão Financeira Inteligente
- **Registro de Transações**: Acompanhamento de ganhos e gastos com categorização e validação robusta.
- **Metas Financeiras**: Planejamento e acompanhamento de objetivos de longo prazo (viagens, reformas, etc.).
- **Análise de Comportamento**: Insights proativos sobre padrões de consumo e alertas.
- **Dashboards Premium**: Interface visual rica, transições fluidas e componentes *glassmorphism*.

### 🛒 Compras e Estoque Doméstico
- **Lista de Compras Dinâmica**: Adição inteligente de itens com níveis de urgência e categorias visuais.
- **Controle de Estoque**: Gestão da despensa com previsão de quando os itens irão acabar.
- **UX Polida**: Navegação em abas suaves (Stock / Shopping List) e formulários robustos com tratamento de erros.

### 🏠 Rotinas e Agenda Familiar
- **Gestão de Tarefas Advanced**: Organização de limpeza, manutenção e recados com suporte a recorrentes complexas (diárias, semanais, mensais e anuais).
- **Google Calendar Sync**: Sincronização proativa de eventos da conta Google com a agenda familiar.
- **Família e Compartilhamento**: Convide membros da família e gerencie o espaço doméstico de modo colaborativo.

### 🤖 Inteligência Artificial Imersiva
A interface de chat foi redesenhada para oferecer uma experiência "mágica" e responsiva:
- **Interface de Vidro (Glassmorphism)**: Efeitos de blur 3D, sombras suaves e texturas refinadas.
- **Feedback Háptico e Visual**: Animações na gravação de áudio, pulsações contextuais, tooltips "copiar/editar".
- **Identidade Adaptável (Personas)**: A Aimee conversa no modo Analítico, Frugal ou Divertido.
- **Multi-Provedor**: Suporte nativo para **Google Gemini** servido de forma segura no backend.

## 🎨 UI/UX Design System
O sistema visual foi completamente redesenhado para atingir um padrão "World Class":
- **Tipografia**: Uso sofisticado de *Inter* e *Cal Sans / Space Grotesk*.
- **Motion Design**: Telas com animações suaves de desfoque, entrada e saída via `framer-motion`.
- **Modo Escuro Avançado**: Paletas "Cosmic Slate", sombras coloridas, malhas de gradientes complexos de fundo e opacidades otimizadas.
- **Prevenção de Erros**: Formulários com validação estrita baseada em `Zod` (Spec-Driven).

## 🛠️ Tech Stack & Arquitetura

- **Frontend**: React 19, TypeScript, Vite
- **Backend/API**: Express (Full-stack mode com `tsx`/`esbuild`)
- **Estilização**: Tailwind CSS 4, Lucide Icons
- **Animações**: Motion (former `framer-motion`)
- **Validação & Contratos**: `zod`
- **Modelos de IA**: `@google/genai` (SDK moderno) via backend para proteção das chaves (Gemini 1.5 Flash).
- **Persistência**: Firebase Firestore & Firebase Auth

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no [Firebase](https://console.firebase.google.com/)
- Chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd react-example
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Atente-se para definir `GEMINI_API_KEY` (usada no servidor).*

4. **Configure o Firebase:**
   Defina suas credenciais no arquivo `firebase-applet-config.json` para que as regras de segurança locais sejam aplicadas.

## 💻 Executando Localmente (Full-Stack)

A aplicação utiliza um servidor Express que serve a API (para encapsular chamadas de IA) e a interface React simultaneamente.

```bash
npm run dev
```

Acesse via `http://localhost:3000`. 
*(Para produção, utilize `npm run build` seguido de `npm run start`).*

## 🐳 Executando com Docker

Se preferir usar Docker:
```bash
docker-compose up --build
```
Acesse `http://localhost:3000`. O hot reload já está configurado.

## 📜 Versão e Histórico
Consulte o [CHANGELOG.md](./CHANGELOG.md) para detalhes. (Versão atual: 1.0.0).

---
*Aimee prioriza a beleza analítica e a eficácia arquitetural, unindo Spec-Driven Development com design funcional responsivo.*
