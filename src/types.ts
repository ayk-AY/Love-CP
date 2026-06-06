export const THEME_IDS = [
  "sweet-girly",
  "elegant-classic",
  "pop-candy",
  "dark-romantic",
  "simple-white",
  "dreamy-lavender",
  "mint-soda",
  "rose-magazine",
  "lemon-sherbet",
  "forest-antique",
  "monochrome-zine",
  "neon-pop",
  "sky-letter",
  "berry-bouquet",
  "twilight-jewel"
] as const;

export const RELATIONSHIP_KINDS = ["coupling", "seme-to-uke", "uke-to-seme", "mutual-pining", "combo"] as const;

export type ThemeId = (typeof THEME_IDS)[number];
export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];
export type CharacterRole = "seme" | "uke";
export type ImageShape = "square" | "circle";

export interface CharacterInfo {
  imageId: string | null;
  imageShape: ImageShape;
  imagePositionX: number;
  imagePositionY: number;
  imageScale: number;
  attribute: string;
  name: string;
  color: string;
}

export interface CpEntry {
  id: string;
  workTitle: string;
  tagline: string;
  relationshipKind: RelationshipKind;
  isReversible: boolean;
  seme: CharacterInfo;
  uke: CharacterInfo;
  comment: string;
}

export interface SheetSettings {
  themeId: ThemeId;
}

export interface SheetState {
  version: 1;
  settings: SheetSettings;
  cps: CpEntry[];
  updatedAt: string;
}

export interface StoredImageRecord {
  id: string;
  blob: Blob;
  type: string;
  name: string;
  updatedAt: string;
}

export interface ExportImageRecord {
  id: string;
  type: string;
  name: string;
  dataUrl: string;
}

export interface ExportPayload {
  app: "suki-cp-sheet-maker";
  version: 1;
  exportedAt: string;
  state: SheetState;
  images: ExportImageRecord[];
}
