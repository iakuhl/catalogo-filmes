import React, { useEffect, useRef } from "react";
import Botao from "../Botao/Botao";
import "./ModalConfirmacao.css";

// Janela de confirmação feita com o elemento <dialog> do HTML.
// showModal() abre a janela por cima da página, prende o foco nela
// e permite fechar com a tecla Esc.
//   aberto, titulo, mensagem, textoConfirmar
//   processando: enquanto true, os botões ficam desabilitados
//   aoConfirmar / aoCancelar: funções chamadas pelos botões
const ModalConfirmacao = (props) => {
  const dialogo = useRef(null);

  // Abre ou fecha o <dialog> conforme a prop "aberto"
  useEffect(() => {
    const elemento = dialogo.current;
    if (props.aberto && !elemento.open) elemento.showModal();
    if (!props.aberto && elemento.open) elemento.close();
  }, [props.aberto]);

  // Não deixa fechar com Esc enquanto a ação está em andamento
  const aoApertarEsc = (evento) => {
    if (props.processando) evento.preventDefault();
  };

  // Clicar no fundo escurecido (fora da caixa) também cancela
  const aoClicar = (evento) => {
    if (evento.target === dialogo.current && !props.processando) {
      props.aoCancelar();
    }
  };

  return (
    <dialog
      ref={dialogo}
      className="modal"
      onCancel={aoApertarEsc}
      onClose={props.aoCancelar}
      onClick={aoClicar}
      aria-labelledby="modal-titulo"
      aria-describedby="modal-mensagem"
    >
      <div className="modal__conteudo">
        <h2 id="modal-titulo" className="modal__titulo">
          {props.titulo}
        </h2>
        <p id="modal-mensagem" className="modal__mensagem">
          {props.mensagem}
        </p>

        <div className="modal__acoes">
          <Botao variante="secundario" aoClicar={props.aoCancelar} desabilitado={props.processando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" aoClicar={props.aoConfirmar} desabilitado={props.processando}>
            {props.processando ? "Excluindo…" : props.textoConfirmar}
          </Botao>
        </div>
      </div>
    </dialog>
  );
};

export default ModalConfirmacao;
