import {
  buscarPagina,
  buscarPorCodigo,
  inserir,
  atualizar,
  excluir,
} from "../servidor/filmesRepositorio.js";
import {
  FILMES_POR_PAGINA,
  ehCodigoValido,
  normalizarFilme,
  validarFilme,
} from "../compartilhado/regrasFilme.js";

// Ponto de entrada da API. Na Vercel este arquivo vira uma Function, e o
// vercel.json encaminha para ela todas as requisições /api/*.
// O :codigo é o nosso ID (a numeração própria), não o id interno do banco.
//
//   GET    /api/filmes?pagina=1   lista 25 filmes por página (nosso ID e título)
//   POST   /api/filmes            cadastra um filme (o nosso ID é gerado na hora)
//   GET    /api/filmes/:codigo    busca um filme
//   PUT    /api/filmes/:codigo    altera um filme
//   DELETE /api/filmes/:codigo    exclui um filme

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

const filmeNaoEncontrado = (codigo) =>
  responder(404, { mensagem: `Não existe filme com o ID ${codigo}.` });

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

// GET /api/filmes?pagina=N
async function listar(url) {
  const textoPagina = url.searchParams.get("pagina") ?? "1";

  if (!/^\d{1,6}$/.test(textoPagina) || Number(textoPagina) < 1) {
    return responder(400, { mensagem: "Página inválida." });
  }

  const pagina = Number(textoPagina);
  const { filmes, total } = await buscarPagina(pagina, FILMES_POR_PAGINA);

  return responder(200, {
    filmes,
    pagina,
    porPagina: FILMES_POR_PAGINA,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / FILMES_POR_PAGINA)),
  });
}

async function rotear(requisicao) {
  const url = new URL(requisicao.url);

  // "/api/filmes/7" → recurso = "filmes", codigo = "7"
  const [recurso, codigo, ...resto] = url.pathname.replace(/^\/api/, "").split("/").filter(Boolean);

  if (recurso !== "filmes" || resto.length > 0) {
    return responder(404, { mensagem: "Rota não encontrada." });
  }

  // /api/filmes
  if (codigo === undefined) {
    switch (requisicao.method) {
      case "GET":
        return listar(url);
      case "POST":
        return responder(201, await inserir(await lerFilme(requisicao)));
      default:
        return metodoNaoPermitido("GET, POST");
    }
  }

  // /api/filmes/:codigo
  if (!ehCodigoValido(codigo)) {
    return responder(400, { mensagem: "ID de filme inválido." });
  }
  const codigoFilme = Number(codigo);

  switch (requisicao.method) {
    case "GET": {
      const filme = await buscarPorCodigo(codigoFilme);
      return filme ? responder(200, filme) : filmeNaoEncontrado(codigoFilme);
    }
    case "PUT": {
      const filme = await atualizar(codigoFilme, await lerFilme(requisicao));
      return filme ? responder(200, filme) : filmeNaoEncontrado(codigoFilme);
    }
    case "DELETE":
      return (await excluir(codigoFilme)) ? responder(204) : filmeNaoEncontrado(codigoFilme);
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
