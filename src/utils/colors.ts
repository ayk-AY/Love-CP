export const colorPresets = [
  { label: "ピンク", value: "#f48fb1" },
  { label: "赤", value: "#e8505b" },
  { label: "オレンジ", value: "#ff9f43" },
  { label: "黄", value: "#f7d94c" },
  { label: "緑", value: "#57bd84" },
  { label: "青", value: "#4f83ff" },
  { label: "紫", value: "#9b6be8" },
  { label: "黒", value: "#1f1f24" },
  { label: "白", value: "#ffffff" },
  { label: "グレー", value: "#9ca3af" }
] as const;

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function normalizeHexColor(value: string): string {
  const trimmed = value.trim().replace(/^#/, "").toLowerCase();

  if (/^[0-9a-f]{3}$/.test(trimmed)) {
    return `#${trimmed
      .split("")
      .map((character) => character + character)
      .join("")}`;
  }

  if (/^[0-9a-f]{6}$/.test(trimmed)) {
    return `#${trimmed}`;
  }

  return "#f48fb1";
}

export function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHexColor(hex).slice(1);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function toLinearChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinearChannel(r) + 0.7152 * toLinearChannel(g) + 0.0722 * toLinearChannel(b);
}

export function getReadableTextColor(hex: string): string {
  return getRelativeLuminance(hex) > 0.48 ? "#2b2528" : "#fff9fb";
}

function toHex(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, "0");
}

export function mixWithWhite(hex: string, whiteRatio: number): string {
  const ratio = Math.min(1, Math.max(0, whiteRatio));
  const { r, g, b } = hexToRgb(hex);
  const mixed = {
    r: r * (1 - ratio) + 255 * ratio,
    g: g * (1 - ratio) + 255 * ratio,
    b: b * (1 - ratio) + 255 * ratio
  };

  return `#${toHex(mixed.r)}${toHex(mixed.g)}${toHex(mixed.b)}`;
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
}
