import { banco } from "./banco.js";

// Consultas SQL da tabela filmes.
// No banco as colunas usam snake_case (ano_lancamento); no JSON da API,
// camelCase (anoLancamento). Esta função faz a tradução.
const paraFilme = (linha) => ({
  id: linha.id,
  titulo: linha.titulo,
  anoLancamento: linha.ano_lancamento,
  duracaoMinutos: linha.duracao_minutos,
  diretor: linha.diretor,
  generos: linha.generos,
  elenco: linha.elenco,
});

// Mais recentes primeiro
export async function buscarTodos() {
  const linhas = await banco()`SELECT * FROM filmes ORDER BY id DESC`;
  return linhas.map(paraFilme);
}

export async function buscarPorId(id) {
  const [linha] = await banco()`SELECT * FROM filmes WHERE id = ${id}`;
  return linha ? paraFilme(linha) : null;
}

// Arrays do JavaScript (generos, elenco) viram arrays do Postgres (TEXT[])
export async function inserir(filme) {
  const [linha] = await banco()`
    INSERT INTO filmes (titulo, ano_lancamento, duracao_minutos, diretor, generos, elenco)
    VALUES (${filme.titulo}, ${filme.anoLancamento}, ${filme.duracaoMinutos},
            ${filme.diretor}, ${filme.generos}, ${filme.elenco})
    RETURNING *`;
  return paraFilme(linha);
}

// Devolve null quando não existe filme com esse id
export async function atualizar(id, filme) {
  const [linha] = await banco()`
    UPDATE filmes SET
      titulo          = ${filme.titulo},
      ano_lancamento  = ${filme.anoLancamento},
      duracao_minutos = ${filme.duracaoMinutos},
      diretor         = ${filme.diretor},
      generos         = ${filme.generos},
      elenco          = ${filme.elenco}
    WHERE id = ${id}
    RETURNING *`;
  return linha ? paraFilme(linha) : null;
}

// Devolve true se algum filme foi excluído
export async function excluir(id) {
  const linhas = await banco()`DELETE FROM filmes WHERE id = ${id} RETURNING id`;
  return linhas.length > 0;
}
