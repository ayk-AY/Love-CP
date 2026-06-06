import { describe, expect, it } from "vitest";
import { themeConfigs, themeList } from "./themes";
import { THEME_IDS } from "./types";

describe("design themes", () => {
  it("offers fifteen selectable themes", () => {
    expect(THEME_IDS).toHaveLength(15);
    expect(themeList).toHaveLength(15);
    expect(Object.keys(themeConfigs)).toHaveLength(15);
  });

  it("keeps every theme id backed by a config", () => {
    for (const id of THEME_IDS) {
      expect(themeConfigs[id]).toBeDefined();
      expect(themeConfigs[id].id).toBe(id);
    }
  });
});
