import api from "./api";

// Funções que conversam com a API de filmes.
// O "codigo" é o nosso ID (a numeração própria que aparece no site).
// Cada função devolve só os dados (resposta.data) para quem chamou.

// Uma página do catálogo:
// { filmes: [{ codigo, titulo }], pagina, porPagina, total, totalPaginas }
export async function listarFilmes(pagina) {
  const resposta = await api.get("/filmes", { params: { pagina } });
  return resposta.data;
}

export async function buscarFilme(codigo) {
  const resposta = await api.get(`/filmes/${codigo}`);
  return resposta.data;
}

export async function criarFilme(filme) {
  const resposta = await api.post("/filmes", filme);
  return resposta.data;
}

export async function atualizarFilme(codigo, filme) {
  const resposta = await api.put(`/filmes/${codigo}`, filme);
  return resposta.data;
}

export async function excluirFilme(codigo) {
  await api.delete(`/filmes/${codigo}`);
}

// Transforma um erro do Axios em uma mensagem para mostrar na tela
export function mensagemDeErro(erro) {
  if (erro.response?.data?.mensagem) {
    return erro.response.data.mensagem;
  }
  if (erro.response) {
    return `O servidor respondeu com um erro (${erro.response.status}).`;
  }
  return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}

// O filme não existe (404) ou o ID é inválido, como em /ler/abc (400)
export const filmeNaoExiste = (erro) => [400, 404].includes(erro.response?.status);
