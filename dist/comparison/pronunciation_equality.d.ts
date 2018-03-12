import { SymbolComparator } from "../comparison/symbol_comparator";
export declare class PronunciationEquality {
    private symbolComparator;
    constructor(symbolComparator: SymbolComparator);
    compare(pron1: string[], pron2: string[]): number;
}
