import api from "./api";

// Funções que conversam com a API de filmes.
// Cada uma devolve só os dados (resposta.data) para quem chamou.

export async function listarFilmes() {
  const resposta = await api.get("/filmes");
  return resposta.data;
}

export async function buscarFilme(id) {
  const resposta = await api.get(`/filmes/${id}`);
  return resposta.data;
}

export async function criarFilme(filme) {
  const resposta = await api.post("/filmes", filme);
  return resposta.data;
}

export async function atualizarFilme(id, filme) {
  const resposta = await api.put(`/filmes/${id}`, filme);
  return resposta.data;
}

export async function excluirFilme(id) {
  await api.delete(`/filmes/${id}`);
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

// O filme não existe (404) ou o id do endereço é inválido, como em /filmes/abc (400)
export const filmeNaoExiste = (erro) => [400, 404].includes(erro.response?.status);
