const DEFAULT_WEIGHT = {
  vowel: 10,
  semivowel: 6,
  stop: 4,
  affricate: 4,
  fricative: 4,
  aspirate: 4,
  liquid: 4,
  nasal: 4,
  "/": 4
};

export const DEFAULT_STRESS_WEIGHT = 1;
export const DEFAULT_TYPE_MATCH = 0.75;

export class SymbolComparator {
  constructor(
    private symbolTypes: Map<string, string>,
    public symbolWeight: { [t: string]: number } = DEFAULT_WEIGHT,
    public stressWeight: number = DEFAULT_STRESS_WEIGHT,
    public typeMatchValue: number = DEFAULT_TYPE_MATCH
  ) {}

  compare(symbol1: string, symbol2: string): number {
    if (symbol1 === symbol2) {
      return 0;
    }

    const sym1NoStress = symbol1.substring(0, 2);
    const sym2NoStress = symbol2.substring(0, 2);

    const type1 = this.symbolTypes.get(sym1NoStress);
    const type2 = this.symbolTypes.get(sym2NoStress);

    if (type1 != type2) {
      return Math.max(this.symbolWeight[type1], this.symbolWeight[type2]);
    }

    let baseDiff = this.symbolWeight[type1] * this.typeMatchValue;

    const symbolSimilarities = this.characterDiff(sym1NoStress, sym2NoStress);
    baseDiff = baseDiff * symbolSimilarities;
    if (symbolSimilarities < 1 && type1 === "vowel") {
      if (symbol1[2] == symbol2[2]) {
        baseDiff = baseDiff - this.stressWeight;
      } else {
        baseDiff = baseDiff + this.stressWeight;
      }
    }
    return baseDiff;
  }

  characterDiff(symbol1: string, symbol2: string): number {
    // define symbol1 the longer for the 2 symbols
    if (symbol2.length > symbol1.length) {
      const t = symbol2;
      symbol2 = symbol1;
      symbol1 = t;
    }
    let match = 0;
    for (let i = 0; i < symbol1.length; i++) {
      if (symbol2.includes(symbol1.charAt(i))) {
        match = match + 1;
      }
    }
    return (symbol1.length - match) / symbol1.length;
  }

  symbolCost(symbol: string) {
    const symNoStress = symbol.substring(0, 2);
    const type = this.symbolTypes.get(symNoStress);
    return this.symbolWeight[type];
  }
}
