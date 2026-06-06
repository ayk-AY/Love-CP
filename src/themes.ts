import type { ThemeId } from "./types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  className: string;
  exportBackground: string;
}

export const themeConfigs: Record<ThemeId, ThemeConfig> = {
  "sweet-girly": {
    id: "sweet-girly",
    name: "Sweet Girly",
    description: "淡いピンクとクリームの、丸みがある可愛い雰囲気",
    className: "theme-sweet-girly",
    exportBackground: "#fff6f8"
  },
  "elegant-classic": {
    id: "elegant-classic",
    name: "Elegant Classic",
    description: "ベージュとブラウンの、上品な雑誌風",
    className: "theme-elegant-classic",
    exportBackground: "#f7efe4"
  },
  "pop-candy": {
    id: "pop-candy",
    name: "Pop Candy",
    description: "明るい色と太め見出しの、SNS映えするポップ調",
    className: "theme-pop-candy",
    exportBackground: "#fff7fd"
  },
  "dark-romantic": {
    id: "dark-romantic",
    name: "Dark Romantic",
    description: "黒、ワインレッド、紫を使った大人っぽい耽美調",
    className: "theme-dark-romantic",
    exportBackground: "#18111d"
  },
  "simple-white": {
    id: "simple-white",
    name: "Simple White",
    description: "白基調で余白多め、情報が読みやすいシンプル調",
    className: "theme-simple-white",
    exportBackground: "#ffffff"
  }
};

export const themeList = Object.values(themeConfigs);
