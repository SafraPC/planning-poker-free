import { describe, expect, it } from "vitest";
import {
  computeAgreement,
  computeDistribution,
  isFullUnanimity,
  shouldCelebrateUnanimity,
  votesForStats,
} from "./vote-stats";
import type { VoteValue } from "./types";

describe("votesForStats remove café", () => {
  it("remove COFFEE", () => {
    const input: VoteValue[] = ["M", "COFFEE", "M"];
    expect(votesForStats(input)).toEqual(["M", "M"]);
  });
});

describe("computeDistribution", () => {
  it("ignora café no total e contagens", () => {
    const rows = computeDistribution(["S", "M", "M", "COFFEE"]);
    const by = Object.fromEntries(rows.map((r) => [r.value, r.count]));
    expect(by.M).toBe(2);
    expect(by.S).toBe(1);
    expect(rows.find((r) => r.value === "COFFEE")).toBeUndefined();
    const m = rows.find((r) => r.value === "M");
    expect(m?.share).toBeCloseTo(2 / 3);
  });

  it("vazio retorna vazio", () => {
    expect(computeDistribution([])).toEqual([]);
    expect(computeDistribution(["COFFEE", "COFFEE"])).toEqual([]);
  });
});

describe("computeAgreement", () => {
  it("moda majoritária e percentual", () => {
    const r = computeAgreement(["M", "M", "S", "COFFEE"]);
    expect(r.mode).toBe("M");
    expect(r.percent).toBe(67);
    expect(r.votingCount).toBe(3);
  });

  it("só café zera", () => {
    const r = computeAgreement(["COFFEE"]);
    expect(r.votingCount).toBe(0);
    expect(r.percent).toBe(0);
  });
});

describe("unanimidade", () => {
  it("full unanimity múltiplos", () => {
    expect(isFullUnanimity(["M", "M", "M"])).toBe(true);
    expect(isFullUnanimity(["M", "S"])).toBe(false);
  });

  it("um voto não conta como festa full", () => {
    expect(isFullUnanimity(["M"])).toBe(false);
  });

  it("celebrar com um voto só ainda pode ser true", () => {
    expect(shouldCelebrateUnanimity(["M"])).toBe(true);
  });

  it("celebrar todos iguais sem café", () => {
    expect(shouldCelebrateUnanimity(["L", "L", "COFFEE"])).toBe(true);
  });
});
