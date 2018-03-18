import { PronunciationEquality } from "./comparison/pronunciation_equality";
import { SymbolComparator } from "./comparison/symbol_comparator";
import { WordsPronunciationConverter } from "./comparison/words_pronunciation_converter";
export interface MatchItem {
    phrase: string;
    modifier?: (n: number) => number;
    pronunciationDiffs?: number[];
}
/** Start the loading process of pronunciation data */
export declare function warmup(): void;
/** Create matcher with array of strings */
export declare function createMatcher(candidates: string[]): Promise<SpeechMatch>;
/** Create matcher with array of objects with following properties:
 *  phrase : string to be matched
 *  modifier : optional function (number)=>(number) that modify the difference before looking for the best candidate
 *  pronunciationDiffs : will be written to be the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
 */
export declare function createMatcherWithItems(candidates: MatchItem[]): Promise<SpeechMatch>;
export declare class SpeechMatch {
    private wordsPronunciationConverter;
    private symbolComparator;
    candidates: SpeechCandidate[];
    unknownPronunciation: Set<string>;
    pronunciationComparator: PronunciationEquality;
    bestCandidate: SpeechCandidate;
    constructor(wordsPronunciationConverter: WordsPronunciationConverter, symbolComparator: SymbolComparator);
    setCandidatesFromPhrases(phrases: string[]): SpeechMatch;
    setCandidatesFromMatchItem(matchItems: MatchItem[]): SpeechMatch;
    getUnknownCandidatesInJSON(): string;
    find(phrase: string): string;
    /** Return object with following properties
     *  phrase : string that was matched
     *  pronunciationDiffs : the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
     */
    findItem(phrase: string): MatchItem;
}
export declare class SpeechCandidate {
    item: MatchItem;
    arpabets: string[][];
    constructor(item: MatchItem, arpabets: string[][]);
}
