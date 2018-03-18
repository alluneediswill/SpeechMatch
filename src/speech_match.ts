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
}

export function setup() {
  MatcherFactory.getInstance();
}

export function create(candidates: string[]): Promise<SpeechMatch> {
  return MatcherFactory.getInstance().then(factory => {
    return factory.create().setCandidatesFromPhrases(candidates);
  });
}

export function createWithItems(candidates: MatchItem[]): Promise<SpeechMatch> {
  return MatcherFactory.getInstance().then(factory => {
    return factory.create().setCandidatesFromMatchItem(candidates);
  });
}

export class SpeechMatch {
  candidates: SpeechCandidate[] = [];

  unknownPronunciation: Set<string> = new Set<string>();

  pronunciationComparator: PronunciationEquality;

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

  findItem(phrase: string): MatchItem {
    let minDiff: number = phrase.length * 10;
    let bestCandidate: SpeechCandidate = undefined;

    this.wordsPronunciationConverter
      .convert(splitPhrase(phrase), this.unknownPronunciation)
      .forEach(target => {
        this.candidates.forEach(candidate => {
          candidate.diff = [];
          candidate.arpabets.forEach(pronunciation => {
            let diff = this.pronunciationComparator.compare(
              pronunciation,
              target
            );
            if (candidate.item.modifier) {
              diff = candidate.item.modifier(diff);
            }
            candidate.diff.push(diff);
            if (diff < minDiff) {
              minDiff = diff;
              bestCandidate = candidate;
            }
          });
        });
      });
    return bestCandidate.item;
  }
}

export class SpeechCandidate {
  diff: number[] = [];
  constructor(public item: MatchItem, public arpabets: string[][]) {}
}
