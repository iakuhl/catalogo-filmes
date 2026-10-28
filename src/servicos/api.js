import axios from "axios";

// Instância do Axios usada por todo o site.
// As requisições vão para /api, que na Vercel é atendido pela Function
// (api/index.js) e, no npm run dev, pelo próprio Vite (veja vite.config.js).
const api = axios.create({
  baseURL: "/api",
});

export default api;
