import React, { useState } from "react";
import { LIMITE_ELENCO, TAMANHO_MAXIMO, contemNome } from "../../../compartilhado/regrasFilme.js";
import Botao from "../Botao/Botao";
import "./CampoElenco.css";

// Lista de atores do filme (opcional, até LIMITE_ELENCO nomes).
// O nome digitado entra na lista ao clicar em "Adicionar" ou apertar
// Enter, e cada nome pode ser removido no botão "×".
const CampoElenco = (props) => {
  const [nome, setNome] = useState("");
  const [aviso, setAviso] = useState("");

  const elenco = props.valor;
  const cheio = elenco.length >= LIMITE_ELENCO;

  const adicionar = () => {
    const novoNome = nome.trim();
    if (novoNome === "" || cheio) return;

    if (contemNome(elenco, novoNome)) {
      setAviso(`${novoNome} já está no elenco.`);
      return;
    }

    props.aoAlterado([...elenco, novoNome]);
    setNome("");
    setAviso("");
  };

  const remover = (ator) => {
    props.aoAlterado(elenco.filter((item) => item !== ator));
    setAviso("");
  };

  const aoDigitado = (evento) => {
    setNome(evento.target.value);
    setAviso("");
  };

  // Enter adiciona o ator em vez de enviar o formulário
  const aoPressionarTecla = (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      adicionar();
    }
  };

  // Prioridade: erro da validação > nome repetido > limite atingido > dica
  const temErro = Boolean(props.erro || aviso);
  let mensagem = "Aperte Enter ou clique em Adicionar.";
  if (cheio) mensagem = `Limite de ${LIMITE_ELENCO} atores atingido.`;
  if (aviso) mensagem = aviso;
  if (props.erro) mensagem = props.erro;

  let classeContador = "campo-elenco__contador";
  if (cheio) classeContador += " campo-elenco__contador--cheio";
  else if (elenco.length >= LIMITE_ELENCO - 5) classeContador += " campo-elenco__contador--alerta";

  const idNome = `${props.id}-nome`;
  const idMensagem = `${props.id}-mensagem`;

  return (
    <fieldset id={props.id} tabIndex={-1} className="campo-elenco">
      <legend className="rotulo">
        Elenco <span className="rotulo__opcional">(opcional)</span>
      </legend>

      <div className="campo-elenco__entrada">
        <label htmlFor={idNome} className="somente-leitor">
          Nome do ator ou da atriz
        </label>
        <input
          id={idNome}
          className="entrada-texto"
          value={nome}
          onChange={aoDigitado}
          onKeyDown={aoPressionarTecla}
          placeholder={cheio ? "Elenco completo" : "Nome do ator ou da atriz"}
          maxLength={TAMANHO_MAXIMO.ator}
          disabled={cheio}
          aria-invalid={temErro ? true : undefined}
          aria-describedby={idMensagem}
        />
        <Botao variante="secundario" aoClicar={adicionar} desabilitado={cheio || nome.trim() === ""}>
          Adicionar
        </Botao>
      </div>

      <div className="campo-elenco__rodape">
        <small id={idMensagem} className={temErro ? "texto-erro" : "texto-dica"} aria-live="polite">
          {mensagem}
        </small>
        <small className={classeContador}>
          {elenco.length}/{LIMITE_ELENCO}
        </small>
      </div>

      {elenco.length > 0 && (
        <ul className="campo-elenco__lista" aria-label="Atores adicionados">
          {elenco.map((ator) => (
            <li key={ator} className="campo-elenco__ator">
              <span>{ator}</span>
              <button type="button" onClick={() => remover(ator)} aria-label={`Remover ${ator}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default CampoElenco;
