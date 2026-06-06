import { beforeEach, describe, expect, it } from "vitest";
import { createInitialState } from "../data/cp";
import { loadSheetState, repairSheetState, saveSheetState } from "./storage";

describe("localStorage persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads a default state when localStorage is empty", () => {
    const state = loadSheetState();

    expect(state.cps).toHaveLength(1);
    expect(state.settings.themeId).toBe("simple-white");
  });

  it("saves and restores sheet state", () => {
    const state = createInitialState();
    state.cps[0].workTitle = "テスト作品";
    state.settings.themeId = "dark-romantic";

    saveSheetState(state);

    expect(loadSheetState().cps[0].workTitle).toBe("テスト作品");
    expect(loadSheetState().settings.themeId).toBe("dark-romantic");
  });

  it("repairs relationship settings and keeps old backups compatible", () => {
    const state = repairSheetState({
      version: 1,
      settings: { themeId: "simple-white" },
      cps: [
        {
          id: "legacy",
          workTitle: "作品",
          seme: {},
          uke: {},
          relationshipKind: "combo",
          isReversible: true
        }
      ],
      updatedAt: "2026-06-06T00:00:00.000Z"
    });

    expect(state.cps[0].relationshipKind).toBe("combo");
    expect(state.cps[0].isReversible).toBe(false);
  });

  it("repairs image crop settings with safe bounds", () => {
    const state = repairSheetState({
      version: 1,
      settings: { themeId: "simple-white" },
      cps: [
        {
          id: "crop-test",
          seme: {
            imagePositionX: -20,
            imagePositionY: 140,
            imageScale: 9
          },
          uke: {}
        }
      ],
      updatedAt: "2026-06-06T00:00:00.000Z"
    });

    expect(state.cps[0].seme.imagePositionX).toBe(0);
    expect(state.cps[0].seme.imagePositionY).toBe(100);
    expect(state.cps[0].seme.imageScale).toBe(3);
    expect(state.cps[0].uke.imagePositionX).toBe(50);
    expect(state.cps[0].uke.imagePositionY).toBe(50);
    expect(state.cps[0].uke.imageScale).toBe(1);
  });
});
