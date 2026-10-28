import React from "react";
import { Link } from "react-router-dom";
import Cartaz from "../Cartaz/Cartaz";
import EtiquetasGeneros from "../EtiquetasGeneros/EtiquetasGeneros";
import Botao from "../Botao/Botao";
import { formatarDuracao } from "../../utilitarios/formatadores";
import "./CartaoFilme.css";

// Cartão de um filme na lista do catálogo
//   filme:     dados do filme
//   aoExcluir: chamada quando o usuário clica em "Excluir"
const CartaoFilme = (props) => {
  const filme = props.filme;

  // No cartão aparecem só os 3 primeiros nomes do elenco
  const primeiros = filme.elenco.slice(0, 3).join(", ");
  const restantes = filme.elenco.length - 3;

  return (
    <article className="cartao-filme">
      <Cartaz titulo={filme.titulo} generos={filme.generos} />

      <div className="cartao-filme__info">
        <h2 className="cartao-filme__titulo">
          {/* Pelo CSS, este link cobre o cartão inteiro */}
          <Link to={`/filmes/${filme.id}`} className="cartao-filme__link">
            {filme.titulo}
          </Link>
        </h2>
        <p className="cartao-filme__meta">
          {filme.anoLancamento} · {formatarDuracao(filme.duracaoMinutos)}
        </p>
        <p className="cartao-filme__meta">Direção: {filme.diretor}</p>
        <EtiquetasGeneros generos={filme.generos} />
        {filme.elenco.length > 0 && (
          <p className="cartao-filme__elenco">
            Com {primeiros}
            {restantes > 0 && ` e mais ${restantes}`}
          </p>
        )}
      </div>

      <div className="cartao-filme__acoes">
        <Botao
          variante="fantasma"
          pequeno
          para={`/filmes/${filme.id}/editar`}
          rotulo={`Editar ${filme.titulo}`}
        >
          Editar
        </Botao>
        <Botao
          variante="fantasma"
          pequeno
          aoClicar={() => props.aoExcluir(filme)}
          rotulo={`Excluir ${filme.titulo}`}
        >
          Excluir
        </Botao>
      </div>
    </article>
  );
};

export default CartaoFilme;
