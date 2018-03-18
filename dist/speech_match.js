"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matcher_factory_1 = require("./factory/matcher_factory");
const pronunciation_equality_1 = require("./comparison/pronunciation_equality");
const util_1 = require("./comparison/util");
/** Start the loading process of pronunciation data */
function warmup() {
    matcher_factory_1.MatcherFactory.getInstance();
}
exports.warmup = warmup;
/** Create matcher with array of strings */
function createMatcher(candidates) {
    return matcher_factory_1.MatcherFactory.getInstance().then(factory => {
        return factory.create().setCandidatesFromPhrases(candidates);
    });
}
exports.createMatcher = createMatcher;
/** Create matcher with array of objects with following properties:
 *  phrase : string to be matched
 *  modifier : optional function (number)=>(number) that modify the difference before looking for the best candidate
 *  pronunciationDiffs : will be written to be the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
 */
function createMatcherWithItems(candidates) {
    return matcher_factory_1.MatcherFactory.getInstance().then(factory => {
        return factory.create().setCandidatesFromMatchItem(candidates);
    });
}
exports.createMatcherWithItems = createMatcherWithItems;
class SpeechMatch {
    constructor(wordsPronunciationConverter, symbolComparator) {
        this.wordsPronunciationConverter = wordsPronunciationConverter;
        this.symbolComparator = symbolComparator;
        this.candidates = [];
        this.unknownPronunciation = new Set();
        this.bestCandidate = undefined;
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
    /** Return object with following properties
     *  phrase : string that was matched
     *  pronunciationDiffs : the numerical values of difference between the possible pronunciation permutation of the phrase and that of target
     */
    findItem(phrase) {
        let minDiff = phrase.length * 10;
        this.wordsPronunciationConverter
            .convert(util_1.splitPhrase(phrase), this.unknownPronunciation)
            .forEach(target => {
            this.candidates.forEach(candidate => {
                candidate.item.pronunciationDiffs = [];
                candidate.arpabets.forEach(pronunciation => {
                    let diff = this.pronunciationComparator.compare(pronunciation, target);
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
exports.SpeechMatch = SpeechMatch;
class SpeechCandidate {
    constructor(item, arpabets) {
        this.item = item;
        this.arpabets = arpabets;
    }
}
exports.SpeechCandidate = SpeechCandidate;
//# sourceMappingURL=speech_match.js.map