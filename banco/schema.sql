-- Cria a tabela de filmes. Rode uma única vez, de um destes jeitos:
--   * cole este arquivo no SQL Editor do Neon e clique em Run; ou
--   * rode `npm run banco:criar` (usa a DATABASE_URL do .env.local).
--
-- Cada filme tem dois identificadores:
--   id     → id interno do banco (chave primária)
--   codigo → nosso ID, a numeração própria que aparece no site e é usada
--            para ler, alterar e remover. Vem de uma sequência separada e
--            nunca reaproveita o número de um filme excluído.

CREATE SEQUENCE IF NOT EXISTS filmes_codigo_seq;

CREATE TABLE IF NOT EXISTS filmes (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo           INTEGER      NOT NULL UNIQUE DEFAULT nextval('filmes_codigo_seq'),
  titulo           VARCHAR(200) NOT NULL,
  ano_lancamento   INTEGER      NOT NULL CHECK (ano_lancamento >= 1888),
  duracao_minutos  INTEGER      NOT NULL CHECK (duracao_minutos BETWEEN 1 AND 999),
  diretor          VARCHAR(150) NOT NULL,
  generos          TEXT[]       NOT NULL CHECK (cardinality(generos) >= 1),
  elenco           TEXT[]       NOT NULL DEFAULT '{}' CHECK (cardinality(elenco) <= 50)
);

-- A sequência passa a pertencer à coluna: se a tabela for apagada, ela vai junto
ALTER SEQUENCE filmes_codigo_seq OWNED BY filmes.codigo;
