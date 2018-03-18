import * as readline from "readline";
import * as fs from "fs";
import { MatcherFactory } from "./factory/matcher_factory";
import { PronunciationEquality } from "./comparison/pronunciation_equality";
import { SymbolComparator } from "./comparison/symbol_comparator";
import { WordsPronunciationConverter } from "./comparison/words_pronunciation_converter";
import { splitPhrase } from "./comparison/util";

export interface MatchItem {
  phrase: string;
  modifier?: (n: number) => number;
  pronunciationDiffs?: number[];
}

/** Start the loading process of pronunciation data */
export function warmup() {
  MatcherFactory.getInstance();
}

/** Create matcher with array of strings */
export function createMatcher(candidates: string[]): Promise<SpeechMatch> {
  return MatcherFactory.getInstance().then(factory => {
    return factory.create().setCandidatesFromPhrases(candidates);
  });
}

/** Create matcher with array of objects with following properties:
 *  phrase : string to be matched
 *  modifier : optional function (number)=>(number) that modify the difference before looking for the best candidate
 *  pronunciationDiffs : will be written to be the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
 */
export function createMatcherWithItems(
  candidates: MatchItem[]
): Promise<SpeechMatch> {
  return MatcherFactory.getInstance().then(factory => {
    return factory.create().setCandidatesFromMatchItem(candidates);
  });
}

export class SpeechMatch {
  candidates: SpeechCandidate[] = [];

  unknownPronunciation: Set<string> = new Set<string>();

  pronunciationComparator: PronunciationEquality;

  bestCandidate: SpeechCandidate = undefined;

  constructor(
    private wordsPronunciationConverter: WordsPronunciationConverter,
    private symbolComparator: SymbolComparator
  ) {
    this.pronunciationComparator = new PronunciationEquality(symbolComparator);
  }

  setCandidatesFromPhrases(phrases: string[]): SpeechMatch {
    const phrasesCandidates: SpeechCandidate[] = [];
    phrases.forEach(phrase => {
      const arpabets = this.wordsPronunciationConverter.convert(
        splitPhrase(phrase),
        this.unknownPronunciation
      );
      phrasesCandidates.push(new SpeechCandidate({ phrase: phrase }, arpabets));
    });
    this.candidates = phrasesCandidates;
    return this;
  }

  setCandidatesFromMatchItem(matchItems: MatchItem[]): SpeechMatch {
    const phrasesCandidates: SpeechCandidate[] = [];
    matchItems.forEach(item => {
      const arpabets = this.wordsPronunciationConverter.convert(
        splitPhrase(item.phrase),
        this.unknownPronunciation
      );
      phrasesCandidates.push(new SpeechCandidate(item, arpabets));
    });
    this.candidates = phrasesCandidates;
    return this;
  }

  getUnknownCandidatesInJSON(): string {
    return JSON.stringify({
      unknownWords: Array.from(this.unknownPronunciation.values())
    });
  }

  find(phrase: string): string {
    return this.findItem(phrase).phrase;
  }

  /** Return object with following properties
   *  phrase : string that was matched
   *  pronunciationDiffs : the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
   */
  findItem(phrase: string): MatchItem {
    let minDiff: number = phrase.length * 10;
    this.wordsPronunciationConverter
      .convert(splitPhrase(phrase), this.unknownPronunciation)
      .forEach(target => {
        this.candidates.forEach(candidate => {
          candidate.item.pronunciationDiffs = [];
          candidate.arpabets.forEach(pronunciation => {
            let diff = this.pronunciationComparator.compare(
              pronunciation,
              target
            );
            if (candidate.item.modifier) {
              diff = candidate.item.modifier(diff);
            }
            candidate.item.pronunciationDiffs.push(diff);
            if (diff < minDiff) {
              minDiff = diff;
              this.bestCandidate = candidate;
            }
          });
        });
      });
    return this.bestCandidate.item;
  }
}

export class SpeechCandidate {
  constructor(public item: MatchItem, public arpabets: string[][]) {}
}
