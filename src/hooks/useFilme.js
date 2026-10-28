import { useEffect, useState } from "react";
import { buscarFilme, filmeNaoExiste, mensagemDeErro } from "../servicos/filmesApi";

// Busca um filme pelo id e controla os estados da busca
// (carregando, erro, filme inexistente). Usado nas páginas de
// detalhes e de edição.
export function useFilme(id) {
  const [filme, setFilme] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [naoExiste, setNaoExiste] = useState(false);

  useEffect(() => {
    // Se o usuário sair da página antes da resposta chegar,
    // a resposta é ignorada (não atualiza o estado).
    let ativo = true;

    setCarregando(true);
    setErro("");
    setNaoExiste(false);

    buscarFilme(id)
      .then((dados) => {
        if (ativo) setFilme(dados);
      })
      .catch((erroBusca) => {
        if (!ativo) return;
        if (filmeNaoExiste(erroBusca)) {
          setNaoExiste(true);
        } else {
          setErro(mensagemDeErro(erroBusca));
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  return { filme, carregando, erro, naoExiste };
}
