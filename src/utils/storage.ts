import { createCharacter, createCpEntry, createInitialState } from "../data/cp";
import { isRelationshipKind } from "../data/relationships";
import { THEME_IDS, type CharacterInfo, type CharacterRole, type CpEntry, type SheetState, type ThemeId } from "../types";
import { normalizeHexColor } from "./colors";

export const STORAGE_KEY = "suki-cp-sheet-state-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function limit(value: unknown, maxLength: number): string {
  return asString(value).slice(0, maxLength);
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numeric));
}

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.includes(value as ThemeId);
}

function repairCharacter(value: unknown, role: CharacterRole): CharacterInfo {
  const fallback = createCharacter(role);

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    imageId: typeof value.imageId === "string" ? value.imageId : null,
    imageShape: value.imageShape === "square" ? "square" : "circle",
    imagePositionX: clampNumber(value.imagePositionX, fallback.imagePositionX, 0, 100),
    imagePositionY: clampNumber(value.imagePositionY, fallback.imagePositionY, 0, 100),
    imageScale: clampNumber(value.imageScale, fallback.imageScale, 1, 3),
    attribute: limit(value.attribute, 40),
    name: limit(value.name, 40),
    color: normalizeHexColor(asString(value.color, fallback.color))
  };
}

function repairEntry(value: unknown): CpEntry {
  if (!isRecord(value)) {
    return createCpEntry();
  }

  const relationshipKind = isRelationshipKind(value.relationshipKind) ? value.relationshipKind : "coupling";

  return createCpEntry({
    id: typeof value.id === "string" ? value.id : undefined,
    workTitle: limit(value.workTitle, 40),
    tagline: limit(value.tagline, 80),
    relationshipKind,
    isReversible: relationshipKind === "coupling" && value.isReversible === true,
    seme: repairCharacter(value.seme, "seme"),
    uke: repairCharacter(value.uke, "uke"),
    comment: limit(value.comment, 500)
  });
}

export function repairSheetState(value: unknown): SheetState {
  const fallback = createInitialState();

  if (!isRecord(value)) {
    return fallback;
  }

  const settings = isRecord(value.settings) ? value.settings : ({} as Record<string, unknown>);
  const cps = Array.isArray(value.cps) ? value.cps.map(repairEntry) : fallback.cps;

  return {
    version: 1,
    settings: {
      themeId: isThemeId(settings.themeId) ? settings.themeId : fallback.settings.themeId,
      sheetTitle: limit(settings.sheetTitle, 40).trim() || fallback.settings.sheetTitle,
      showCreatorName: settings.showCreatorName === true,
      creatorName: limit(settings.creatorName, 40)
    },
    cps: cps.length > 0 ? cps : fallback.cps,
    updatedAt: asString(value.updatedAt, new Date().toISOString())
  };
}

export function loadSheetState(): SheetState {
  if (typeof localStorage === "undefined") {
    return createInitialState();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    return repairSheetState(JSON.parse(raw));
  } catch {
    return createInitialState();
  }
}

export function saveSheetState(state: SheetState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString()
    })
  );
}

export function clearSheetState(): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
