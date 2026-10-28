import React from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFilme } from "../../hooks/useFilme";
import { atualizarFilme } from "../../servicos/filmesApi";
import FormularioFilme from "../../componentes/FormularioFilme/FormularioFilme";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import NaoEncontrada from "../NaoEncontrada/NaoEncontrada";

// Página de edição (rota /filmes/:id/editar)
const EditarFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  // Carrega o filme para preencher o formulário
  const { filme, carregando, erro, naoExiste } = useFilme(id);

  const salvar = async (dados) => {
    const atualizado = await atualizarFilme(id, dados);
    notificar(`Alterações em "${atualizado.titulo}" salvas.`);
    navigate(`/filmes/${atualizado.id}`);
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
    <section className="conteudo-estreito">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Edição · filme nº {filme.id}</p>
          <h1 className="cabecalho-pagina__titulo">{filme.titulo}</h1>
          <p className="cabecalho-pagina__descricao">Campos marcados com * são obrigatórios.</p>
        </div>
      </header>

      <FormularioFilme
        filmeInicial={filme}
        aoSalvar={salvar}
        textoBotao="Salvar alterações"
        rotaCancelar={`/filmes/${filme.id}`}
      />
    </section>
  );
};

export default EditarFilme;
