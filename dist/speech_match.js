"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matcher_factory_1 = require("./factory/matcher_factory");
const pronunciation_equality_1 = require("./comparison/pronunciation_equality");
const util_1 = require("./comparison/util");
function setup() {
    matcher_factory_1.MatcherFactory.getInstance();
}
exports.setup = setup;
function create(candidates) {
    return matcher_factory_1.MatcherFactory.getInstance().then(factory => {
        return factory.create().setCandidatesFromPhrases(candidates);
    });
}
exports.create = create;
function createWithItems(candidates) {
    return matcher_factory_1.MatcherFactory.getInstance().then(factory => {
        return factory.create().setCandidatesFromMatchItem(candidates);
    });
}
exports.createWithItems = createWithItems;
class SpeechMatch {
    constructor(wordsPronunciationConverter, symbolComparator) {
        this.wordsPronunciationConverter = wordsPronunciationConverter;
        this.symbolComparator = symbolComparator;
        this.candidates = [];
        this.unknownPronunciation = new Set();
        this.pronunciationComparator = new pronunciation_equality_1.PronunciationEquality(symbolComparator);
    }
    setCandidatesFromPhrases(phrases) {
        const phrasesCandidates = [];
        phrases.forEach(phrase => {
            const arpabets = this.wordsPronunciationConverter.convert(util_1.splitPhrase(phrase), this.unknownPronunciation);
            phrasesCandidates.push(new SpeechCandidate({ phrase: phrase }, arpabets));
        });
        this.candidates = phrasesCandidates;
        return this;
    }
    setCandidatesFromMatchItem(matchItems) {
        const phrasesCandidates = [];
        matchItems.forEach(item => {
            const arpabets = this.wordsPronunciationConverter.convert(util_1.splitPhrase(item.phrase), this.unknownPronunciation);
            phrasesCandidates.push(new SpeechCandidate(item, arpabets));
        });
        this.candidates = phrasesCandidates;
        return this;
    }
    getUnknownCandidatesInJSON() {
        return JSON.stringify({
            unknownWords: Array.from(this.unknownPronunciation.values())
        });
    }
    find(phrase) {
        return this.findItem(phrase).phrase;
    }
    findItem(phrase) {
        let minDiff = phrase.length * 10;
        let bestCandidate = undefined;
        this.wordsPronunciationConverter
            .convert(util_1.splitPhrase(phrase), this.unknownPronunciation)
            .forEach(target => {
            this.candidates.forEach(candidate => {
                candidate.diff = [];
                candidate.arpabets.forEach(pronunciation => {
                    let diff = this.pronunciationComparator.compare(pronunciation, target);
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
exports.SpeechMatch = SpeechMatch;
class SpeechCandidate {
    constructor(item, arpabets) {
        this.item = item;
        this.arpabets = arpabets;
        this.diff = [];
    }
}
exports.SpeechCandidate = SpeechCandidate;
//# sourceMappingURL=speech_match.js.map