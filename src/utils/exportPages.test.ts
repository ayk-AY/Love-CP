import { describe, expect, it } from "vitest";
import { createCpEntry } from "../data/cp";
import { createSplitPages } from "./exportPages";

describe("split export pages", () => {
  it("splits CP rows into pages of four with page labels", () => {
    const entries = Array.from({ length: 9 }, (_, index) =>
      createCpEntry({ id: `cp-${index + 1}`, workTitle: `作品${index + 1}` })
    );

    const pages = createSplitPages(entries, 4);

    expect(pages).toHaveLength(3);
    expect(pages[0].label).toBe("1p目");
    expect(pages[0].entries).toHaveLength(4);
    expect(pages[1].label).toBe("2p目");
    expect(pages[1].entries).toHaveLength(4);
    expect(pages[2].label).toBe("3p目");
    expect(pages[2].entries).toHaveLength(1);
  });
});
