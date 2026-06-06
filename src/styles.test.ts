import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

describe("preview typography styles", () => {
  it("allows emergency wrapping so long character attributes stay inside their cell", () => {
    expect(styles).toContain("line-break: strict");
    expect(styles).toMatch(/\.sheet-character__attribute,\s*\.sheet-character__name\s*{[^}]*min-width:\s*0/s);
    expect(styles).toMatch(/\.sheet-character__attribute,\s*\.sheet-character__name\s*{[^}]*overflow-wrap:\s*anywhere/s);
    expect(styles).not.toMatch(/\.sheet-character__attribute\s*{[^}]*word-break:\s*auto-phrase/s);
  });
});
