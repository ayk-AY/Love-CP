import { useEffect, useMemo, useState } from "react";
import type { CpEntry } from "../types";
import { blobToDataUrl } from "../utils/imageData";
import { getImageRecord } from "../utils/imagesDb";

function getImageIds(cps: CpEntry[]): string[] {
  return Array.from(
    new Set(cps.flatMap((cp) => [cp.seme.imageId, cp.uke.imageId]).filter((id): id is string => Boolean(id)))
  );
}

export function useImageUrls(cps: CpEntry[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const signature = useMemo(() => getImageIds(cps).sort().join("|"), [cps]);

  useEffect(() => {
    let cancelled = false;
    const ids = signature ? signature.split("|") : [];

    async function loadImages() {
      const next: Record<string, string> = {};

      await Promise.all(
        ids.map(async (id) => {
          const record = await getImageRecord(id);
          if (record) {
            next[id] = await blobToDataUrl(record.blob);
          }
        })
      );

      if (cancelled) {
        return;
      }

      setUrls(next);
    }

    loadImages().catch(() => {
      if (!cancelled) {
        setUrls({});
      }
    });

    return () => {
      cancelled = true;
    };
  }, [signature]);

  return urls;
}
