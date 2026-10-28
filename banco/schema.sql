-- Cria a tabela de filmes. Rode uma única vez, de um destes jeitos:
--   * cole este arquivo no SQL Editor do Neon e clique em Run; ou
--   * rode `npm run banco:criar` (usa a DATABASE_URL do .env.local).
-- Mantenha um único comando SQL neste arquivo: o driver HTTP do Neon
-- executa um comando por vez.

CREATE TABLE IF NOT EXISTS filmes (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo           VARCHAR(200) NOT NULL,
  ano_lancamento   INTEGER      NOT NULL CHECK (ano_lancamento >= 1888),
  duracao_minutos  INTEGER      NOT NULL CHECK (duracao_minutos BETWEEN 1 AND 999),
  diretor          VARCHAR(150) NOT NULL,
  generos          TEXT[]       NOT NULL CHECK (cardinality(generos) >= 1),
  elenco           TEXT[]       NOT NULL DEFAULT '{}' CHECK (cardinality(elenco) <= 50)
);
