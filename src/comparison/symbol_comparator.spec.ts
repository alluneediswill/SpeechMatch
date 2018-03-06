import { expect } from "chai";
import "mocha";
import { MatcherFactory } from "../factory/matcher_factory";
import { SymbolComparator } from "./symbol_comparator";

describe("Equal comparator", () => {
  let comparator: SymbolComparator;

  before(() => {
    return MatcherFactory.getInstance().then(factory => {
      comparator = new SymbolComparator(factory.symbols);
      return comparator;
    });
  });

  it("calculates difference of same symbol as 0", () => {
    expect(comparator.compare("F", "F")).to.equal(0);
  });

  it("calculates difference between a fricative and stop symbol to be the max of both", () => {
    expect(comparator.compare("F", "G")).to.equal(
      comparator.symbolWeight["fricative"]
    );
  });

  it("calculates difference between symbols of same types to be less (for now fixed reducation ratio of 0.75)", () => {
    expect(comparator.compare("F", "S")).to.equal(
      comparator.symbolWeight["fricative"] * comparator.typeMatchValue
    );
  });

  it("calculates difference between symbols with all different characters with same stress to be same reduction", () => {
    expect(comparator.compare("OW1", "IH1")).to.equal(
      comparator.symbolWeight["vowel"] * comparator.typeMatchValue
    );
  });

  it("calculates difference between symbols to have one shared character out of 2 to have difference halved", () => {
    expect(comparator.compare("TH", "SH")).to.equal(
      comparator.symbolWeight["fricative"] * comparator.typeMatchValue / 2
    );
  });

  it("calculates difference of symbols of same types with 1 same out of 2 characters with same stress to be less (for now fixed value 0.7 / 2)", () => {
    expect(comparator.compare("IY1", "IH1")).to.equal(
      comparator.symbolWeight["vowel"] * comparator.typeMatchValue / 2 -
        comparator.stressWeight
    );
  });

  it("calculates difference of symbols of same types with 1 same out of 2 characters with different stress stress to be more (for now fixed value 0.7 / 2 + 0.1)", () => {
    expect(comparator.compare("IY1", "IH0")).to.equal(
      comparator.symbolWeight["vowel"] * comparator.typeMatchValue / 2 +
        comparator.stressWeight
    );
  });
});
