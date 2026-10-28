// Cor de destaque de cada gênero, usada no cartaz gerado e nas etiquetas.
// São tons terrosos e verdes, para combinar com a paleta do site.
const CORES_GENEROS = {
  "Ação": "#a4492f",
  "Animação": "#c08a3e",
  "Aventura": "#8f6b3a",
  "Comédia": "#c9a45c",
  "Documentário": "#6d7b62",
  "Drama": "#9c5b3d",
  "Faroeste": "#a8743f",
  "Fantasia": "#7a5f6e",
  "Ficção científica": "#4f7266",
  "Guerra": "#5e6640",
  "Musical": "#b0704f",
  "Policial": "#4a5a3c",
  "Romance": "#a35d55",
  "Suspense": "#3f5a4a",
  "Terror": "#6e2f26",
};

const COR_PADRAO = "#4f6b3a";

export const corDoGenero = (genero) => CORES_GENEROS[genero] ?? COR_PADRAO;
