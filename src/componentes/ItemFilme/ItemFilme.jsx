import React from "react";
import { Link } from "react-router-dom";
import "./ItemFilme.css";

// Um filme na lista da tela inicial: nosso ID e título.
// O elemento inteiro (borda e conteúdo) é um link para a tela Ler.
//   filme:      { codigo, titulo }
//   voltarPara: endereço da página da lista, para o [voltar] da tela Ler
const ItemFilme = (props) => {
  const filme = props.filme;

  return (
    <Link
      to={`/ler/${filme.codigo}`}
      state={{ voltarPara: props.voltarPara }}
      className="item-filme"
    >
      <span className="item-filme__codigo">
        <span className="item-filme__rotulo">ID</span> {filme.codigo}
      </span>
      <span className="item-filme__titulo">{filme.titulo}</span>
      <span className="item-filme__seta" aria-hidden="true">
        →
      </span>
    </Link>
  );
};

export default ItemFilme;
