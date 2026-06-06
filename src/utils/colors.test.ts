import { describe, expect, it } from "vitest";
import { getReadableTextColor, mixWithWhite, normalizeHexColor } from "./colors";

describe("color utilities", () => {
  it("normalizes three and six digit hex colors", () => {
    expect(normalizeHexColor("#f0a")).toBe("#ff00aa");
    expect(normalizeHexColor("336699")).toBe("#336699");
  });

  it("selects readable text colors from background brightness", () => {
    expect(getReadableTextColor("#ffffff")).toBe("#2b2528");
    expect(getReadableTextColor("#111111")).toBe("#fff9fb");
  });

  it("mixes an accent color with white for soft character backgrounds", () => {
    expect(mixWithWhite("#000000", 0.75)).toBe("#bfbfbf");
    expect(mixWithWhite("#ff0000", 0.5)).toBe("#ff8080");
  });
});
