import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./componentes/Layout/Layout";
import Inicio from "./paginas/Inicio/Inicio";
import Ler from "./paginas/Ler/Ler";
import Criar from "./paginas/Criar/Criar";
import Alterar from "./paginas/Alterar/Alterar";
import Remover from "./paginas/Remover/Remover";
import NaoEncontrada from "./paginas/NaoEncontrada/NaoEncontrada";

function App() {
  return (
    <Routes>
      {/* Todas as telas são exibidas dentro do Layout (menu superior e notificações) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/ler/:codigo" element={<Ler />} />
        <Route path="/criar" element={<Criar />} />
        <Route path="/alterar" element={<Alterar />} />
        <Route path="/remover" element={<Remover />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
