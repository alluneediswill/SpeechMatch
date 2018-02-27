import { expect } from "chai";
import "mocha";
import { MatcherFactory } from "./matcher_factory";

describe("Speech matcher factory", () => {
  let factory: MatcherFactory;

  it("should create an instance", async () => {
    factory = await MatcherFactory.getInstance();
    expect(factory).to.be.ok;
  });

  it("should have at least 1000 entries of pronunciation", () => {
    expect(factory.dictionaryParser.wordPronunciations.size).to.be.above(1000);
  });

  it("should have at least 10 entries of symbols", () => {
    expect(factory.symbols.size).to.be.above(10);
  });
});
