import React from "react";
import { corDoGenero } from "../../utilitarios/coresGeneros";
import "./Cartaz.css";

// Cartaz gerado para o filme (o cadastro não tem imagem): um gradiente
// na cor do primeiro gênero, com a inicial do título em destaque.
// É só decoração, por isso fica escondido dos leitores de tela.
const Cartaz = (props) => {
  const inicial = props.titulo.trim().charAt(0).toUpperCase();
  const cor = corDoGenero(props.generos[0]);

  return (
    <div
      className={`cartaz${props.grande ? " cartaz--grande" : ""}`}
      style={{ "--cor-cartaz": cor }}
      aria-hidden="true"
    >
      <span className="cartaz__inicial">{inicial}</span>
      <span className="cartaz__legenda">{props.generos.join(" · ")}</span>
    </div>
  );
};

export default Cartaz;
