import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { criarFilme } from "../../servicos/filmesApi";
import FormularioFilme from "../../componentes/FormularioFilme/FormularioFilme";

// Página de cadastro (rota /filmes/novo)
const NovoFilme = () => {
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  // Envia para a API; se der erro, o FormularioFilme mostra a mensagem
  const salvar = async (filme) => {
    const criado = await criarFilme(filme);
    notificar(`"${criado.titulo}" foi cadastrado.`);
    navigate(`/filmes/${criado.id}`);
  };

  return (
    <section className="conteudo-estreito">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Cadastro</p>
          <h1 className="cabecalho-pagina__titulo">Novo filme</h1>
          <p className="cabecalho-pagina__descricao">Campos marcados com * são obrigatórios.</p>
        </div>
      </header>

      <FormularioFilme aoSalvar={salvar} textoBotao="Cadastrar filme" rotaCancelar="/" />
    </section>
  );
};

export default NovoFilme;
