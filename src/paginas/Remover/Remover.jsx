import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFilmeBuscado } from "../../hooks/useFilme";
import { excluirFilme, mensagemDeErro } from "../../servicos/filmesApi";
import CampoBusca from "../../componentes/CampoBusca/CampoBusca";
import FichaFilme from "../../componentes/FichaFilme/FichaFilme";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import ModalConfirmacao from "../../componentes/ModalConfirmacao/ModalConfirmacao";

// Tela Remover (rota /remover). Semelhante à tela Alterar: começa só com a
// busca por ID e o botão [voltar]. Depois de encontrado, o filme aparece com
// o botão vermelho [excluir], que pede confirmação antes de apagar.
const Remover = () => {
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  const { codigo, buscar, filme, carregando, erro, naoExiste } = useFilmeBuscado();

  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await excluirFilme(filme.codigo);
      notificar(`"${filme.titulo}" (ID ${filme.codigo}) foi excluído.`);
      navigate("/");
    } catch (erroExclusao) {
      notificar(mensagemDeErro(erroExclusao), "erro");
      setExcluindo(false);
      setConfirmando(false);
    }
  };

  return (
    <section className="pagina-busca conteudo-estreito">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Remover</p>
          <h1 className="cabecalho-pagina__titulo">Remover filme</h1>
          <p className="cabecalho-pagina__descricao">Busque o filme pelo ID para excluí-lo do catálogo.</p>
        </div>
      </header>

      {/* A key recria a caixa quando o ID do endereço muda (ex.: clicar em Remover no menu) */}
      <CampoBusca key={codigo ?? ""} valorInicial={codigo ?? ""} aoBuscar={buscar} />

      {carregando && <Carregando texto="Buscando filme…" />}

      {naoExiste && <Aviso titulo="Filme não encontrado">Não existe filme com o ID {codigo}.</Aviso>}

      {erro && (
        <Aviso tipo="erro" titulo="Não foi possível buscar o filme">
          {erro}
        </Aviso>
      )}

      {/* Renderização condicional: os dados só aparecem depois da busca */}
      {filme ? (
        <FichaFilme filme={filme}>
          <Botao variante="secundario" para="/">
            Cancelar
          </Botao>
          <Botao variante="perigo" aoClicar={() => setConfirmando(true)}>
            Excluir
          </Botao>
        </FichaFilme>
      ) : (
        !carregando && (
          <div className="pagina-busca__acoes">
            <Botao variante="secundario" para="/">
              Voltar
            </Botao>
          </div>
        )
      )}

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir filme?"
        mensagem={filme ? `"${filme.titulo}" (ID ${filme.codigo}) será excluído do catálogo.` : ""}
        alerta="Esta operação é irreversível."
        textoConfirmar="Sim, excluir"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setConfirmando(false)}
      />
    </section>
  );
};

export default Remover;
