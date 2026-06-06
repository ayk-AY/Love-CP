import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public README", () => {
  it("is written for users instead of deployment maintainers", () => {
    const readme = readFileSync("README.md", "utf-8");

    expect(readme).toContain("https://ayk-ay.github.io/Love-CP/");
    expect(readme).not.toContain("GitHub Pagesへの公開方法");
    expect(readme).not.toContain("npm run build");
  });
});
