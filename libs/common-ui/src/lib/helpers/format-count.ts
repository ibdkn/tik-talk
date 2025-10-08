export function formatCount(
  count: number,
  [one, few, many]: [string, string, string],
  locale: string = 'ru-RU'
) {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  let word: string;

  if (mod100 >= 11 && mod100 <= 14) {
    word = many;
  } else if (mod10 === 1) {
    word = one;
  } else if (mod10 >= 2 && mod10 <= 4) {
    word = few;
  } else {
    word = many;
  }

  return `${new Intl.NumberFormat(locale).format(count)} ${word}`;
}
