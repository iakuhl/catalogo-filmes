import React, { useState } from "react";
import {
  ANO_MINIMO,
  DURACAO_MAXIMA,
  TAMANHO_MAXIMO,
  anoMaximo,
  normalizarFilme,
  validarFilme,
} from "../../../compartilhado/regrasFilme.js";
import { mensagemDeErro } from "../../servicos/filmesApi";
import CampoTexto from "../CampoTexto/CampoTexto";
import CampoGeneros from "../CampoGeneros/CampoGeneros";
import CampoElenco from "../CampoElenco/CampoElenco";
import Botao from "../Botao/Botao";
import Aviso from "../Aviso/Aviso";
import "./FormularioFilme.css";

// Formulário usado no cadastro e na edição de filmes.
//   filmeInicial: dados para preencher os campos (só na edição)
//   aoSalvar:     recebe o filme já validado e envia para a API
//   textoBotao:   texto do botão de envio
//   rotaCancelar: para onde o botão "Cancelar" leva
const FormularioFilme = (props) => {
  const inicial = props.filmeInicial;

  // Criando os estados (um para cada campo)...
  const [titulo, setTitulo] = useState(inicial ? inicial.titulo : "");
  const [anoLancamento, setAnoLancamento] = useState(inicial ? String(inicial.anoLancamento) : "");
  const [duracaoMinutos, setDuracaoMinutos] = useState(inicial ? String(inicial.duracaoMinutos) : "");
  const [diretor, setDiretor] = useState(inicial ? inicial.diretor : "");
  const [generos, setGeneros] = useState(inicial ? inicial.generos : []);
  const [elenco, setElenco] = useState(inicial ? inicial.elenco : []);

  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Altera o campo e apaga o erro dele, já que o usuário está corrigindo
  const alterar = (campo, setCampo) => (valor) => {
    setCampo(valor);
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  };

  // Leva o foco (e a rolagem) para o primeiro campo com erro
  const focarPrimeiroErro = (errosEncontrados) => {
    const campo = Object.keys(errosEncontrados)[0];
    if (campo) document.getElementById(`campo-${campo}`)?.focus();
  };

  const aoSalvar = async (evento) => {
    evento.preventDefault();

    const filme = normalizarFilme({ titulo, anoLancamento, duracaoMinutos, diretor, generos, elenco });
    const errosEncontrados = validarFilme(filme);

    setErros(errosEncontrados);
    setErroGeral("");

    if (Object.keys(errosEncontrados).length > 0) {
      focarPrimeiroErro(errosEncontrados);
      return;
    }

    setEnviando(true);
    try {
      // Se der certo, a página que usa o formulário navega para outra rota
      await props.aoSalvar(filme);
    } catch (erro) {
      // A API também valida: se ela recusar, os erros aparecem nos campos
      const errosDaApi = erro.response?.data?.erros ?? {};
      setErros(errosDaApi);
      setErroGeral(mensagemDeErro(erro));
      setEnviando(false);
      focarPrimeiroErro(errosDaApi);
    }
  };

  return (
    <form className="formulario-filme" onSubmit={aoSalvar} noValidate>
      {erroGeral && (
        <Aviso tipo="erro" titulo="Não foi possível salvar">
          {erroGeral}
        </Aviso>
      )}

      <div className="formulario-filme__grade">
        <div className="formulario-filme__largo">
          <CampoTexto
            id="campo-titulo"
            label="Título"
            obrigatorio
            placeholder="Ex.: Central do Brasil"
            tamanhoMaximo={TAMANHO_MAXIMO.titulo}
            valor={titulo}
            aoAlterado={alterar("titulo", setTitulo)}
            erro={erros.titulo}
          />
        </div>

        <CampoTexto
          id="campo-anoLancamento"
          label="Ano de lançamento"
          obrigatorio
          tipo="number"
          modoTeclado="numeric"
          min={ANO_MINIMO}
          max={anoMaximo()}
          placeholder="Ex.: 1998"
          valor={anoLancamento}
          aoAlterado={alterar("anoLancamento", setAnoLancamento)}
          erro={erros.anoLancamento}
        />

        <CampoTexto
          id="campo-duracaoMinutos"
          label="Duração (em minutos)"
          obrigatorio
          tipo="number"
          modoTeclado="numeric"
          min={1}
          max={DURACAO_MAXIMA}
          placeholder="Ex.: 113"
          valor={duracaoMinutos}
          aoAlterado={alterar("duracaoMinutos", setDuracaoMinutos)}
          erro={erros.duracaoMinutos}
        />

        <div className="formulario-filme__largo">
          <CampoTexto
            id="campo-diretor"
            label="Nome do diretor"
            obrigatorio
            placeholder="Ex.: Walter Salles"
            tamanhoMaximo={TAMANHO_MAXIMO.diretor}
            valor={diretor}
            aoAlterado={alterar("diretor", setDiretor)}
            erro={erros.diretor}
          />
        </div>
      </div>

      <CampoGeneros
        id="campo-generos"
        valor={generos}
        aoAlterado={alterar("generos", setGeneros)}
        erro={erros.generos}
      />

      <CampoElenco
        id="campo-elenco"
        valor={elenco}
        aoAlterado={alterar("elenco", setElenco)}
        erro={erros.elenco}
      />

      <div className="formulario-filme__acoes">
        <Botao variante="fantasma" para={props.rotaCancelar}>
          Cancelar
        </Botao>
        <Botao tipo="submit" desabilitado={enviando}>
          {enviando ? "Salvando…" : props.textoBotao}
        </Botao>
      </div>
    </form>
  );
};

export default FormularioFilme;
