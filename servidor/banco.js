import { neon } from "@neondatabase/serverless";

let sql;

// Devolve a função `sql` do driver do Neon, criando a conexão no primeiro uso.
// Uso:  await banco()`SELECT * FROM filmes WHERE id = ${id}`
// Cada valor interpolado com ${...} é enviado como parâmetro ($1, $2...),
// e não colado no texto do SQL. Isso evita SQL injection.
export function banco() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL não definida. Crie o arquivo .env.local (veja .env.example) " +
        "ou configure a variável de ambiente no projeto da Vercel.",
    );
  }

  sql ??= neon(process.env.DATABASE_URL);
  return sql;
}
