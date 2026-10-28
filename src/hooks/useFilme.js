import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buscarFilme, filmeNaoExiste, mensagemDeErro } from "../servicos/filmesApi";

// Busca um filme pelo nosso ID (codigo) e controla os estados da busca:
// carregando, erro e filme inexistente. Sem codigo, não busca nada.
export function useFilme(codigo) {
  const [filme, setFilme] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(codigo));
  const [erro, setErro] = useState("");
  const [naoExiste, setNaoExiste] = useState(false);

  useEffect(() => {
    // Limpa o resultado anterior antes de uma nova busca
    setFilme(null);
    setErro("");
    setNaoExiste(false);

    if (!codigo) {
      setCarregando(false);
      return;
    }

    // Se o usuário sair da página (ou buscar outro ID) antes da resposta
    // chegar, a resposta antiga é ignorada.
    let ativo = true;
    setCarregando(true);

    buscarFilme(codigo)
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
  }, [codigo]);

  return { filme, carregando, erro, naoExiste };
}

// Usado nas telas Alterar e Remover. O ID buscado fica no endereço
// (ex.: /alterar?codigo=7), então a busca continua valendo ao recarregar.
export function useFilmeBuscado() {
  const [parametros, setParametros] = useSearchParams();
  const codigo = parametros.get("codigo");

  const buscar = (novoCodigo) => setParametros({ codigo: String(novoCodigo) });

  return { codigo, buscar, ...useFilme(codigo) };
}
