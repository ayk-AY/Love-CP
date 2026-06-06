import type { CharacterInfo, CharacterRole, CpEntry, SheetState } from "../types";

export function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCharacter(role: CharacterRole): CharacterInfo {
  return {
    imageId: null,
    imageShape: "circle",
    imagePositionX: 50,
    imagePositionY: 50,
    imageScale: 1,
    attribute: "",
    name: "",
    color: "#ffffff"
  };
}

export function createCpEntry(overrides: Partial<CpEntry> = {}): CpEntry {
  return {
    id: overrides.id ?? makeId("cp"),
    workTitle: overrides.workTitle ?? "",
    tagline: overrides.tagline ?? "",
    relationshipKind: overrides.relationshipKind ?? "coupling",
    isReversible: overrides.relationshipKind === "coupling" ? (overrides.isReversible ?? false) : false,
    seme: {
      ...createCharacter("seme"),
      ...overrides.seme
    },
    uke: {
      ...createCharacter("uke"),
      ...overrides.uke
    },
    comment: overrides.comment ?? ""
  };
}

export function createInitialState(): SheetState {
  return {
    version: 1,
    settings: {
      themeId: "simple-white"
    },
    cps: [createCpEntry()],
    updatedAt: new Date().toISOString()
  };
}
