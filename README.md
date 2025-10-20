# Fynli - Controle Financeiro Pessoal

![Badge de Status](https://img.shields.io/badge/status-MVP%201.0%20Concluído-brightgreen)
![Badge da Vercel](https://vercel.com/api/v1/projects/YOUR_PROJECT_ID/latest-deployment?framework=next.js&label=deploy&logo=vercel)
![Badge da Licença](https://img.shields.io/badge/license-MIT-blue)

**Acesse o projeto ao vivo:** [**fynli.vercel.app**](https://fynli.vercel.app)

![Print do Fynli](https://i.imgur.com/SEU_LINK_DE_IMAGEM_AQUI.png)

---

## 💡 Sobre o Projeto

O Fynli é uma aplicação web de finanças pessoais que nasceu de um problema real: como organizar os gastos quando você usa sua própria conta bancária para fazer compras para outras pessoas (família, amigos, etc.)?

Diferente de apps de divisão de contas (focados em "quem deve a quem"), o Fynli foca em **"para onde foi o dinheiro?"**. Ele permite que o usuário crie perfis de gastos, categorize transações e, o mais importante, lide com **parcelamentos** de forma inteligente, distribuindo o custo ao longo dos meses para um fluxo de caixa preciso.

Este projeto foi construído com uma stack moderna e foca em performance, segurança de dados e uma experiência de usuário reativa e fluida.

## ✨ Funcionalidades Principais

O MVP 1.0 está completo e inclui o ciclo de vida completo de um usuário:

* **Autenticação Completa:** Fluxo de cadastro com verificação por **OTP via e-mail**, login com E-mail/Senha e login social (Google). Inclui um fluxo seguro de recuperação de senha também por OTP.
* **Segurança (RLS):** **Row Level Security (RLS)** do Supabase ativada em todas as tabelas. É criptograficamente impossível para um usuário ver ou modificar dados que não sejam seus.
* **Gerenciamento de Perfis (Pessoas):** CRUD completo para criar perfis de gastos (ex: "Eu Mesmo", "Mãe", "Casa"), cada um com uma cor personalizada.
* **Gerenciamento de Categorias:** CRUD completo para categorias. O sistema inclui categorias globais imutáveis (ex: "Supermercado") e permite ao usuário criar, editar e deletar as suas próprias, com ícones e cores personalizadas.
* **Lançamento de Despesas (A "Feature Matadora"):**
    * **Parcelamento Inteligente:** O modal de "Adicionar Gasto" permite lançar uma compra em N parcelas. O sistema cria automaticamente N registros no banco, um para cada mês subsequente.
    * **Criação Rápida:** O usuário pode criar novos Perfis ou Categorias de dentro do próprio modal de despesa, sem interromper o fluxo.
* **Dashboard Dinâmico:**
    * **Cards e Gráficos:** Componentes de `Cards`, Gráfico de Barras e Gráfico de Rosca que buscam dados agregados.
    * **Reatividade Total:** Os filtros de Ano/Mês controlam todos os componentes do dashboard (Cards e Gráficos). Adicionar uma nova despesa revalida todos os dados da UI instantaneamente, sem precisar de F5.
    * **Filtros Inteligentes:** Os seletores de data são dinâmicos, mostrando apenas os anos e meses em que o usuário realmente possui dados.
* **Tabela de Transações Avançada:**
    * **Design Híbrido:** Em telas desktop, exibe uma tabela profissional (`@tanstack/react-table`) com filtros, ordenação e paginação.
    * **Responsividade:** Em telas móveis, a tabela se transforma em uma lista de "Cards de Transação" com **rolagem infinita**.
* **Página de Configurações:** Permite ao usuário atualizar seu nome de exibição e alterar sua senha com segurança.
* **Automações de Backend:**
    * **Gatilho SQL:** Cria categorias padrão para cada novo usuário no momento do cadastro.
    * **Cron Job:** Uma tarefa agendada que limpa automaticamente contas de usuários que não se verificaram após 24h, mantendo o banco de dados saudável.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as ferramentas mais modernas do ecossistema full-stack.

### **Frontend**
* **Framework:** Next.js 15 (App Router)
* **Linguagem:** TypeScript
* **UI:** Tailwind CSS
* **Componentes:** Shadcn/UI
* **Estado & Cache de Dados:** SWR (para data-fetching reativo e sem "piscar")
* **Formulários:** Formik & Yup (para gerenciamento de estado e validação)
* **Gráficos:** `react-chartjs-2`
* **Animação:** `framer-motion` (na página de demonstração)

### **Backend & Banco de Dados (Supabase)**
* **Autenticação:** Supabase Auth (incluindo OAuth e OTP)
* **Banco de Dados:** Supabase (PostgreSQL)
* **Segurança:** Row Level Security (RLS)
* **API:** Funções RPC em SQL (`get_dashboard_stats`, etc.) para cálculos pesados no servidor.
* **Automação:** Cron Jobs e Triggers de Banco de Dados.

### **Deployment**
* **Hospedagem:** Vercel

## 🛠️ Como Executar o Projeto Localmente

Para rodar o Fynli na sua máquina, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/fynli.git](https://github.com/SEU_USUARIO/fynli.git)
    cd fynli
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Configure o Supabase:**
    * Crie um novo projeto no [Supabase](https://supabase.com/).
    * Vá para `SQL Editor` e rode os scripts SQL (que estão na pasta `/sql` deste projeto) para criar as tabelas, funções e políticas de segurança.
    * Ative a extensão `pg_cron` em `Database > Extensions`.

4.  **Configure as Variáveis de Ambiente:**
    * Na raiz do projeto, crie um arquivo `.env.local` e `.env.production.local`.
    * Copie o conteúdo de `.env.example` para dentro deles.
    * Preencha com as suas chaves do Supabase (Project URL, Anon Key, e Service Role Key).

5.  **Rode o projeto:**
    ```bash
    yarn dev
    ```

## 🗺️ Roadmap Futuro (Próximas Features)

O Fynli é um projeto vivo. Os próximos passos incluem:

* [ ] **Lançamento em Lote:** Uma nova tela para adicionar múltiplas despesas de uma vez, otimizada para quem quer organizar um extrato bancário.
* [ ] **Módulo de Orçamentos:** Implementar a tabela `budgets` para que o usuário possa definir tetos de gastos por categoria ou perfil.
* [ ] **Anexar Comprovantes:** Usar o Supabase Storage para permitir o upload de recibos em cada transação.

## 👨‍💻 Autor

**Thomás D'Angelo de Almeida Gomes**

* [LinkedIn](https://www.linkedin.com/in/SEU_LINKEDIN_AQUI)
* [GitHub](https://github.com/SEU_USUARIO)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.