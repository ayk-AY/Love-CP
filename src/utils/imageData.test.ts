import { describe, expect, it } from "vitest";
import { blobToDataUrl } from "./imageData";

describe("image data helpers", () => {
  it("converts image blobs into data URLs for stable PNG export", async () => {
    const blob = new Blob(["fake-image"], { type: "image/png" });

    const dataUrl = await blobToDataUrl(blob);

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
});
