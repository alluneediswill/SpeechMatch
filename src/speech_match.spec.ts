import {
  SpeechMatch,
  MatchItem,
  create as matcherCreate,
  createWithItems as matcherCreateWithItems
} from "./speech_match";
import { expect } from "chai";
import "mocha";
import { MatcherFactory } from "./factory/matcher_factory";

describe("SpeechMatch with strings", () => {
  let matcher: SpeechMatch;

  before(() => {
    return matcherCreate([
      "Sweet Corn",
      "Sweet co in",
      "madeline",
      "red wine",
      "breed",
      "red"
    ]).then(newMatcher => {
      matcher = newMatcher;
      return matcher;
    });
  });

  it("should create matcher", () => {
    expect(matcher).to.be.ok;
  });

  it("should return exact match", () => {
    expect(matcher.find("Sweet co in")).to.equal("Sweet co in");
  });

  it('should match "Sweet coin" to "Sweet corn" instead of "Sweet co in"', () => {
    expect(matcher.find("Sweet coin")).to.equal("Sweet Corn");
  });

  it('should match "mad line" to "red wine instead of "madeline"', () => {
    expect(matcher.find("mad line")).to.equal("red wine");
  });

  it('should match "bread" to "red instead of "breed"', () => {
    expect(matcher.find("bread")).to.equal("red");
  });
});

class TestItem implements MatchItem {
  constructor(public phrase: string, public priority: number = 0) {}

  modifier(difference: number) {
    return difference - this.priority;
  }
}

describe("SpeechMatch with MatchItems", () => {
  let matcher: SpeechMatch;
  let john1: TestItem;

  before(() => {
    john1 = new TestItem("John", 1);

    const items: TestItem[] = [
      new TestItem("redefine"),
      new TestItem("read line"),
      john1,
      new TestItem("John", 0),
      new TestItem("Jon")
    ];
    return matcherCreateWithItems(items).then(newMatcher => {
      matcher = newMatcher;
      return matcher;
    });
  });

  it("should create matcher", () => {
    expect(matcher).to.be.ok;
  });

  it("should return exact match", () => {
    expect(matcher.find("redefine")).to.equal("redefine");
  });

  it('should match "red fine" to "read line" instead of "redefine"', () => {
    expect(matcher.find("red fine")).to.equal("read line");
  });

  it("should return John1 since it should have lowest difference", () => {
    expect(matcher.findItem("Jon")).to.equal(john1);
  });

  it("should return John1 since its priority is now 100 that should override other words", () => {
    john1.priority = 100;
    expect(matcher.findItem("redefine")).to.equal(john1);
  });
});
