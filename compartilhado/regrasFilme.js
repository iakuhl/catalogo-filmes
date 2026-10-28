// Regras de um filme, usadas em dois lugares:
//  - no formulário (front-end), para mostrar os erros antes de enviar;
//  - na API (servidor), para nunca gravar dados inválidos no banco.

export const GENEROS = [
  "Ação",
  "Animação",
  "Aventura",
  "Comédia",
  "Documentário",
  "Drama",
  "Faroeste",
  "Fantasia",
  "Ficção científica",
  "Guerra",
  "Musical",
  "Policial",
  "Romance",
  "Suspense",
  "Terror",
];

export const LIMITE_ELENCO = 50;
export const FILMES_POR_PAGINA = 25; // lista da tela inicial
export const ANO_MINIMO = 1888; // ano do filme mais antigo preservado
export const DURACAO_MAXIMA = 999;
export const TAMANHO_MAXIMO = { titulo: 200, diretor: 150, ator: 100 };

// Aceita lançamentos já anunciados para os próximos anos
export const anoMaximo = () => new Date().getFullYear() + 5;

const paraTexto = (valor) => (valor === null || valor === undefined ? "" : String(valor).trim());

// Nosso ID (codigo): número inteiro positivo de até 9 dígitos,
// para caber na coluna INTEGER do Postgres
export const ehCodigoValido = (valor) => {
  const texto = paraTexto(valor);
  return /^\d{1,9}$/.test(texto) && Number(texto) > 0;
};

// Campos numéricos vazios viram null (para a mensagem "Informe...")
const paraNumero = (valor) => (paraTexto(valor) === "" ? null : Number(valor));

// Compara nomes sem diferenciar maiúsculas de minúsculas
export const contemNome = (lista, nome) =>
  lista.some((item) => item.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"));

// Gêneros desconhecidos vão para o fim (e são apontados por validarFilme)
const posicaoGenero = (genero) => {
  const posicao = GENEROS.indexOf(genero);
  return posicao === -1 ? GENEROS.length : posicao;
};

/**
 * Deixa os dados no formato em que são gravados: textos sem espaços nas
 * pontas, números convertidos, gêneros sem repetição e na ordem da lista,
 * elenco sem nomes vazios ou repetidos (na ordem em que foram adicionados).
 * Valores com o tipo errado são mantidos para que validarFilme os aponte.
 */
export function normalizarFilme(dados = {}) {
  const generos = Array.isArray(dados.generos)
    ? [...new Set(dados.generos.map(paraTexto))].sort((a, b) => posicaoGenero(a) - posicaoGenero(b))
    : dados.generos;

  const elenco = Array.isArray(dados.elenco)
    ? dados.elenco
        .map(paraTexto)
        .filter((nome) => nome !== "")
        .reduce((nomes, nome) => (contemNome(nomes, nome) ? nomes : [...nomes, nome]), [])
    : (dados.elenco ?? []);

  return {
    titulo: paraTexto(dados.titulo),
    anoLancamento: paraNumero(dados.anoLancamento),
    duracaoMinutos: paraNumero(dados.duracaoMinutos),
    diretor: paraTexto(dados.diretor),
    generos,
    elenco,
  };
}

/**
 * Confere um filme já normalizado. Devolve um objeto com uma mensagem
 * por campo inválido, por exemplo { titulo: "Informe o título." }.
 * Objeto vazio significa que o filme está válido.
 */
export function validarFilme(filme) {
  const erros = {};

  if (filme.titulo === "") {
    erros.titulo = "Informe o título.";
  } else if (filme.titulo.length > TAMANHO_MAXIMO.titulo) {
    erros.titulo = `O título pode ter no máximo ${TAMANHO_MAXIMO.titulo} caracteres.`;
  }

  const ano = filme.anoLancamento;
  if (ano === null) {
    erros.anoLancamento = "Informe o ano de lançamento.";
  } else if (!Number.isInteger(ano) || ano < ANO_MINIMO || ano > anoMaximo()) {
    erros.anoLancamento = `Informe um ano entre ${ANO_MINIMO} e ${anoMaximo()}.`;
  }

  const duracao = filme.duracaoMinutos;
  if (duracao === null) {
    erros.duracaoMinutos = "Informe a duração em minutos.";
  } else if (!Number.isInteger(duracao) || duracao < 1 || duracao > DURACAO_MAXIMA) {
    erros.duracaoMinutos = `A duração deve ser um número inteiro entre 1 e ${DURACAO_MAXIMA} minutos.`;
  }

  if (filme.diretor === "") {
    erros.diretor = "Informe o nome do diretor.";
  } else if (filme.diretor.length > TAMANHO_MAXIMO.diretor) {
    erros.diretor = `O nome do diretor pode ter no máximo ${TAMANHO_MAXIMO.diretor} caracteres.`;
  }

  if (!Array.isArray(filme.generos) || filme.generos.length === 0) {
    erros.generos = "Escolha pelo menos um gênero.";
  } else {
    const desconhecido = filme.generos.find((genero) => !GENEROS.includes(genero));
    if (desconhecido !== undefined) {
      erros.generos = `Gênero inválido: "${desconhecido}".`;
    }
  }

  if (!Array.isArray(filme.elenco)) {
    erros.elenco = "O elenco deve ser uma lista de nomes.";
  } else if (filme.elenco.length > LIMITE_ELENCO) {
    erros.elenco = `O elenco pode ter no máximo ${LIMITE_ELENCO} atores.`;
  } else if (filme.elenco.some((nome) => nome.length > TAMANHO_MAXIMO.ator)) {
    erros.elenco = `Cada nome do elenco pode ter no máximo ${TAMANHO_MAXIMO.ator} caracteres.`;
  }

  return erros;
}
