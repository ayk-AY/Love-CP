import type { ExportImageRecord, ExportPayload, SheetState } from "../types";
import { blobToDataUrl } from "./imageData";
import { repairSheetState } from "./storage";
import { getImageRecords, saveImportedImage } from "./imagesDb";

function collectImageIds(state: SheetState): string[] {
  return state.cps.flatMap((cp) => [cp.seme.imageId, cp.uke.imageId]).filter((id): id is string => Boolean(id));
}

export async function buildExportPayload(state: SheetState): Promise<ExportPayload> {
  const records = await getImageRecords(collectImageIds(state));
  const images: ExportImageRecord[] = await Promise.all(
    records.map(async (record) => ({
      id: record.id,
      type: record.type,
      name: record.name,
      dataUrl: await blobToDataUrl(record.blob)
    }))
  );

  return {
    app: "suki-cp-sheet-maker",
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
    images
  };
}

export function parseExportPayload(raw: string): ExportPayload {
  const parsed = JSON.parse(raw) as Partial<ExportPayload>;
  if (parsed.app !== "suki-cp-sheet-maker" || parsed.version !== 1 || !parsed.state) {
    throw new Error("対応していないJSONファイルです。");
  }

  return {
    app: "suki-cp-sheet-maker",
    version: 1,
    exportedAt: typeof parsed.exportedAt === "string" ? parsed.exportedAt : new Date().toISOString(),
    state: repairSheetState(parsed.state),
    images: Array.isArray(parsed.images)
      ? parsed.images.filter(
          (image): image is ExportImageRecord =>
            typeof image.id === "string" &&
            typeof image.dataUrl === "string" &&
            typeof image.type === "string" &&
            typeof image.name === "string"
        )
      : []
  };
}

export async function importPayloadImages(images: ExportImageRecord[]): Promise<void> {
  await Promise.all(images.map((image) => saveImportedImage(image)));
}
