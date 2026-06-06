import { describe, expect, it } from "vitest";
import { calculateDraggedImagePosition, getImageCropTransform } from "./imageCrop";

describe("image crop controls", () => {
  it("moves the crop focal point opposite to the drag direction", () => {
    const next = calculateDraggedImagePosition({
      currentX: 50,
      currentY: 50,
      deltaX: -20,
      deltaY: 10,
      width: 100,
      height: 100,
      scale: 1
    });

    expect(next.imagePositionX).toBe(70);
    expect(next.imagePositionY).toBe(40);
  });

  it("clamps the focal point inside the image bounds", () => {
    const next = calculateDraggedImagePosition({
      currentX: 95,
      currentY: 5,
      deltaX: -80,
      deltaY: 80,
      width: 100,
      height: 100,
      scale: 1
    });

    expect(next.imagePositionX).toBe(100);
    expect(next.imagePositionY).toBe(0);
  });

  it("builds a visible pan and zoom transform from crop settings", () => {
    expect(getImageCropTransform({ imagePositionX: 50, imagePositionY: 50, imageScale: 1 })).toBe(
      "translate(0%, 0%) scale(1)"
    );
    expect(getImageCropTransform({ imagePositionX: 70, imagePositionY: 40, imageScale: 2 })).toBe(
      "translate(-20%, 10%) scale(2)"
    );
  });
});
