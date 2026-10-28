import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { criarFilme } from "../../servicos/filmesApi";
import FormularioFilme from "../../componentes/FormularioFilme/FormularioFilme";

// Tela Criar (rota /criar): formulário com os botões [criar] e [cancelar]
const Criar = () => {
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  // Inclui o filme e retorna ao início. Se der erro, o FormularioFilme
  // mostra a mensagem na tela e o usuário continua aqui para corrigir.
  const salvar = async (filme) => {
    const criado = await criarFilme(filme);
    notificar(`"${criado.titulo}" foi criado com o ID ${criado.codigo}.`);
    navigate("/");
  };

  return (
    <section className="conteudo-estreito">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Criar</p>
          <h1 className="cabecalho-pagina__titulo">Novo filme</h1>
          <p className="cabecalho-pagina__descricao">
            O ID é gerado automaticamente. Campos marcados com * são obrigatórios.
          </p>
        </div>
      </header>

      <FormularioFilme aoSalvar={salvar} textoBotao="Criar" rotaCancelar="/" />
    </section>
  );
};

export default Criar;
