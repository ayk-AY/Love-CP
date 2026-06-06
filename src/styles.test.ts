import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

describe("preview typography styles", () => {
  it("uses natural line breaking for character attributes instead of forced anywhere wrapping", () => {
    expect(styles).toContain("line-break: strict");
    expect(styles).toContain("word-break: auto-phrase");
    expect(styles).toContain("overflow-wrap: break-word");
    expect(styles).not.toMatch(/\.sheet-character__attribute,\s*\.sheet-character__name\s*{[^}]*overflow-wrap:\s*anywhere/s);
  });
});
