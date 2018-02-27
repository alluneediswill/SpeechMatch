export class WordsPronunciationConverter {
  constructor(private arpabetsDictionary: Map<string, string[][]>) {}

  convert(words: string[], unknownWords?: Set<string>): string[][] {
    if (words.length < 1) {
      return new Array<string[]>();
    }
    const word = words[0];
    const ps = this.arpabetsDictionary.get(word);
    if (!ps) {
      if (unknownWords) {
        unknownWords.add(word);
      }
      return this.convert(words.slice(1), unknownWords);
    }
    const pss = ps.map(p => {
      const restP = this.convert(words.slice(1), unknownWords);
      if (restP.length < 1) {
        return [p];
      } else {
        return restP.map(result => [...p, ...result]);
      }
    });
    return pss.reduce((c: string[][], a: string[][]) => [...c, ...a]);
  }
}
