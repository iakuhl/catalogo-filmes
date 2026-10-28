import { banco } from "./banco.js";

// Consultas SQL da tabela filmes.
// Cada filme tem dois identificadores:
//   id     → id interno do banco (chave primária)
//   codigo → nosso ID, usado no site para ler, alterar e remover
// No banco as colunas usam snake_case (ano_lancamento); no JSON da API,
// camelCase (anoLancamento). Esta função faz a tradução.
const paraFilme = (linha) => ({
  id: linha.id,
  codigo: linha.codigo,
  titulo: linha.titulo,
  anoLancamento: linha.ano_lancamento,
  duracaoMinutos: linha.duracao_minutos,
  diretor: linha.diretor,
  generos: linha.generos,
  elenco: linha.elenco,
});

// Uma página da lista (só nosso ID e título, em ordem de ID) e o total de
// filmes. As duas consultas vão juntas numa transação: uma ida ao banco.
export async function buscarPagina(pagina, porPagina) {
  const sql = banco();
  const pular = (pagina - 1) * porPagina;

  const [filmes, [contagem]] = await sql.transaction([
    sql`SELECT codigo, titulo FROM filmes ORDER BY codigo LIMIT ${porPagina} OFFSET ${pular}`,
    sql`SELECT count(*)::int AS total FROM filmes`,
  ]);

  return { filmes, total: contagem.total };
}

export async function buscarPorCodigo(codigo) {
  const [linha] = await banco()`SELECT * FROM filmes WHERE codigo = ${codigo}`;
  return linha ? paraFilme(linha) : null;
}

// O banco gera o id e o codigo (nossa numeração) automaticamente.
// Arrays do JavaScript (generos, elenco) viram arrays do Postgres (TEXT[]).
export async function inserir(filme) {
  const [linha] = await banco()`
    INSERT INTO filmes (titulo, ano_lancamento, duracao_minutos, diretor, generos, elenco)
    VALUES (${filme.titulo}, ${filme.anoLancamento}, ${filme.duracaoMinutos},
            ${filme.diretor}, ${filme.generos}, ${filme.elenco})
    RETURNING *`;
  return paraFilme(linha);
}

// O codigo não muda na edição. Devolve null quando não existe filme com ele.
export async function atualizar(codigo, filme) {
  const [linha] = await banco()`
    UPDATE filmes SET
      titulo          = ${filme.titulo},
      ano_lancamento  = ${filme.anoLancamento},
      duracao_minutos = ${filme.duracaoMinutos},
      diretor         = ${filme.diretor},
      generos         = ${filme.generos},
      elenco          = ${filme.elenco}
    WHERE codigo = ${codigo}
    RETURNING *`;
  return linha ? paraFilme(linha) : null;
}

// Devolve true se algum filme foi excluído
export async function excluir(codigo) {
  const linhas = await banco()`DELETE FROM filmes WHERE codigo = ${codigo} RETURNING codigo`;
  return linhas.length > 0;
}
