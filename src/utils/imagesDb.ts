import { makeId } from "../data/cp";
import type { ExportImageRecord, StoredImageRecord } from "../types";

const DB_NAME = "suki-cp-sheet-images";
const DB_VERSION = 1;
const STORE_NAME = "images";

function openImageDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("このブラウザではIndexedDBを利用できません。"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveImageFile(file: File, existingId?: string | null): Promise<string> {
  const id = existingId ?? makeId("img");
  const db = await openImageDb();
  const record: StoredImageRecord = {
    id,
    blob: file,
    type: file.type,
    name: file.name,
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => {
      db.close();
      resolve(id);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function saveImportedImage(image: ExportImageRecord): Promise<void> {
  const response = await fetch(image.dataUrl);
  const blob = await response.blob();
  const db = await openImageDb();
  const record: StoredImageRecord = {
    id: image.id,
    blob,
    type: image.type || blob.type || "image/png",
    name: image.name || "imported-image",
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getImageRecord(id: string): Promise<StoredImageRecord | null> {
  const db = await openImageDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as StoredImageRecord | undefined) ?? null);
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function deleteImage(id: string): Promise<void> {
  const db = await openImageDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function clearImages(): Promise<void> {
  const db = await openImageDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getImageRecords(ids: string[]): Promise<StoredImageRecord[]> {
  const uniqueIds = Array.from(new Set(ids));
  const records = await Promise.all(uniqueIds.map((id) => getImageRecord(id)));
  return records.filter((record): record is StoredImageRecord => record !== null);
}
