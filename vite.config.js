import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Na Vercel, o arquivo api/index.js vira uma Function que atende /api/*.
// Fora da Vercel (npm run dev / npm run preview) quem atende essas
// requisições é o próprio servidor do Vite, chamando a MESMA função.
// Assim o código da API é exatamente o mesmo nos dois ambientes.

// Converte a requisição do Node em um Request (padrão Web), chama a
// função da API e devolve o Response pelo objeto de resposta do Node.
const encaminharParaApi = (carregarApi) => async (req, res, next) => {
  try {
    const { default: api } = await carregarApi();

    // Junta o corpo da requisição (enviado no POST e no PUT)
    const pedacos = [];
    for await (const pedaco of req) pedacos.push(pedaco);

    const requisicao = new Request(new URL(req.originalUrl, `http://${req.headers.host}`), {
      method: req.method,
      headers: req.headers,
      body: pedacos.length > 0 ? Buffer.concat(pedacos) : undefined,
    });

    const resposta = await api.fetch(requisicao);

    res.statusCode = resposta.status;
    resposta.headers.forEach((valor, nome) => res.setHeader(nome, valor));
    res.end(Buffer.from(await resposta.arrayBuffer()));
  } catch (erro) {
    next(erro);
  }
};

const apiLocal = () => ({
  name: "api-local",

  // npm run dev: ssrLoadModule recarrega a API sempre que um arquivo muda
  configureServer(servidor) {
    servidor.middlewares.use(
      "/api",
      encaminharParaApi(() => servidor.ssrLoadModule("/api/index.js")),
    );
  },

  // npm run preview: importa a API direto pelo Node
  configurePreviewServer(servidor) {
    const arquivoApi = pathToFileURL(path.resolve("api/index.js")).href;
    servidor.middlewares.use("/api", encaminharParaApi(() => import(arquivoApi)));
  },
});

export default defineConfig(({ mode }) => {
  // Coloca as variáveis do .env.local (como a DATABASE_URL) em process.env
  // para a API local. Só variáveis com prefixo VITE_ chegam ao navegador,
  // então a string de conexão do banco nunca vai para o front-end.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), apiLocal()],
  };
});
