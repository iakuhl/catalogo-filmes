import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listarFilmes, mensagemDeErro } from "../../servicos/filmesApi";
import { pluralizar } from "../../utilitarios/formatadores";
import ItemFilme from "../../componentes/ItemFilme/ItemFilme";
import Paginacao from "../../componentes/Paginacao/Paginacao";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import "./Inicio.css";

// Lê o número da página do endereço (/?pagina=2). Valores inválidos viram 1.
const lerPagina = (texto) => (/^\d{1,6}$/.test(texto ?? "") && Number(texto) > 0 ? Number(texto) : 1);

// Tela inicial (rota /): o menu (no Layout) e a lista de filmes,
// 25 por página. Clicar em um filme abre a tela Ler.
const Inicio = () => {
  const [parametros] = useSearchParams();
  const pagina = lerPagina(parametros.get("pagina"));

  // Resposta da API: { filmes, pagina, porPagina, total, totalPaginas }
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca a página da lista sempre que o número da página muda
  useEffect(() => {
    let ativo = true; // ignora a resposta se o usuário mudar de página antes dela chegar

    setCarregando(true);
    setErro("");

    listarFilmes(pagina)
      .then((resposta) => {
        if (ativo) setDados(resposta);
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
  }, [pagina]);

  // O [voltar] da tela Ler retorna para esta mesma página da lista
  const enderecoDaPagina = pagina > 1 ? `/?pagina=${pagina}` : "/";

  const mostrarLista = !carregando && !erro && dados !== null;

  return (
    <section className="inicio conteudo-estreito">
      <header className="inicio__cabecalho">
        <h1 className="inicio__titulo">Catálogo de filmes</h1>
        {mostrarLista && dados.total > 0 && (
          <p className="inicio__total">{pluralizar(dados.total, "filme", "filmes")}</p>
        )}
      </header>

      {carregando && <Carregando texto="Carregando filmes…" />}

      {!carregando && erro && (
        <Aviso tipo="erro" titulo="Não foi possível carregar o catálogo">
          {erro}
        </Aviso>
      )}

      {mostrarLista && dados.total === 0 && (
        <div className="inicio__vazio">
          <h2>Nenhum filme cadastrado</h2>
          <p>
            Use <strong>Criar</strong>, no menu acima, para adicionar o primeiro filme.
          </p>
        </div>
      )}

      {/* Endereço com uma página que não existe, como /?pagina=99 */}
      {mostrarLista && dados.total > 0 && dados.filmes.length === 0 && (
        <div className="inicio__vazio">
          <h2>Esta página está vazia</h2>
          <p>O catálogo tem {pluralizar(dados.totalPaginas, "página", "páginas")}.</p>
          <Botao para="/">Ir para a primeira página</Botao>
        </div>
      )}

      {mostrarLista && dados.filmes.length > 0 && (
        <>
          <ul className="inicio__lista">
            {dados.filmes.map((filme) => (
              <li key={filme.codigo}>
                <ItemFilme filme={filme} voltarPara={enderecoDaPagina} />
              </li>
            ))}
          </ul>

          <Paginacao
            pagina={pagina}
            totalPaginas={dados.totalPaginas}
            total={dados.total}
            porPagina={dados.porPagina}
          />
        </>
      )}
    </section>
  );
};

export default Inicio;
