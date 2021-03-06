import { SymbolComparator } from "../comparison/symbol_comparator";
import { WordsPronunciationConverter } from "../comparison/words_pronunciation_converter";
import { splitPhrase } from "./util";

export class PronunciationEquality {
  constructor(private symbolComparator: SymbolComparator) {}

  compare(pron1: string[], pron2: string[]): number {
    if (pron1.length === 0 || pron2.length === 0) {
      return Math.max(pron1.length, pron2.length);
    }
    let diffP: number[] = new Array<number>(pron2.length + 1);
    diffP[0] = 0;
    for (let i = 1; i <= pron2.length; i++) {
      diffP[i] = diffP[i - 1] + this.symbolComparator.symbolCost(pron2[i - 1]);
    }
    // console.log(diffP);

    for (let i1 = 1; i1 <= pron1.length; i1++) {
      const diff: number[] = new Array<number>(pron2.length + 1);
      diff[0] = diffP[0] + this.symbolComparator.symbolCost(pron1[i1 - 1]);
      for (let i2 = 1; i2 <= pron2.length; i2++) {
        const deleteCost =
          diffP[i2] + this.symbolComparator.symbolCost(pron1[i1 - 1]);
        const insertionCost =
          diff[i2 - 1] + this.symbolComparator.symbolCost(pron2[i2 - 1]);
        const substitutionCost =
          diffP[i2 - 1] +
          this.symbolComparator.compare(pron1[i1 - 1], pron2[i2 - 1]);
        diff[i2] = Math.min(deleteCost, insertionCost, substitutionCost);
      }
      diffP = diff;
      // console.log(diffP);
    }
    return diffP.pop();
  }
}
