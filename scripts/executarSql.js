// Executa um arquivo .sql no banco Neon da DATABASE_URL (lida do .env.local).
//   npm run banco:criar     → banco/schema.sql
//   npm run banco:exemplos  → banco/dados-exemplo.sql
// Os comandos do arquivo são separados pelo ";" no fim da linha e
// executados juntos numa transação: ou todos dão certo, ou nenhum vale.
import { readFile } from "node:fs/promises";
import { banco } from "../servidor/banco.js";

const arquivo = process.argv[2];

if (!arquivo) {
  console.error("Informe o arquivo .sql. Exemplo: node scripts/executarSql.js banco/schema.sql");
  process.exit(1);
}

// Tira as linhas de comentário (--) e os espaços das pontas
const semComentarios = (comando) =>
  comando
    .split("\n")
    .filter((linha) => !linha.trim().startsWith("--"))
    .join("\n")
    .trim();

try {
  const texto = await readFile(arquivo, "utf8");
  const comandos = texto.split(/;\s*$/m).map(semComentarios).filter((comando) => comando !== "");

  const sql = banco();
  await sql.transaction(comandos.map((comando) => sql.query(comando)));

  console.log(`✔ ${arquivo}: ${comandos.length} comando(s) executado(s) com sucesso.`);
} catch (erro) {
  console.error(`✖ Não foi possível executar ${arquivo}: ${erro.message}`);
  process.exit(1);
}
