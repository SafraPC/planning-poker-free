import { describe, expect, it } from "vitest";
import { parseSalaInviteInput } from "./parse-sala-invite";

describe("parseSalaInviteInput", () => {
  it("aceita URL completa com path /sala", () => {
    const r = parseSalaInviteInput(
      "http://localhost:3000/sala?token=abc&name=Jo",
    );
    if ("error" in r) throw r.error;
    expect(r.path).toContain("token=abc");
    expect(r.path).toMatch(/^\/sala\?/);
    expect(r.path).toContain("name=Jo");
  });

  it("aceita s? com query só", () => {
    const r = parseSalaInviteInput("?token=xyz1");
    if ("error" in r) throw r.error;
    expect(r.path).toBe("/sala?token=xyz1");
  });

  it("aceita string de query", () => {
    const r = parseSalaInviteInput("token=ab&name=X");
    if ("error" in r) throw r.error;
    expect(r.path).toContain("token=ab");
  });

  it("rejeita sem token", () => {
    const r = parseSalaInviteInput("http://x.com/sala?foo=1");
    expect("error" in r).toBe(true);
  });
});
