import { expect } from "chai";
import "mocha";
import { splitPhrase } from "./util";

describe("Speech Fuzzy Match", () => {
  it("can split phrase", () => {
    const phrase = "GET me stuff";
    const words = splitPhrase(phrase);
    expect(words).to.deep.equal(["GET", "ME", "STUFF"]);
  });

  it("can split phrase with punctuation correctly", () => {
    const phrase = "Where is my car? Honey.";
    const words = splitPhrase(phrase);
    expect(words).to.deep.equal(["WHERE", "IS", "MY", "CAR", "HONEY"]);
  });

  it("can split phrase correctly", () => {
    const phrase = "Car";
    const words = splitPhrase(phrase);
    expect(words).to.deep.equal(["CAR"]);
  });
});
