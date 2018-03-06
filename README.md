# SpeechMatch

In voice applications, e.g. Alexa Skills, Google Actions, the text returned by the speech recognition (ASR) algorithm of the platform might not be the exact match of the expected values. When performing approximate string matching against a small set of candidates, existing matching algorithms might not give the best result in some cases, e.g.

At certain shopping step, user can buy either:
1. `brake`
2. `beak`

Alexa recognized user input as `break`. 
A character-by-character match would result in `beak` which is a very different pronunciation than `break`. If we compare the pronunciation, it would correctly identify `brake` instead.

In another example, valid input are
1. `Red wine`
2. `Madeline`

Intepreted speech input is: `Mad line`.
`Madeline` is only 1 character difference. But in pronunciation, `Red wine` could be a better choice 

---

This tool translates the text into the ARPAbets, the phonetic representation of the text, before comparing them. For example:

Word | Pronunciation
:---:|:---:
`brake` | ["B", "R", "EY1", "K"]
`break` | ["B", "R", "EY1", "K"]
`beak` | ["B", "IY1", "K"]
`Red wine` | ["R", "EH1", "D", "/", "W", "AY1", "N"]
`Mad Line` | ["M", "AE1", "D", "/", "L", "AY1", "N"]
`Madeline` | ["M", "AE1", "D", "AH0", "L", "IH0", "N"]

There are a few different types of ARPABETs

Type | ARPABET
---|---
vowel | `AE AH EH IH IY OW OY UH ...`
stop | `B D G K P T` 
affricate | `CH JH`
fricative | `DH F S SH TH V Z ZH`
aspirate | `HH`
liquid | `r l` 
semivowel | `W Y`

This tool uses the CMU pronunciation dictionary to translate words to ARPAbets. It is not perfect, but a good starting point. For more information on ARPAbet, http://www.speech.cs.cmu.edu/cgi-bin/cmudict

---

In terms of comparing ARPAbets to find the closest candidate to a speech recognition result, it can be very complex and dependent on lots of factors, like the ASR algorithm, the speaker accent, and the pronunciation dictionary. It can even be a machine learning model. But as a starting point, the tool uses some heuristics:
1. symbols of the same types have lower difference, e.g. AH and EH are both vowels, B and D are both stops. Even though they are not the same symbols, they should have a lower difference than that of AH and D, for example.
2. in a very broad stroke, symbol with similar characters sounded similar as well, like AE to AH, and SH to ZH, so any pairs of symbols sharing characters should have lower difference as well. This check would include the stress symbols too
3. vowel is usually the strongest sound in the word and have the least chance of wrong recognition, so just as starting point, the weight of vowel is 10, semivowel 6, the rest 4. Vowel stress difference has weight of 1.