import React from "react";
import { GENEROS } from "../../../compartilhado/regrasFilme.js";
import "./CampoGeneros.css";

// Escolha de um ou mais gêneros. Cada opção é um checkbox de verdade
// (funciona com mouse e teclado), estilizado como uma "pílula".
const CampoGeneros = (props) => {
  const alternar = (genero) => {
    const selecionados = props.valor.includes(genero)
      ? props.valor.filter((item) => item !== genero)
      : [...props.valor, genero];

    // Mantém sempre a mesma ordem da lista de gêneros
    props.aoAlterado(GENEROS.filter((item) => selecionados.includes(item)));
  };

  const idDica = `${props.id}-dica`;
  const idErro = `${props.id}-erro`;

  return (
    <fieldset
      id={props.id}
      tabIndex={-1}
      className="campo-generos"
      aria-describedby={props.erro ? idErro : idDica}
    >
      <legend className="rotulo">
        Gêneros{" "}
        <span className="rotulo__obrigatorio" aria-hidden="true">
          *
        </span>
      </legend>
      <p id={idDica} className="texto-dica campo-generos__dica">
        Escolha um ou mais.
      </p>

      <div className="campo-generos__opcoes">
        {GENEROS.map((genero) => (
          <label key={genero} className="campo-generos__opcao">
            <input
              type="checkbox"
              checked={props.valor.includes(genero)}
              onChange={() => alternar(genero)}
            />
            <span>{genero}</span>
          </label>
        ))}
      </div>

      {props.erro && (
        <small id={idErro} className="texto-erro campo-generos__erro">
          {props.erro}
        </small>
      )}
    </fieldset>
  );
};

export default CampoGeneros;
