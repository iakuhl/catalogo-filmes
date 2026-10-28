# Acervo — Catálogo de Filmes

CRUD de filmes feito com **React**, publicado na **Vercel** e com banco de dados **Postgres no Neon**.

Cada filme tem: título, ano de lançamento, duração (em minutos), nome do diretor, um ou mais gêneros e elenco opcional (até 50 atores). Cada filme também tem dois identificadores:

- **ID (nosso ID)**: a numeração própria do catálogo. É gerado automaticamente ao criar o filme, aparece no site e é usado para ler, alterar e remover. Vem de uma sequência separada e nunca reaproveita o número de um filme excluído.
- **ID no banco**: o id interno da tabela (chave primária), mostrado apenas na tela Ler.

## Telas

| Tela | Rota | O que faz |
|---|---|---|
| **Início** | `/` | Menu superior e a lista de filmes (ID e título), 25 por página, com atalho para os próximos 25. Cada item da lista inteiro, borda e conteúdo, é clicável e abre a tela Ler. |
| **Ler** | `/ler/:codigo` | Todos os dados do filme escolhido no início, com o botão **Voltar**. |
| **Criar** | `/criar` | Formulário com os botões **Criar** e **Cancelar**. Ao criar, volta ao início e informa o ID gerado. Se houver erro, ele aparece na tela e o usuário continua no formulário. |
| **Alterar** | `/alterar` | Começa só com a busca por ID e o botão **Voltar**. Depois que o filme é encontrado, aparecem os dados editáveis e o botão **Salvar** (renderização condicional). |
| **Remover** | `/remover` | Igual ao Alterar, mas mostra os dados do filme e o botão vermelho **Excluir**. Antes de excluir, pede confirmação e avisa que a operação é irreversível. |

O menu superior (Criar, Alterar, Remover) fica fixo no topo em todas as telas, e o logo leva ao início. As telas Alterar e Remover guardam o ID buscado no endereço (ex.: `/alterar?codigo=7`), então a busca continua valendo se a página for recarregada.

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
banco/schema.sql                Criação da tabela e da sequência do nosso ID
banco/dados-exemplo.sql         Filmes de exemplo (opcional)
scripts/executarSql.js          Executa um arquivo .sql no Neon
src/
  main.jsx, App.jsx             Entrada do React e rotas
  index.css                     Paleta de cores, tipografia e estilos globais
  servicos/                     Axios e funções da API de filmes
  hooks/useFilme.js             Busca de um filme pelo ID (telas Ler, Alterar e Remover)
  utilitarios/                  Formatação (duração) e cores dos gêneros
  componentes/<Nome>/           Componentes (.jsx + .css)
  paginas/<Nome>/               Telas: Inicio, Ler, Criar, Alterar, Remover
vercel.json                     Encaminha /api/* para a função e o resto para o React
vite.config.js                  Faz o `npm run dev` atender /api/* com a mesma função
```

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

Base: `/api`. O `:codigo` é o **nosso ID**, não o id interno do banco.

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/filmes?pagina=1` | Uma página da lista (25 filmes, só ID e título) | 200 |
| POST | `/api/filmes` | Cria um filme (o ID é gerado automaticamente) | 201 |
| GET | `/api/filmes/:codigo` | Busca um filme | 200 |
| PUT | `/api/filmes/:codigo` | Altera um filme (o ID não muda) | 200 |
| DELETE | `/api/filmes/:codigo` | Exclui um filme | 204 |

Resposta da lista:

```json
{
  "filmes": [{ "codigo": 1, "titulo": "O Poderoso Chefão" }],
  "pagina": 1,
  "porPagina": 25,
  "total": 7,
  "totalPaginas": 1
}
```

Corpo do POST e do PUT (o filme completo volta com `id` e `codigo`):

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

Outros status: **400** para ID ou página inválidos e JSON malformado, **404** para filme ou rota inexistente, **405** para método não permitido e **500** para erro no servidor.

### Regras de validação

| Campo | Regra |
|---|---|
| ID | Gerado pelo banco; na busca, número inteiro positivo |
| Título | Obrigatório, até 200 caracteres |
| Ano de lançamento | Inteiro entre 1888 e o ano atual + 5 |
| Duração | Inteiro de 1 a 999 minutos |
| Diretor | Obrigatório, até 150 caracteres |
| Gêneros | Pelo menos 1, todos da lista: Ação, Animação, Aventura, Comédia, Documentário, Drama, Faroeste, Fantasia, Ficção científica, Guerra, Musical, Policial, Romance, Suspense, Terror |
| Elenco | Opcional; até 50 nomes de até 100 caracteres, sem repetição |

Os mesmos limites também estão garantidos no banco (`CHECK` e `UNIQUE` em [banco/schema.sql](banco/schema.sql)).
