import React from "react";
import "./Notificacao.css";

// Aviso temporário no canto da tela.
// A área com aria-live fica sempre na página para que leitores de
// tela anunciem a mensagem assim que ela aparece.
const Notificacao = (props) => {
  const notificacao = props.notificacao;

  return (
    <div className="notificacao-area" role="status" aria-live="polite">
      {notificacao && (
        <div key={notificacao.id} className={`notificacao notificacao--${notificacao.tipo}`}>
          <span className="notificacao__icone" aria-hidden="true">
            {notificacao.tipo === "erro" ? "!" : "✓"}
          </span>
          <p className="notificacao__texto">{notificacao.texto}</p>
          <button
            type="button"
            className="notificacao__fechar"
            onClick={props.aoFechar}
            aria-label="Fechar aviso"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Notificacao;
