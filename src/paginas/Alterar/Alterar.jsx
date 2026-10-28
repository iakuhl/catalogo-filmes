import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFilmeBuscado } from "../../hooks/useFilme";
import { atualizarFilme } from "../../servicos/filmesApi";
import CampoBusca from "../../componentes/CampoBusca/CampoBusca";
import FormularioFilme from "../../componentes/FormularioFilme/FormularioFilme";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";

// Tela Alterar (rota /alterar). Começa só com a busca por ID e o botão
// [voltar]. Renderização condicional: o formulário com os dados editáveis
// e o botão [salvar] só aparecem depois que o filme é encontrado.
const Alterar = () => {
  const navigate = useNavigate();
  const { notificar } = useOutletContext();

  const { codigo, buscar, filme, carregando, erro, naoExiste } = useFilmeBuscado();

  const salvar = async (dados) => {
    const atualizado = await atualizarFilme(filme.codigo, dados);
    notificar(`Alterações em "${atualizado.titulo}" (ID ${atualizado.codigo}) salvas.`);
    navigate("/");
  };

  return (
    <section className="pagina-busca conteudo-estreito">
      <header className="cabecalho-pagina">
        <div>
          <p className="cabecalho-pagina__sobretitulo">Alterar</p>
          <h1 className="cabecalho-pagina__titulo">Alterar filme</h1>
          <p className="cabecalho-pagina__descricao">Busque o filme pelo ID para editar os dados.</p>
        </div>
      </header>

      {/* A key recria a caixa quando o ID do endereço muda (ex.: clicar em Alterar no menu) */}
      <CampoBusca key={codigo ?? ""} valorInicial={codigo ?? ""} aoBuscar={buscar} />

      {carregando && <Carregando texto="Buscando filme…" />}

      {naoExiste && <Aviso titulo="Filme não encontrado">Não existe filme com o ID {codigo}.</Aviso>}

      {erro && (
        <Aviso tipo="erro" titulo="Não foi possível buscar o filme">
          {erro}
        </Aviso>
      )}

      {filme ? (
        <>
          <p className="pagina-busca__encontrado">
            Editando o filme <strong>ID {filme.codigo}</strong> · ID no banco {filme.id}
          </p>
          {/* A key garante um formulário novo a cada filme buscado */}
          <FormularioFilme
            key={filme.codigo}
            filmeInicial={filme}
            aoSalvar={salvar}
            textoBotao="Salvar"
            rotaCancelar="/"
          />
        </>
      ) : (
        !carregando && (
          <div className="pagina-busca__acoes">
            <Botao variante="secundario" para="/">
              Voltar
            </Botao>
          </div>
        )
      )}
    </section>
  );
};

export default Alterar;
