"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WordsPronunciationConverter {
    constructor(arpabetsDictionary) {
        this.arpabetsDictionary = arpabetsDictionary;
    }
    convert(words, unknownWords) {
        if (words.length < 1) {
            return new Array();
        }
        const word = words[0];
        const ps = this.arpabetsDictionary.get(word);
        if (!ps) {
            if (unknownWords) {
                unknownWords.add(word);
            }
            return this.convert(words.slice(1), unknownWords);
        }
        const pss = ps.map(p => {
            const restP = this.convert(words.slice(1), unknownWords);
            if (restP.length < 1) {
                return [p];
            }
            else {
                return restP.map(result => [...p, "/", ...result]);
            }
        });
        return pss.reduce((c, a) => [...c, ...a]);
    }
}
exports.WordsPronunciationConverter = WordsPronunciationConverter;
//# sourceMappingURL=words_pronunciation_converter.js.map