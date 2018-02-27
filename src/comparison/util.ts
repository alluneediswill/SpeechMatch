export function splitPhrase(phrase: string): string[] {
  return phrase.toUpperCase().match(/[A-Z]+/g);
}
