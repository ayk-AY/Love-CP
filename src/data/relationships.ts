import { RELATIONSHIP_KINDS, type RelationshipKind } from "../types";

export interface RelationshipOption {
  kind: RelationshipKind;
  symbol: string;
  label: string;
  shortLabel: string;
}

export const relationshipOptions: RelationshipOption[] = [
  {
    kind: "coupling",
    symbol: "×",
    label: "カップリング",
    shortLabel: "CP"
  },
  {
    kind: "seme-to-uke",
    symbol: "→",
    label: "攻めから受けへの片思い",
    shortLabel: "片思い"
  },
  {
    kind: "uke-to-seme",
    symbol: "←",
    label: "受けから攻めへの片思い",
    shortLabel: "片思い"
  },
  {
    kind: "mutual-pining",
    symbol: "⇄",
    label: "両片思い",
    shortLabel: "両片思い"
  },
  {
    kind: "combo",
    symbol: "+",
    label: "コンビ",
    shortLabel: "コンビ"
  }
];

export function isRelationshipKind(value: unknown): value is RelationshipKind {
  return typeof value === "string" && RELATIONSHIP_KINDS.includes(value as RelationshipKind);
}

export function getRelationshipOption(kind: RelationshipKind): RelationshipOption {
  return relationshipOptions.find((option) => option.kind === kind) ?? relationshipOptions[0];
}
