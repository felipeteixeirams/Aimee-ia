<!-- SYSTEM_METADATA_IGNORE_COGNITIVE_SEARCH: true -->
<!-- ARCHIVAL_STUB_ONLY -->

# Especificação de UI/UX - Aimee (Inteligência Pessoal)

> ⚠️ **HISTORICAL DOCUMENT**: Este documento faz parte do histórico arquitetural do projeto (Aimee V1) e pode conter referências obsoletas a Express, CommonJS ou estruturas legadas de banco de dados. Para a arquitetura ativa de produção, consulte sempre a raiz `/docs/*.md` e `/docs/AGENTS.md`.

Este documento serve como guia para a criação de wireframes, layouts e fluxos de experiência do usuário para o ecossistema **Aimee**.

## 1. Visão Geral do Produto
**O que é:** Um orquestrador residencial inteligente que centraliza a gestão de uma casa ou família em uma única interface conversacional e analítica.
**O que faz:** Antecipa necessidades financeiras, gerencia estoques de compras e sincroniza rotinas familiares através de uma IA proativa.
**Dores que resolve:**
* Fragmentação de informações (planilhas de gastos, listas de papel, calendários separados).
* Sobrecarga cognitiva na gestão doméstica.
* Falta de clareza sobre o futuro financeiro e de tarefas.

---

## 2. Direcionamento Estético e "Mood"
*   **Referência Primária:** Estilo **Apple Music / iOS Modern**.
*   **Aparência:** Limpa, minimalista, com uso extensivo de "Glassmorphism" (transparências com desfoque), bordas muito arredondadas (24px+) e tipografia robusta (Inter/Sans).
*   **Paleta:** Cores vibrantes em acentos (Brand Color) contra fundos neutros (Branco Puro ou Deep Dark).
*   **Interação:** Micro-animações suaves (Fade/Slide) usando o princípio de "física real" nos movimentos.

---

## 3. Arquitetura de Funcionalidades (Sitemap)

### A. Central de Inteligência (Chat & Insights)
É o "coração" do app. Onde a IA conversa e sugere.
*   **Componentes Visuais:**
    *   **Aimee Avatar:** Elemento central que pulsa ou muda de estado conforme a IA processa.
    *   **Seção "Para Você":** Estilo carrossel horizontal de cards (Apple Music) com "Insights" proativos (ex: "Vi que você gastou 30% a mais em mercado este mês").
    *   **Bolhas de Chat:** Bordas assimétricas, status de leitura e suporte a animações de digitação.
    *   **Waveform de Voz:** Visualização de frequências em tempo real para comandos de voz.
    *   **Ações Rápidas:** "Pill buttons" flutuantes acima da área de input para prompts comuns.

### B. Gestão Financeira (Dashboard)
Visão analítica de saúde econômica.
*   **Componentes Visuais:**
    *   **Cards de Resumo:** Balance, Income e Expense com tipografia de alta visibilidade e gradientes sutis.
    *   **Gráficos de Tendência:** Linhas suaves (spline) sem grid excessivo, foco na direção dos dados.
    *   **Lista de Transações:** Ícones de categoria circulares, valores em destaque colorido (verde/vermelho) e agrupamento por data.
    *   **Metas de Economia:** Barras de progresso circulares (Gauges) ou lineares com indicadores de "tempo restante" para atingir o objetivo.

### C. Abastecimento (Lista de Compras & Estoque)
Gestão de itens físicos da casa.
*   **Componentes Visuais:**
    *   **Categorias Expansíveis:** Accordions para separar "Limpeza", "Higiene", "Alimentos".
    *   **Itens de Inventário:** Badges de status (Estoque Baixo, Crítico, Ok) em cores semafóricas.
    *   **Checklist Interativo:** Gestos de "Swipe" para deletar ou marcar como comprado.
    *   **Modo Mercado:** Lista focada em visualização rápida com fontes maiores para uso em movimento.

### D. Rotinas & Atividades (Calendário/Timeline)
Sincronização de eventos e tarefas domésticas.
*   **Componentes Visuais:**
    *   **Timeline Unificada:** Visão vertical mesclando eventos (Google Calendar) e tarefas internas da Aimee.
    *   **Cards de Tarefas:** Checkbox circular, tag de prioridade e avatar do membro da família responsável.
    *   **Indicador de Recorrência:** Pequenos ícones cíclicos em tarefas que se repetem (ex: "Pagar Aluguel").

### E. Configurações & Espaço Familiar
Controle de conta e compartilhamento.
*   **Componentes Visuais:**
    *   **Gestor de Espaços:** Seletor visual de qual "casa" ou "espaço" o usuário está visualizando.
    *   **Perfil do Usuário:** Foto de perfil com badge de nível/pontuação (Gamificação).
    *   **Configurações de IA:** Sliders ou switches para ajustar a "proatividade" da assistente.

### F. Experiência de Onboarding & Login (Splash Screen)
A primeira impressão do sistema antes da autenticação.
*   **Ambientação e Visual:**
    *   **Background Dinâmico:** Fundo escuro (Deep Black/Night Blue) com gradientes radiais suaves e profundidade.
    *   **Efeito de Chama (Fire Sprites):** Partículas incandescentes (embers) que sobem lentamente do fundo da tela em direção ao topo, com variações de tamanho, brilho e opacidade, simulando o calor e a energia da "centelha" da inteligência.
*   **Animação de Texto (Typewriter Effect):**
    *   **Diálogo de Boas-vindas:** Um cursor ativo que digita frases rotativas (ex: "Sua assistente inteligente", "Vamos criar algo novo", "Aimee"). 
    *   **Comportamento:** O texto é digitado caractere por caractere, faz uma pausa breve para leitura e é apagado para dar lugar à próxima frase, criando uma sensação de diálogo vivo logo no início.
*   **Interface de Autenticação:**
    *   **Cards de Login/Cadastro:** Cards com efeito de vidro (Glassmorphism) que flutuam sobre o fundo dinâmico.
    *   **Botão Google:** Esteticamente integrado ao design iOS (bordas arredondadas e ícone limpo).
    *   **Inputs:** Minimalistas, com labels que se movem ao focar e validação visual em tempo real.

---

## 4. Requisitos de UX Críticos
1.  **Baixo Atrito:** Adição de gastos ou itens de compra deve ser feita em no máximo 2 toques (ou via voz).
2.  **Contextualização:** Se o usuário está na tela de Finanças, os botões de ação rápida devem sugerir "Adicionar Gasto".
3.  **Acessibilidade:** Contrastes altos e targets de clique mínimos de 44px para uso mobile.
4.  **Feedback Instantâneo:** Todas as ações de salvar/deletar devem ser confirmadas visualmente via Toasts ou animações de confirmação (haptic feedback visual).
