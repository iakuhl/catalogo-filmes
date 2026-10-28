import React, { useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFilme } from "../../hooks/useFilme";
import { excluirFilme, mensagemDeErro } from "../../servicos/filmesApi";
import { formatarDuracao, pluralizar } from "../../utilitarios/formatadores";
import Cartaz from "../../componentes/Cartaz/Cartaz";
import EtiquetasGeneros from "../../componentes/EtiquetasGeneros/EtiquetasGeneros";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import ModalConfirmacao from "../../componentes/ModalConfirmacao/ModalConfirmacao";
import NaoEncontrada from "../NaoEncontrada/NaoEncontrada";
import "./DetalhesFilme.css";

// Página com todos os dados de um filme (rota /filmes/:id)
const DetalhesFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  const { filme, carregando, erro, naoExiste } = useFilme(id);

  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await excluirFilme(filme.id);
      notificar(`"${filme.titulo}" foi excluído.`);
      navigate("/");
    } catch (erroExclusao) {
      notificar(mensagemDeErro(erroExclusao), "erro");
      setExcluindo(false);
      setConfirmando(false);
    }
  };

  if (carregando) return <Carregando texto="Carregando filme…" />;

  if (naoExiste) {
    return (
      <NaoEncontrada
        titulo="Filme não encontrado"
        mensagem="Ele pode ter sido excluído, ou o endereço está incorreto."
      />
    );
  }

  if (erro) {
    return (
      <Aviso tipo="erro" titulo="Não foi possível carregar o filme">
        {erro}
      </Aviso>
    );
  }

  return (
    <article className="detalhes-filme">
      <Link to="/" className="detalhes-filme__voltar">
        ← Voltar ao catálogo
      </Link>

      <div className="detalhes-filme__grade">
        <Cartaz grande titulo={filme.titulo} generos={filme.generos} />

        <div>
          <p className="cabecalho-pagina__sobretitulo">Filme nº {filme.id}</p>
          <h1 className="detalhes-filme__titulo">{filme.titulo}</h1>
          <EtiquetasGeneros generos={filme.generos} />

          <dl className="detalhes-filme__dados">
            <div>
              <dt>Direção</dt>
              <dd>{filme.diretor}</dd>
            </div>
            <div>
              <dt>Lançamento</dt>
              <dd>{filme.anoLancamento}</dd>
            </div>
            <div>
              <dt>Duração</dt>
              <dd>
                {filme.duracaoMinutos} min{" "}
                <span className="detalhes-filme__secundario">({formatarDuracao(filme.duracaoMinutos)})</span>
              </dd>
            </div>
          </dl>

          <section className="detalhes-filme__elenco" aria-labelledby="titulo-elenco">
            <h2 id="titulo-elenco">
              Elenco
              {filme.elenco.length > 0 && (
                <span>{pluralizar(filme.elenco.length, "integrante", "integrantes")}</span>
              )}
            </h2>

            {filme.elenco.length > 0 ? (
              <ol className="detalhes-filme__atores">
                {filme.elenco.map((ator) => (
                  <li key={ator}>{ator}</li>
                ))}
              </ol>
            ) : (
              <p className="detalhes-filme__sem-elenco">Elenco não informado.</p>
            )}
          </section>

          <div className="detalhes-filme__acoes">
            <Botao para={`/filmes/${filme.id}/editar`}>Editar filme</Botao>
            <Botao variante="perigo" aoClicar={() => setConfirmando(true)}>
              Excluir
            </Botao>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir filme?"
        mensagem={`"${filme.titulo}" será removido do catálogo. Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setConfirmando(false)}
      />
    </article>
  );
};

export default DetalhesFilme;
