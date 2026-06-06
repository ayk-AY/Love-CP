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

  it("overrides Dark Romantic character attributes for readable contrast", () => {
    expect(styles).toMatch(/\.theme-dark-romantic\s+\.sheet-character__attribute\s*{[^}]*background:\s*rgba\(43,\s*29,\s*50,\s*0\.9\)/s);
    expect(styles).toMatch(/\.theme-dark-romantic\s+\.sheet-character__attribute\s*{[^}]*color:\s*#fff4fa/s);
  });

  it("keeps creator byline and split page labels inside the sheet header", () => {
    expect(styles).toMatch(/\.sheet-title__meta\s*{[^}]*align-items:\s*flex-end/s);
    expect(styles).toMatch(/\.sheet-title__meta\s*{[^}]*max-width:\s*44%/s);
    expect(styles).toMatch(/\.sheet-page-label,\s*\.sheet-creator\s*{[^}]*max-width:\s*100%/s);
    expect(styles).toMatch(/\.sheet-page-label,\s*\.sheet-creator\s*{[^}]*box-sizing:\s*border-box/s);
  });
});
