# Aimee - Agente Pessoal IA

Aimee é uma **Agente Orquestradora de Inteligência Pessoal** projetada para simplificar a gestão da vida cotidiana. Atuando como uma consultora proativa, ela integra finanças, compras domésticas e rotinas familiares em uma interface intuitiva e gamificada.

## 🚀 Funcionalidades Principais

### 💰 Gestão Financeira Inteligente
- **Registro de Transações**: Acompanhamento de ganhos e gastos com categorização automática.
- **Metas Financeiras**: Planejamento e acompanhamento de objetivos de longo prazo (viagens, reformas, etc.).
- **Análise de Comportamento**: Insights sobre padrões de consumo e alertas de gastos impulsivos.
- **Dashboards Interativos**: Visualização de tendências e distribuição de gastos por categoria.

### 🛒 Compras e Estoque Doméstico
- **Lista de Compras Dinâmica**: Adição inteligente de itens com níveis de urgência.
- **Controle de Estoque**: Gestão da despensa com previsão de quando os itens irão acabar.
- **Foco Nutricional**: Sugestões de compras alinhadas a metas de saúde (ex: redução de açúcar).
- **Sustentabilidade**: Recomendações de produtos ecológicos e locais.

### 🏠 Rotinas e Agenda Familiar
- **Gestão de Tarefas Advanced**: Organização de limpeza, manutenção e recados com suporte a **recorrências complexas** (diárias, semanais, mensais e anuais).
- **Ajuste Inteligente de Datas**: Correção automática de tarefas agendadas para dias inexistentes (ex: 31 de fevereiro) com notas explicativas.
- **Família e Compartilhamento**: Convide membros da família e gerencie o espaço doméstico de forma colaborativa com permissões de SuperAdmin.
- **Agenda Multimodal**: Registro de eventos sociais sincronizados com as tarefas da casa.

### 🤖 Inteligência Artificial (Aimee Orchestrator)
- **Orquestração de Intenção**: Um núcleo inteligente que detecta intenção e seleciona automaticamente a "Skill" necessária.
- **Comandos Naturais e Tool Calling**: Aimee decide quando invocar ferramentas como `addTransaction` ou `manageRoutines` de forma autônoma.
- **Context Awareness**: A IA possui visibilidade do estado atual da casa (tarefas pendentes, gastos recentes) para oferecer respostas personalizadas.
- **Personas Customizáveis**: Perfis que alteram o tom de voz e a prioridade de insights.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend/API**: Express (Full-stack mode com `tsx`)
- **Estilização**: Tailwind CSS 4
- **Animações**: Motion (formely Framer Motion)
- **IA/Orchestration**: Google GenAI SDK (`gemini-3-flash-preview`)
- **Persistência**: Firebase Firestore & Auth
- **Utilidade**: `date-fns` para lógica de recorrência complexa

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma conta no [Firebase](https://console.firebase.google.com/)
- Uma chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)

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
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Preencha as variáveis:
   - `GEMINI_API_KEY`: Sua chave da API do Gemini.
   - `APP_URL`: URL local (geralmente `http://localhost:3000`).

4. **Configure o Firebase:**
   - Crie um projeto no Firebase Console.
   - Ative o **Firestore Database** e o **Authentication** (Google Provider).
   - Crie um arquivo `firebase-applet-config.json` na raiz com suas credenciais:
     ```json
     {
       "apiKey": "SUA_API_KEY",
       "authDomain": "SEU_AUTH_DOMAIN",
       "projectId": "SEU_PROJECT_ID",
       "appId": "SEU_APP_ID",
       "firestoreDatabaseId": "(default)"
     }
     ```

## 💻 Executando Localmente

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`.

## 🐳 Executando com Docker

Se você prefere usar Docker, pode iniciar a aplicação facilmente:

1. **Certifique-se de ter o Docker e Docker Compose instalados.**
2. **Configure o arquivo `.env` e `firebase-applet-config.json`** conforme as instruções acima.
3. **Inicie os containers:**
   ```bash
   docker-compose up --build
   ```

A aplicação estará disponível em `http://localhost:3000`. O volume está configurado para refletir alterações no código em tempo real (Hot Reload).

## 🏗️ Estrutura do Projeto (Clean Architecture)

- `src/domain/`: Entidades básicas e regras de negócio puras (`BaseEntity`, etc.).
- `src/infrastructure/`: Implementações técnicas e integrações:
  - `llm/`: Orquestrador Aimee e lógica de seleção de modelos.
  - `tools/`: Definições de ferramentas disponíveis para a IA (Function Calling).
- `src/services/`: Serviços de aplicação que coordenam Firebase e UI.
- `src/components/`: Interface do usuário modularizada e gamificada.
- `src/lib/`: Utilitários e configurações (recurrence, logger, shadcn).

## 📜 Versão e Histórico

A Aimee segue o projeto de versionamento semântico. 

- **Versão Atual**: 1.0.0
- **Histórico de Mudanças**: Veja o arquivo [CHANGELOG.md](./CHANGELOG.md) para detalhes de todas as atualizações.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
*Lembre-se: Aimee é uma assistente baseada em IA. Valide dados críticos antes de tomar decisões financeiras importantes.*
