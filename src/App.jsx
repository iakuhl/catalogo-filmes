import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout/Layout";
import ListaFilmes from "./paginas/ListaFilmes/ListaFilmes";
import DetalhesFilme from "./paginas/DetalhesFilme/DetalhesFilme";
import NovoFilme from "./paginas/NovoFilme/NovoFilme";
import EditarFilme from "./paginas/EditarFilme/EditarFilme";
import NaoEncontrada from "./paginas/NaoEncontrada/NaoEncontrada";

function App() {
  return (
    <Routes>
      {/* Todas as páginas são exibidas dentro do Layout (cabeçalho, rodapé e notificações) */}
      <Route element={<Layout />}>
        <Route path="/" element={<ListaFilmes />} />
        <Route path="/filmes/novo" element={<NovoFilme />} />
        <Route path="/filmes/:id" element={<DetalhesFilme />} />
        <Route path="/filmes/:id/editar" element={<EditarFilme />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
