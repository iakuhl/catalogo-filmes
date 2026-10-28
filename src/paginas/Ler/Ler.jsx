import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useFilme } from "../../hooks/useFilme";
import FichaFilme from "../../componentes/FichaFilme/FichaFilme";
import Botao from "../../componentes/Botao/Botao";
import Carregando from "../../componentes/Carregando/Carregando";
import Aviso from "../../componentes/Aviso/Aviso";
import NaoEncontrada from "../NaoEncontrada/NaoEncontrada";
import "./Ler.css";

// Tela Ler (rota /ler/:codigo): todos os dados do filme escolhido
// na tela inicial e um botão [voltar] para retornar ao início.
const Ler = () => {
  const { codigo } = useParams();
  const location = useLocation();
  const { filme, carregando, erro, naoExiste } = useFilme(codigo);

  // Volta para a mesma página da lista de onde o usuário veio
  const voltarPara = location.state?.voltarPara ?? "/";

  if (naoExiste) {
    return <NaoEncontrada titulo="Filme não encontrado" mensagem={`Não existe filme com o ID ${codigo}.`} />;
  }

  return (
    <section className="ler">
      <div className="ler__voltar">
        <Botao variante="secundario" pequeno para={voltarPara}>
          ← Voltar
        </Botao>
      </div>

      {carregando && <Carregando texto="Carregando filme…" />}

      {erro && (
        <Aviso tipo="erro" titulo="Não foi possível carregar o filme">
          {erro}
        </Aviso>
      )}

      {filme && <FichaFilme filme={filme} nivel={1} />}
    </section>
  );
};

export default Ler;
