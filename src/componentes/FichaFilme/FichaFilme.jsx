import React from "react";
import Cartaz from "../Cartaz/Cartaz";
import EtiquetasGeneros from "../EtiquetasGeneros/EtiquetasGeneros";
import { formatarDuracao, pluralizar } from "../../utilitarios/formatadores";
import "./FichaFilme.css";

// Todos os dados de um filme. Usada nas telas Ler e Remover.
//   filme:    dados completos do filme
//   nivel:    1 quando o título do filme é o título principal da tela (h1)
//   children: ações exibidas no fim da ficha (ex.: botões da tela Remover)
const FichaFilme = (props) => {
  const filme = props.filme;

  // Mantém a hierarquia de títulos da página correta
  const Titulo = props.nivel === 1 ? "h1" : "h2";
  const Subtitulo = props.nivel === 1 ? "h2" : "h3";

  return (
    <article className="ficha-filme">
      <Cartaz grande titulo={filme.titulo} generos={filme.generos} />

      <div>
        <p className="ficha-filme__ids">
          ID {filme.codigo} <span>· ID no banco {filme.id}</span>
        </p>
        <Titulo className="ficha-filme__titulo">{filme.titulo}</Titulo>
        <EtiquetasGeneros generos={filme.generos} />

        <dl className="ficha-filme__dados">
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
              <span className="ficha-filme__secundario">({formatarDuracao(filme.duracaoMinutos)})</span>
            </dd>
          </div>
        </dl>

        <section className="ficha-filme__elenco">
          <Subtitulo>
            Elenco
            {filme.elenco.length > 0 && (
              <span>{pluralizar(filme.elenco.length, "integrante", "integrantes")}</span>
            )}
          </Subtitulo>

          {filme.elenco.length > 0 ? (
            <ol className="ficha-filme__atores">
              {filme.elenco.map((ator) => (
                <li key={ator}>{ator}</li>
              ))}
            </ol>
          ) : (
            <p className="ficha-filme__sem-elenco">Elenco não informado.</p>
          )}
        </section>

        {props.children && <div className="ficha-filme__acoes">{props.children}</div>}
      </div>
    </article>
  );
};

export default FichaFilme;
