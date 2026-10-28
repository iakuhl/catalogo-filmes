import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Cabecalho.css";

const Cabecalho = () => {
  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo container">
        <Link to="/" className="cabecalho__marca">
          {/* Logo: um rolo de filme */}
          <svg className="cabecalho__logo" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="#2a231c" />
            <circle cx="32" cy="32" r="19" fill="none" stroke="#93ad6e" strokeWidth="4" />
            <circle cx="32" cy="21" r="4.5" fill="#c9a45c" />
            <circle cx="32" cy="43" r="4.5" fill="#c9a45c" />
            <circle cx="21" cy="32" r="4.5" fill="#b8673f" />
            <circle cx="43" cy="32" r="4.5" fill="#b8673f" />
            <circle cx="32" cy="32" r="2.5" fill="#ece3d4" />
          </svg>
          <span>
            <span className="cabecalho__nome">Acervo</span>
            <span className="cabecalho__slogan">Catálogo de filmes</span>
          </span>
        </Link>

        {/* NavLink adiciona a classe "active" no link da página atual */}
        <nav className="cabecalho__navegacao" aria-label="Navegação principal">
          <NavLink to="/" end className="cabecalho__link">
            Catálogo
          </NavLink>
          <NavLink to="/filmes/novo" className="cabecalho__link">
            Novo filme
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Cabecalho;
