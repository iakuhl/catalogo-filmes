import React from "react";
import { Link } from "react-router-dom";
import "./Botao.css";

// Botão padrão do site.
//   variante: "primario" (padrão), "secundario", "perigo" ou "fantasma"
//   pequeno:  versão compacta
//   para:     quando informado, o botão vira um link do React Router
const Botao = (props) => {
  const variante = props.variante || "primario";
  let classes = `botao botao--${variante}`;
  if (props.pequeno) classes += " botao--pequeno";

  if (props.para) {
    return (
      <Link to={props.para} className={classes} aria-label={props.rotulo}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.tipo || "button"}
      className={classes}
      onClick={props.aoClicar}
      disabled={props.desabilitado}
      aria-label={props.rotulo}
    >
      {props.children}
    </button>
  );
};

export default Botao;
