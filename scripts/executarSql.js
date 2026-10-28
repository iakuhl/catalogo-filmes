// Executa um arquivo .sql no banco Neon da DATABASE_URL (lida do .env.local).
//   npm run banco:criar     → banco/schema.sql
//   npm run banco:exemplos  → banco/dados-exemplo.sql
// O driver HTTP do Neon executa um comando SQL por vez, então cada
// arquivo deve conter um único comando.
import { readFile } from "node:fs/promises";
import { banco } from "../servidor/banco.js";

const arquivo = process.argv[2];

if (!arquivo) {
  console.error("Informe o arquivo .sql. Exemplo: node scripts/executarSql.js banco/schema.sql");
  process.exit(1);
}

try {
  const comando = await readFile(arquivo, "utf8");
  await banco().query(comando);
  console.log(`✔ ${arquivo} executado com sucesso.`);
} catch (erro) {
  console.error(`✖ Não foi possível executar ${arquivo}: ${erro.message}`);
  process.exit(1);
}
