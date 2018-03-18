import { PronunciationEquality } from "./comparison/pronunciation_equality";
import { SymbolComparator } from "./comparison/symbol_comparator";
import { WordsPronunciationConverter } from "./comparison/words_pronunciation_converter";
export interface MatchItem {
    phrase: string;
    modifier?: (n: number) => number;
}
export declare function setup(): void;
export declare function create(candidates: string[]): Promise<SpeechMatch>;
export declare function createWithItems(candidates: MatchItem[]): Promise<SpeechMatch>;
export declare class SpeechMatch {
    private wordsPronunciationConverter;
    private symbolComparator;
    candidates: SpeechCandidate[];
    unknownPronunciation: Set<string>;
    pronunciationComparator: PronunciationEquality;
    constructor(wordsPronunciationConverter: WordsPronunciationConverter, symbolComparator: SymbolComparator);
    setCandidatesFromPhrases(phrases: string[]): SpeechMatch;
    setCandidatesFromMatchItem(matchItems: MatchItem[]): SpeechMatch;
    getUnknownCandidatesInJSON(): string;
    find(phrase: string): string;
    findItem(phrase: string): MatchItem;
}
export declare class SpeechCandidate {
    item: MatchItem;
    arpabets: string[][];
    diff: number[];
    constructor(item: MatchItem, arpabets: string[][]);
}
