# Acervo — Catálogo de Filmes

CRUD de filmes feito com **React**, publicado na **Vercel** e com banco de dados **Postgres no Neon**.

Cada filme tem: título, ano de lançamento, duração (em minutos), nome do diretor, um ou mais gêneros, elenco opcional (até 50 atores) e um id gerado pelo banco.

## Funcionalidades

- **Catálogo** com todos os filmes (os mais recentes primeiro).
- **Detalhes** de cada filme, com a ficha técnica e o elenco completo.
- **Cadastro** e **edição** no mesmo formulário, com validação campo a campo.
- **Exclusão** com janela de confirmação.
- **Gêneros**: escolha de um ou mais numa lista fixa.
- **Elenco** opcional: adicione nomes com Enter ou com o botão "Adicionar", e remova com "×". Há um contador `n/50`, e nomes repetidos são recusados.
- As **mesmas regras de validação** valem no formulário e na API ([compartilhado/regrasFilme.js](compartilhado/regrasFilme.js)).

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Interface | HTML, CSS puro, React 19 |
| Rotas | React Router DOM 7 |
| Requisições HTTP | Axios |
| Desenvolvimento e build | Vite 8 |
| API | Vercel Functions (Node.js) |
| Banco de dados | Neon (Postgres) via `@neondatabase/serverless` |

O projeto não usa JSON Server, TypeScript, Tailwind nem bibliotecas de componentes.

## Estrutura

```
api/index.js                    Função da Vercel: recebe todas as requisições /api/*
servidor/banco.js               Conexão com o Neon (DATABASE_URL)
servidor/filmesRepositorio.js   Consultas SQL da tabela filmes
compartilhado/regrasFilme.js    Gêneros, limites e validação (usado no front e na API)
banco/schema.sql                Criação da tabela
banco/dados-exemplo.sql         Filmes de exemplo (opcional)
scripts/executarSql.js          Executa um arquivo .sql no Neon
src/
  main.jsx, App.jsx             Entrada do React e rotas
  index.css                     Paleta de cores, tipografia e estilos globais
  servicos/                     Axios e funções da API de filmes
  hooks/useFilme.js             Busca de um filme por id
  utilitarios/                  Formatação (duração) e cores dos gêneros
  componentes/<Nome>/           Componentes (.jsx + .css)
  paginas/<Nome>/               Páginas de cada rota
vercel.json                     Encaminha /api/* para a função e o resto para o React
vite.config.js                  Faz o `npm run dev` atender /api/* com a mesma função
```

### Rotas do site

| Rota | Página |
|---|---|
| `/` | Catálogo |
| `/filmes/novo` | Cadastro |
| `/filmes/:id` | Detalhes |
| `/filmes/:id/editar` | Edição |

## Como rodar localmente

Pré-requisitos: **Node.js 20.19+ ou 22.12+** e um banco no Neon (veja [Deploy](#deploy-na-vercel-com-neon), passo 2).

```bash
npm install
```

Copie `.env.example` para **`.env.local`** e coloque a string de conexão do Neon:

```
DATABASE_URL="postgresql://usuario:senha@ep-xxxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

Crie a tabela. É preciso fazer isso só uma vez, e o segundo comando, opcional, cadastra 7 filmes de exemplo:

```bash
npm run banco:criar
npm run banco:exemplos
```

Inicie o site:

```bash
npm run dev
```

Acesse **http://localhost:5173**. O `npm run dev` também atende a API em `/api`, porque o `vite.config.js` encaminha essas requisições para a mesma função usada na Vercel. Não é preciso instalar o Vercel CLI.

> O arquivo `.env.local` está no `.gitignore`: a string de conexão do banco nunca vai para o GitHub.

## Deploy na Vercel (com Neon)

1. **Importar o projeto**: em [vercel.com/new](https://vercel.com/new), escolha este repositório do GitHub. O preset **Vite** é detectado automaticamente, então não é preciso mudar nada. Clique em **Deploy**.
2. **Criar o banco**: no projeto da Vercel, abra **Storage → Create Database → Neon** e conecte ao projeto. A região sugerida é *Washington, D.C. (us-east-1)*, a mesma das Functions. Isso cria a variável **`DATABASE_URL`** nos ambientes do projeto.
   - Alternativa: crie o banco em [neon.com](https://neon.com), copie a string de conexão e adicione em **Settings → Environment Variables** com o nome `DATABASE_URL`.
3. **Criar a tabela**: abra o banco no Neon (**Open in Neon → SQL Editor**), cole o conteúdo de [banco/schema.sql](banco/schema.sql) e clique em **Run**. Se quiser filmes de exemplo, repita com [banco/dados-exemplo.sql](banco/dados-exemplo.sql). Outra opção é rodar `npm run banco:criar` localmente com a mesma `DATABASE_URL`.
4. **Redeploy**: em **Deployments**, faça um *Redeploy*. Variáveis novas só valem para deploys feitos depois delas.

A partir daí, cada `git push` para a branch `main` gera um novo deploy automaticamente.

## API

Base: `/api`

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/filmes` | Lista todos os filmes | 200 |
| POST | `/api/filmes` | Cadastra um filme | 201 |
| GET | `/api/filmes/:id` | Busca um filme | 200 |
| PUT | `/api/filmes/:id` | Altera um filme | 200 |
| DELETE | `/api/filmes/:id` | Exclui um filme | 204 |

Corpo do POST e do PUT:

```json
{
  "titulo": "Central do Brasil",
  "anoLancamento": 1998,
  "duracaoMinutos": 113,
  "diretor": "Walter Salles",
  "generos": ["Drama"],
  "elenco": ["Fernanda Montenegro", "Vinícius de Oliveira"]
}
```

Erros respondem com `{ "mensagem": "..." }`. Erros de validação (400) também trazem `erros`, com uma mensagem por campo:

```json
{ "mensagem": "Confira os dados do filme.", "erros": { "anoLancamento": "Informe um ano entre 1888 e 2031." } }
```

Outros status: **400** para id inválido ou JSON malformado, **404** para filme ou rota inexistente, **405** para método não permitido e **500** para erro no servidor.

### Regras de validação

| Campo | Regra |
|---|---|
| Título | Obrigatório, até 200 caracteres |
| Ano de lançamento | Inteiro entre 1888 e o ano atual + 5 |
| Duração | Inteiro de 1 a 999 minutos |
| Diretor | Obrigatório, até 150 caracteres |
| Gêneros | Pelo menos 1, todos da lista: Ação, Animação, Aventura, Comédia, Documentário, Drama, Faroeste, Fantasia, Ficção científica, Guerra, Musical, Policial, Romance, Suspense, Terror |
| Elenco | Opcional; até 50 nomes de até 100 caracteres, sem repetição |

Os mesmos limites também estão garantidos no banco (`CHECK` em [banco/schema.sql](banco/schema.sql)).
