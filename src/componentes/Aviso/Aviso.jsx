import React from "react";
import "./Aviso.css";

// Caixa de mensagem fixa na página.
//   tipo: "info" (padrão) ou "erro"
const Aviso = (props) => {
  const tipo = props.tipo || "info";

  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
      {props.titulo && <strong className="aviso__titulo">{props.titulo}</strong>}
      <div className="aviso__texto">{props.children}</div>
    </div>
  );
};

export default Aviso;
