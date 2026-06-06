import type { CpEntry } from "../types";

export interface SplitExportPage {
  index: number;
  label: string;
  entries: CpEntry[];
}

export function createSplitPages(entries: CpEntry[], pageSize = 4): SplitExportPage[] {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const pages: SplitExportPage[] = [];

  for (let start = 0; start < entries.length; start += safePageSize) {
    const index = pages.length + 1;
    pages.push({
      index,
      label: `${index}p目`,
      entries: entries.slice(start, start + safePageSize)
    });
  }

  return pages;
}
