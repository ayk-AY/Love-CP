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
  },
  "dreamy-lavender": {
    id: "dreamy-lavender",
    name: "Dreamy Lavender",
    description: "ラベンダーと淡い水色の、夢っぽくやわらかい雰囲気",
    className: "theme-dreamy-lavender",
    exportBackground: "#f7f2ff"
  },
  "mint-soda": {
    id: "mint-soda",
    name: "Mint Soda",
    description: "ミントとソーダブルーの、軽く爽やかなポップ調",
    className: "theme-mint-soda",
    exportBackground: "#f0fffb"
  },
  "rose-magazine": {
    id: "rose-magazine",
    name: "Rose Magazine",
    description: "ローズとグレージュを使った、可愛すぎない雑誌風",
    className: "theme-rose-magazine",
    exportBackground: "#fff4f5"
  },
  "lemon-sherbet": {
    id: "lemon-sherbet",
    name: "Lemon Sherbet",
    description: "レモン色と淡い青の、明るく軽いデザイン",
    className: "theme-lemon-sherbet",
    exportBackground: "#fffce8"
  },
  "forest-antique": {
    id: "forest-antique",
    name: "Forest Antique",
    description: "深い緑とアンティークゴールドの、落ち着いた雰囲気",
    className: "theme-forest-antique",
    exportBackground: "#f4f7ef"
  },
  "monochrome-zine": {
    id: "monochrome-zine",
    name: "Monochrome Zine",
    description: "白黒と太め罫線の、同人誌ペーパー風",
    className: "theme-monochrome-zine",
    exportBackground: "#ffffff"
  },
  "neon-pop": {
    id: "neon-pop",
    name: "Neon Pop",
    description: "黒地にネオンカラーを効かせた、強めのSNS映え調",
    className: "theme-neon-pop",
    exportBackground: "#101018"
  },
  "sky-letter": {
    id: "sky-letter",
    name: "Sky Letter",
    description: "青空と便箋みたいな、すっきり読みやすい雰囲気",
    className: "theme-sky-letter",
    exportBackground: "#f2fbff"
  },
  "berry-bouquet": {
    id: "berry-bouquet",
    name: "Berry Bouquet",
    description: "ベリーと花束のような、華やかで甘すぎないデザイン",
    className: "theme-berry-bouquet",
    exportBackground: "#fff2f8"
  },
  "twilight-jewel": {
    id: "twilight-jewel",
    name: "Twilight Jewel",
    description: "夕暮れ色と宝石色の、少しドラマチックな雰囲気",
    className: "theme-twilight-jewel",
    exportBackground: "#221b35"
  }
};

export const themeList = Object.values(themeConfigs);
