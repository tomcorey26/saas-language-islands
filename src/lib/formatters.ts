const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
