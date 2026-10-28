import React from "react";
import "./Carregando.css";

const Carregando = (props) => {
  return (
    <div className="carregando" role="status">
      <span className="carregando__roda" aria-hidden="true" />
      <span>{props.texto || "Carregando…"}</span>
    </div>
  );
};

export default Carregando;
