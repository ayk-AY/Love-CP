import { describe, expect, it } from "vitest";
import { createCpEntry, createInitialState } from "./cp";

describe("CP data factories", () => {
  it("creates CP entries with seme and uke defaults", () => {
    const entry = createCpEntry();

    expect(entry.id).toMatch(/^cp-/);
    expect(entry.workTitle).toBe("");
    expect(entry.seme.color).toBe("#ffffff");
    expect(entry.seme.imagePositionX).toBe(50);
    expect(entry.seme.imagePositionY).toBe(50);
    expect(entry.seme.imageScale).toBe(1);
    expect(entry.uke.color).toBe("#ffffff");
    expect(entry.relationshipKind).toBe("coupling");
    expect(entry.isReversible).toBe(false);
    expect(entry.comment).toBe("");
  });

  it("creates initial state with one editable CP row", () => {
    const state = createInitialState();

    expect(state.settings.themeId).toBe("simple-white");
    expect(state.cps).toHaveLength(1);
  });
});
