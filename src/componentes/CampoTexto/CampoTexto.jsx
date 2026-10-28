import React from "react";
import "./CampoTexto.css";

// Campo de texto com rótulo, dica e mensagem de erro.
// Recebe o valor atual e avisa cada mudança pela função aoAlterado.
const CampoTexto = (props) => {
  const aoDigitado = (evento) => {
    props.aoAlterado(evento.target.value);
  };

  const idDica = `${props.id}-dica`;
  const idErro = `${props.id}-erro`;

  // Liga o campo ao texto de erro (ou de dica) para leitores de tela
  let descricao;
  if (props.erro) descricao = idErro;
  else if (props.dica) descricao = idDica;

  return (
    <div className="campo-texto">
      <label htmlFor={props.id} className="rotulo">
        {props.label}
        {props.obrigatorio && (
          <span className="rotulo__obrigatorio" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      <input
        id={props.id}
        className="entrada-texto"
        type={props.tipo || "text"}
        value={props.valor}
        onChange={aoDigitado}
        placeholder={props.placeholder}
        required={props.obrigatorio}
        min={props.min}
        max={props.max}
        maxLength={props.tamanhoMaximo}
        inputMode={props.modoTeclado}
        aria-invalid={props.erro ? true : undefined}
        aria-describedby={descricao}
      />

      {props.erro && (
        <small id={idErro} className="texto-erro">
          {props.erro}
        </small>
      )}
      {!props.erro && props.dica && (
        <small id={idDica} className="texto-dica">
          {props.dica}
        </small>
      )}
    </div>
  );
};

export default CampoTexto;
