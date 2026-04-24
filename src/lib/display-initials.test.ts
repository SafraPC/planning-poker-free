import { describe, expect, it } from "vitest";
import { displayNameToInitials } from "./display-initials";

describe("displayNameToInitials", () => {
  it("duas partes: primeira letra de cada", () => {
    expect(displayNameToInitials("Leandro Safra")).toBe("LS");
    expect(displayNameToInitials("  Ana  Maria  Costa ")).toBe("AC");
  });

  it("uma palavra: duas primeiras letras", () => {
    expect(displayNameToInitials("Leandro")).toBe("LE");
  });

  it("nick com @ e uma token", () => {
    expect(displayNameToInitials("@leandro")).toBe("LE");
  });

  it("vazio cai em marcador", () => {
    expect(displayNameToInitials("")).toBe("·");
  });

  it("uma letra: duas colunas com ponto", () => {
    expect(displayNameToInitials("A")).toBe("A·");
  });
});
