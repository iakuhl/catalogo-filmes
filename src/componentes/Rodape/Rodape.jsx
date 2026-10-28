import React from "react";
import "./Rodape.css";

const Rodape = () => {
  return (
    <footer className="rodape">
      <div className="rodape__conteudo container">
        <p className="rodape__marca">Acervo · catálogo de filmes</p>
        <p>Feito com React, Vercel e Neon</p>
      </div>
    </footer>
  );
};

export default Rodape;
