interface DraggedImagePositionInput {
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  width: number;
  height: number;
  scale: number;
}

interface DraggedImagePositionResult {
  imagePositionX: number;
  imagePositionY: number;
}

interface ImageCropTransformInput {
  imagePositionX: number;
  imagePositionY: number;
  imageScale: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateDraggedImagePosition({
  currentX,
  currentY,
  deltaX,
  deltaY,
  width,
  height,
  scale
}: DraggedImagePositionInput): DraggedImagePositionResult {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const safeScale = Math.max(1, scale);
  const xChange = (deltaX / safeWidth) * 100 / safeScale;
  const yChange = (deltaY / safeHeight) * 100 / safeScale;

  return {
    imagePositionX: clamp(Math.round(currentX - xChange), 0, 100),
    imagePositionY: clamp(Math.round(currentY - yChange), 0, 100)
  };
}

export function getImageCropTransform({ imagePositionX, imagePositionY, imageScale }: ImageCropTransformInput): string {
  const translateX = 50 - clamp(imagePositionX, 0, 100);
  const translateY = 50 - clamp(imagePositionY, 0, 100);
  const scale = clamp(imageScale, 1, 3);

  return `translate(${translateX}%, ${translateY}%) scale(${scale})`;
}
