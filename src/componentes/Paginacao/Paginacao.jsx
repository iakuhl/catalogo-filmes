import React from "react";
import Botao from "../Botao/Botao";
import "./Paginacao.css";

// Atalhos para avançar e voltar entre as páginas da lista.
// Só aparece quando há mais filmes do que cabem em uma página.
//   pagina, totalPaginas, total, porPagina: vêm da resposta da API
const Paginacao = (props) => {
  const pagina = props.pagina;
  const totalPaginas = props.totalPaginas;

  if (totalPaginas <= 1) return null;

  const primeiro = (pagina - 1) * props.porPagina + 1;
  const ultimo = Math.min(pagina * props.porPagina, props.total);

  // Quantos filmes a próxima página vai mostrar (até 25)
  const proximos = Math.min(props.porPagina, props.total - ultimo);

  // A página 1 fica no endereço "/" (sem ?pagina=1)
  const endereco = (numero) => (numero === 1 ? "/" : `/?pagina=${numero}`);

  return (
    <nav className="paginacao" aria-label="Páginas do catálogo">
      <div className="paginacao__lado">
        {pagina > 1 && (
          <Botao variante="secundario" pequeno para={endereco(pagina - 1)}>
            ← Anteriores
          </Botao>
        )}
      </div>

      <p className="paginacao__info">
        Filmes {primeiro}–{ultimo} de {props.total} · página {pagina} de {totalPaginas}
      </p>

      <div className="paginacao__lado paginacao__lado--direita">
        {pagina < totalPaginas && (
          <Botao variante="secundario" pequeno para={endereco(pagina + 1)}>
            Próximos {proximos} →
          </Botao>
        )}
      </div>
    </nav>
  );
};

export default Paginacao;
