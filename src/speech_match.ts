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

  static create(candidates: string[]): Promise<SpeechMatch> {
    return MatcherFactory.getInstance().then(factory => {
      const matcher = factory.create();
      matcher.candidates = matcher.candidatesFromPhrases(candidates);
      return matcher;
    });
  }

  static createWithItems(candidates: MatchItem[]): Promise<SpeechMatch> {
    return MatcherFactory.getInstance().then(factory => {
      const matcher = factory.create();
      matcher.candidates = matcher.candidatesFromMatchItem(candidates);
      return matcher;
    });
  }

  private candidatesFromPhrases(phrases: string[]): SpeechCandidate[] {
    const phrasesCandidates: SpeechCandidate[] = [];
    phrases.forEach(phrase => {
      const arpabets = this.wordsPronunciationConverter.convert(
        splitPhrase(phrase),
        this.unknownPronunciation
      );
      phrasesCandidates.push(new SpeechCandidate({ phrase: phrase }, arpabets));
    });
    return phrasesCandidates;
  }

  private candidatesFromMatchItem(matchItems: MatchItem[]): SpeechCandidate[] {
    const phrasesCandidates: SpeechCandidate[] = [];
    matchItems.forEach(item => {
      const arpabets = this.wordsPronunciationConverter.convert(
        splitPhrase(item.phrase),
        this.unknownPronunciation
      );
      phrasesCandidates.push(new SpeechCandidate(item, arpabets));
    });
    return phrasesCandidates;
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
    let minDiff: number = phrase.length;
    let bestCandidate: SpeechCandidate = undefined;

    this.wordsPronunciationConverter
      .convert(splitPhrase(phrase), this.unknownPronunciation)
      .forEach(target => {
        this.candidates.forEach(candidate => {
          candidate.arpabets.forEach(pronunciation => {
            let diff = this.pronunciationComparator.compare(
              pronunciation,
              target
            );
            if (candidate.item.modifier) {
              diff = candidate.item.modifier(diff);
            }
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

class SpeechCandidate {
  constructor(public item: MatchItem, public arpabets: string[][]) {}
}
