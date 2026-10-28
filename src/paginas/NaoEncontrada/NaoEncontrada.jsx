import React from "react";
import Botao from "../../componentes/Botao/Botao";
import "./NaoEncontrada.css";

// Página 404. Também é usada quando um filme não existe,
// recebendo outro título e outra mensagem pelas props.
const NaoEncontrada = (props) => {
  return (
    <section className="nao-encontrada">
      <p className="nao-encontrada__codigo" aria-hidden="true">
        404
      </p>
      <h1 className="nao-encontrada__titulo">{props.titulo || "Página não encontrada"}</h1>
      <p className="nao-encontrada__texto">
        {props.mensagem || "O endereço acessado não existe ou foi alterado."}
      </p>
      <Botao para="/">Voltar ao início</Botao>
    </section>
  );
};

export default NaoEncontrada;
