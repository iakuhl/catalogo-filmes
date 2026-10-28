// 135 → "2h 15min" · 120 → "2h" · 45 → "45min"
export function formatarDuracao(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto}min`;
  if (resto === 0) return `${horas}h`;
  return `${horas}h ${resto}min`;
}

// pluralizar(1, "filme", "filmes") → "1 filme" · pluralizar(3, ...) → "3 filmes"
export const pluralizar = (quantidade, singular, plural) =>
  `${quantidade} ${quantidade === 1 ? singular : plural}`;
