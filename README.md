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
- **Gestão de Tarefas**: Organização de limpeza, manutenção e recados domésticos.
- **Agenda Compartilhada**: Registro de eventos sociais, feriados e compromissos da família.
- **Insights Cruzados**: Correlação entre agenda e finanças para prever gastos em semanas movimentadas.

### 🤖 Inteligência Artificial (Aimee)
- **Personas Customizáveis**: Escolha entre os perfis *Divertida*, *Analítica* ou *Econômica*.
- **Comandos Naturais**: Processamento de pedidos complexos em uma única frase.
- **Proatividade**: Alertas baseados em contexto externo (clima, feriados, sazonalidade).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Estilização**: Tailwind CSS 4
- **Animações**: Motion (Framer Motion)
- **Gráficos**: Recharts
- **Backend/Database**: Firebase (Firestore, Auth)
- **IA**: Google Gemini API (@google/genai)
- **Ícones**: Lucide React

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

## 🏗️ Estrutura do Projeto

- `src/components/`: Componentes reutilizáveis da interface.
- `src/services/`: Lógica de integração com a IA (Gemini) e Firebase.
- `src/types/`: Definições de interfaces TypeScript.
- `src/lib/`: Configurações de bibliotecas (Firebase, Utils).
- `firestore.rules`: Regras de segurança do banco de dados.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
*Lembre-se: Aimee é uma assistente baseada em IA. Valide dados críticos antes de tomar decisões financeiras importantes.*
