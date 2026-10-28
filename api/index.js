import { buscarTodos, buscarPorId, inserir, atualizar, excluir } from "../servidor/filmesRepositorio.js";
import { normalizarFilme, validarFilme } from "../compartilhado/regrasFilme.js";

// Ponto de entrada da API. Na Vercel este arquivo vira uma Function, e o
// vercel.json encaminha para ela todas as requisições /api/*.
//
//   GET    /api/filmes        lista todos os filmes
//   POST   /api/filmes        cadastra um filme
//   GET    /api/filmes/:id    busca um filme
//   PUT    /api/filmes/:id    altera um filme
//   DELETE /api/filmes/:id    exclui um filme

// Erro "esperado" (ex.: dados inválidos), que vira uma resposta com esse status
class ErroDaRequisicao extends Error {
  constructor(status, corpo) {
    super(corpo.mensagem);
    this.status = status;
    this.corpo = corpo;
  }
}

// Monta a resposta em JSON (ou vazia, quando não há dados, como no 204)
const responder = (status, dados, cabecalhos = {}) => {
  const headers = { "Cache-Control": "no-store", ...cabecalhos };
  return dados === undefined
    ? new Response(null, { status, headers })
    : Response.json(dados, { status, headers });
};

const filmeNaoEncontrado = () => responder(404, { mensagem: "Filme não encontrado." });

const metodoNaoPermitido = (permitidos) =>
  responder(405, { mensagem: "Método não permitido." }, { Allow: permitidos });

// Lê o filme enviado no corpo da requisição, normaliza e valida
async function lerFilme(requisicao) {
  const dados = await requisicao.json().catch(() => null);

  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
    throw new ErroDaRequisicao(400, { mensagem: "Envie os dados do filme em formato JSON." });
  }

  const filme = normalizarFilme(dados);
  const erros = validarFilme(filme);

  if (Object.keys(erros).length > 0) {
    throw new ErroDaRequisicao(400, { mensagem: "Confira os dados do filme.", erros });
  }

  return filme;
}

async function rotear(requisicao) {
  const { pathname } = new URL(requisicao.url);

  // "/api/filmes/7" → recurso = "filmes", id = "7"
  const [recurso, id, ...resto] = pathname.replace(/^\/api/, "").split("/").filter(Boolean);

  if (recurso !== "filmes" || resto.length > 0) {
    return responder(404, { mensagem: "Rota não encontrada." });
  }

  // /api/filmes
  if (id === undefined) {
    switch (requisicao.method) {
      case "GET":
        return responder(200, await buscarTodos());
      case "POST":
        return responder(201, await inserir(await lerFilme(requisicao)));
      default:
        return metodoNaoPermitido("GET, POST");
    }
  }

  // /api/filmes/:id (até 9 dígitos, para caber no INTEGER do Postgres)
  if (!/^\d{1,9}$/.test(id)) {
    return responder(400, { mensagem: "ID de filme inválido." });
  }
  const idFilme = Number(id);

  switch (requisicao.method) {
    case "GET": {
      const filme = await buscarPorId(idFilme);
      return filme ? responder(200, filme) : filmeNaoEncontrado();
    }
    case "PUT": {
      const filme = await atualizar(idFilme, await lerFilme(requisicao));
      return filme ? responder(200, filme) : filmeNaoEncontrado();
    }
    case "DELETE":
      return (await excluir(idFilme)) ? responder(204) : filmeNaoEncontrado();
    default:
      return metodoNaoPermitido("GET, PUT, DELETE");
  }
}

export default {
  async fetch(requisicao) {
    try {
      return await rotear(requisicao);
    } catch (erro) {
      if (erro instanceof ErroDaRequisicao) {
        return responder(erro.status, erro.corpo);
      }

      console.error(erro);
      return responder(500, { mensagem: "Erro interno no servidor. Tente novamente em instantes." });
    }
  },
};
