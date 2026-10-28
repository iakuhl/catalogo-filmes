import React, { useState } from "react";
import { ehCodigoValido } from "../../../compartilhado/regrasFilme.js";
import "./CampoBusca.css";

// Caixa de texto para buscar um filme pelo nosso ID.
// A busca acontece ao apertar Enter ou clicar na lupa.
//   valorInicial: ID já buscado (vem do endereço da página)
//   aoBuscar:     recebe o ID digitado, já validado, como número
const CampoBusca = (props) => {
  const [texto, setTexto] = useState(props.valorInicial || "");
  const [erro, setErro] = useState("");

  const aoDigitado = (evento) => {
    setTexto(evento.target.value);
    setErro("");
  };

  const aoEnviar = (evento) => {
    evento.preventDefault();

    if (!ehCodigoValido(texto)) {
      setErro("Digite um ID válido: um número inteiro, como 7.");
      return;
    }

    props.aoBuscar(Number(texto.trim()));
  };

  return (
    <form className="campo-busca" role="search" onSubmit={aoEnviar} noValidate>
      <label htmlFor="campo-busca-codigo" className="rotulo">
        ID do filme
      </label>

      <div className="campo-busca__caixa">
        <input
          id="campo-busca-codigo"
          className="entrada-texto"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ex.: 7"
          value={texto}
          onChange={aoDigitado}
          autoFocus={!props.valorInicial}
          aria-invalid={erro ? true : undefined}
          aria-describedby="campo-busca-mensagem"
        />
        <button type="submit" className="campo-busca__lupa" aria-label="Buscar filme">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <small id="campo-busca-mensagem" className={erro ? "texto-erro" : "texto-dica"}>
        {erro || "Digite o ID e aperte Enter. O ID aparece ao lado de cada filme no início."}
      </small>
    </form>
  );
};

export default CampoBusca;
