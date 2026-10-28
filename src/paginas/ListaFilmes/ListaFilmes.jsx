import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { listarFilmes, excluirFilme, mensagemDeErro } from "../../servicos/filmesApi";
import { pluralizar } from "../../utilitarios/formatadores";
import CartaoFilme from "../../componentes/CartaoFilme/CartaoFilme";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import ModalConfirmacao from "../../componentes/ModalConfirmacao/ModalConfirmacao";
import "./ListaFilmes.css";

// Página inicial: catálogo com todos os filmes
const ListaFilmes = () => {
  const { notificar } = useOutletContext();

  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Filme escolhido para excluir (abre o modal de confirmação)
  const [filmeParaExcluir, setFilmeParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Busca os filmes na API quando a página abre
  useEffect(() => {
    let ativo = true; // ignora a resposta se o usuário sair antes dela chegar

    listarFilmes()
      .then((lista) => {
        if (ativo) setFilmes(lista);
      })
      .catch((erroBusca) => {
        if (ativo) setErro(mensagemDeErro(erroBusca));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const confirmarExclusao = async () => {
    const filme = filmeParaExcluir;
    setExcluindo(true);

    try {
      await excluirFilme(filme.id);
      // Remove o filme da lista sem precisar buscar tudo de novo
      setFilmes((atuais) => atuais.filter((item) => item.id !== filme.id));
      notificar(`"${filme.titulo}" foi excluído.`);
    } catch (erroExclusao) {
      notificar(mensagemDeErro(erroExclusao), "erro");
    } finally {
      setExcluindo(false);
      setFilmeParaExcluir(null);
    }
  };

  const listaVazia = !carregando && !erro && filmes.length === 0;

  return (
    <section className="lista-filmes">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Acervo</p>
          <h1 className="cabecalho-pagina__titulo">Catálogo de filmes</h1>
          {!carregando && !erro && (
            <p className="cabecalho-pagina__descricao">
              {pluralizar(filmes.length, "filme cadastrado", "filmes cadastrados")}
            </p>
          )}
        </div>
        <Botao para="/filmes/novo">+ Novo filme</Botao>
      </header>

      {carregando && <Carregando texto="Carregando filmes…" />}

      {erro && (
        <Aviso tipo="erro" titulo="Não foi possível carregar o catálogo">
          {erro}
        </Aviso>
      )}

      {listaVazia && (
        <div className="lista-filmes__vazia">
          <h2>Nenhum filme por aqui ainda</h2>
          <p>Comece o seu acervo cadastrando o primeiro filme.</p>
          <Botao para="/filmes/novo">Cadastrar primeiro filme</Botao>
        </div>
      )}

      {filmes.length > 0 && (
        <ul className="lista-filmes__grade">
          {filmes.map((filme) => (
            <li key={filme.id}>
              <CartaoFilme filme={filme} aoExcluir={setFilmeParaExcluir} />
            </li>
          ))}
        </ul>
      )}

      <ModalConfirmacao
        aberto={filmeParaExcluir !== null}
        titulo="Excluir filme?"
        mensagem={
          filmeParaExcluir
            ? `"${filmeParaExcluir.titulo}" será removido do catálogo. Esta ação não pode ser desfeita.`
            : ""
        }
        textoConfirmar="Excluir"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setFilmeParaExcluir(null)}
      />
    </section>
  );
};

export default ListaFilmes;
