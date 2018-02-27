# SpeechMatch

In voice applications, e.g. Alexa Skills, Google Actions, the text returned by the speech recognition (ASR) algorithm of the platform might not be the exact match of the expected values. When performing approximate string matching against a small set of candidates, existing matching algorithms might not give the best result in some cases, e.g.

Candidate 1 : Red wine
Candidate 2 : Madeline

Input: Mad line
