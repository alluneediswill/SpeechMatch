export class SymbolComparator {
  constructor(private symbolTypes: Map<string, string>) {}

  compare(symbol1: string, symbol2: string): number {
    if (symbol1 === symbol2) {
      return 0;
    }

    const type1 = this.symbolTypes.get(symbol1.substring(0,2));
    const type2 = this.symbolTypes.get(symbol2.substring(0,2));

    if (type1 != type2) {
      return 1;
    }

    let baseDiff = 10;

    if (type1 != "vowel") {
      baseDiff -= 4;
    } else {
      baseDiff -= 3;
      if (symbol1.includes(symbol2[0])) {
        baseDiff -= 3;
      }
      if (symbol1.includes(symbol2[1])) {
        baseDiff -= 3;
      }
      if (symbol1[2] == symbol2[2]) {
        baseDiff -= 2;
      }
      if (baseDiff < 0) {
        baseDiff = 0;
      }
    }

    return baseDiff/10;
  }
}
