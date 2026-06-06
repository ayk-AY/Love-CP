import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Plus } from "lucide-react";
import { createCpEntry, createInitialState } from "./data/cp";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ManagementActions } from "./components/ManagementActions";
import { PreviewSheet } from "./components/PreviewSheet";
import { Toolbar } from "./components/Toolbar";
import { CpEditor } from "./components/CpEditor";
import { useImageUrls } from "./hooks/useImageUrls";
import { themeConfigs } from "./themes";
import type { CharacterRole, CpEntry, SheetState, ThemeId } from "./types";
import { buildExportPayload, importPayloadImages, parseExportPayload } from "./utils/exportData";
import { createSplitPages } from "./utils/exportPages";
import { clearImages, deleteImage, saveImageFile } from "./utils/imagesDb";
import { clearSheetState, loadSheetState, saveSheetState } from "./utils/storage";

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function applyEntryPatch(entries: CpEntry[], id: string, patch: Partial<CpEntry>): CpEntry[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
}

export default function App() {
  const [sheetState, setSheetState] = useState<SheetState>(() => loadSheetState());
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isSavingSplit, setIsSavingSplit] = useState(false);
  const [statusMessage, setStatusMessage] = useState("入力内容は自動保存されます");
  const [recentlyAddedEntryId, setRecentlyAddedEntryId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const splitPreviewRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageUrls = useImageUrls(sheetState.cps);

  const selectedTheme = useMemo(() => themeConfigs[sheetState.settings.themeId], [sheetState.settings.themeId]);
  const splitPages = useMemo(() => createSplitPages(sheetState.cps, 4), [sheetState.cps]);

  useEffect(() => {
    saveSheetState(sheetState);
  }, [sheetState]);

  function updateTheme(themeId: ThemeId) {
    setSheetState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        themeId
      }
    }));
  }

  function updateEntry(id: string, patch: Partial<CpEntry>) {
    setSheetState((current) => ({
      ...current,
      cps: applyEntryPatch(current.cps, id, patch)
    }));
  }

  function addEntry() {
    const nextEntry = createCpEntry();
    setSheetState((current) => ({
      ...current,
      cps: [...current.cps, nextEntry]
    }));
    setRecentlyAddedEntryId(nextEntry.id);
    setStatusMessage("CP行を追加しました");
  }

  async function deleteEntry(id: string) {
    const target = sheetState.cps.find((entry) => entry.id === id);
    if (!target || !window.confirm("このCP行を削除しますか？")) {
      return;
    }

    await Promise.all([target.seme.imageId, target.uke.imageId].filter(Boolean).map((imageId) => deleteImage(imageId as string)));
    setSheetState((current) => {
      const nextCps = current.cps.filter((entry) => entry.id !== id);
      return {
        ...current,
        cps: nextCps.length > 0 ? nextCps : [createCpEntry()]
      };
    });
    setStatusMessage("CP行を削除しました");
  }

  function moveEntry(id: string, direction: "up" | "down") {
    setSheetState((current) => {
      const index = current.cps.findIndex((entry) => entry.id === id);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.cps.length) {
        return current;
      }

      const next = [...current.cps];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return {
        ...current,
        cps: next
      };
    });
  }

  async function updateCharacterImage(cpId: string, role: CharacterRole, file: File) {
    const currentEntry = sheetState.cps.find((entry) => entry.id === cpId);
    const existingId = currentEntry?.[role].imageId ?? null;
    const imageId = await saveImageFile(file, existingId);
    setSheetState((current) => ({
      ...current,
      cps: current.cps.map((entry) =>
        entry.id === cpId
          ? {
              ...entry,
              [role]: {
                ...entry[role],
                imageId,
                imagePositionX: 50,
                imagePositionY: 50,
                imageScale: 1
              }
            }
          : entry
      )
    }));
    setStatusMessage("画像をブラウザ内に保存しました");
  }

  async function removeCharacterImage(cpId: string, role: CharacterRole) {
    const entry = sheetState.cps.find((item) => item.id === cpId);
    const imageId = entry?.[role].imageId;
    if (!imageId) {
      return;
    }

    await deleteImage(imageId);
    setSheetState((current) => ({
      ...current,
      cps: current.cps.map((item) =>
        item.id === cpId
          ? {
              ...item,
              [role]: {
                ...item[role],
                imageId: null
              }
            }
          : item
      )
    }));
    setStatusMessage("画像を削除しました");
  }

  async function saveNodeAsPng(node: HTMLElement, filename: string) {
    await document.fonts?.ready;
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: Math.min(window.devicePixelRatio || 2, 3),
      backgroundColor: selectedTheme.exportBackground
    });
    const response = await fetch(dataUrl);
    downloadBlob(await response.blob(), filename);
  }

  async function savePreviewImage() {
    if (!previewRef.current) {
      return;
    }

    setIsSavingImage(true);
    setStatusMessage("1枚PNGを生成中です");

    try {
      await saveNodeAsPng(previewRef.current, "suki-cp-sheet.png");
      setStatusMessage("PNGを保存しました");
    } catch (error) {
      console.error(error);
      setStatusMessage("画像保存に失敗しました。画像を再選択するか、もう一度PNG出力を試してください");
    } finally {
      setIsSavingImage(false);
    }
  }

  async function saveSplitImages() {
    setIsSavingSplit(true);
    setStatusMessage("分割PNGを生成中です");

    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

      for (const page of splitPages) {
        const node = splitPreviewRefs.current[page.index - 1];
        if (!node) {
          throw new Error(`Split preview is missing: ${page.label}`);
        }

        await saveNodeAsPng(node, `suki-cp-sheet-${page.index}p.png`);
      }

      setStatusMessage(`分割PNGを保存しました（${splitPages.length}ページ）`);
    } catch (error) {
      console.error(error);
      setStatusMessage("分割保存に失敗しました。画像を再選択するか、もう一度試してください");
    } finally {
      setIsSavingSplit(false);
    }
  }

  async function exportJson() {
    try {
      const payload = await buildExportPayload(sheetState);
      downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "suki-cp-sheet-backup.json");
      setStatusMessage("JSONを書き出しました");
    } catch (error) {
      console.error(error);
      setStatusMessage("JSON書き出しに失敗しました");
    }
  }

  async function importJson(file: File) {
    if (!window.confirm("現在のデータを上書きしてインポートしますか？")) {
      return;
    }

    try {
      const payload = parseExportPayload(await file.text());
      await clearImages();
      await importPayloadImages(payload.images);
      setSheetState(payload.state);
      setStatusMessage("JSONをインポートしました");
    } catch (error) {
      console.error(error);
      setStatusMessage("インポートに失敗しました。JSONファイルを確認してください");
    }
  }

  async function clearAllData() {
    if (!window.confirm("すべての入力内容と画像を削除しますか？この操作は取り消せません。")) {
      return;
    }

    clearSheetState();
    await clearImages();
    setSheetState(createInitialState());
    setStatusMessage("全データを削除しました");
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="layout">
        <section className="workspace" aria-label="操作と編集">
          <Toolbar
            themeId={sheetState.settings.themeId}
            statusMessage={statusMessage}
            onThemeChange={updateTheme}
          />
          <div className="editor-list" aria-label="CP編集フォーム">
            {sheetState.cps.map((entry, index) => (
              <CpEditor
                key={entry.id}
                entry={entry}
                index={index}
                total={sheetState.cps.length}
                defaultOpen={entry.id === recentlyAddedEntryId || (recentlyAddedEntryId === null && index === 0)}
                imageUrls={imageUrls}
                onUpdate={(patch) => updateEntry(entry.id, patch)}
                onDelete={() => deleteEntry(entry.id)}
                onMove={(direction) => moveEntry(entry.id, direction)}
                onImageUpload={(role, file) => updateCharacterImage(entry.id, role, file)}
                onImageRemove={(role) => removeCharacterImage(entry.id, role)}
              />
            ))}
          </div>
          <div className="add-entry-panel">
            <button className="icon-text-button primary" type="button" onClick={addEntry}>
              <Plus size={18} aria-hidden="true" />
              CP追加
            </button>
          </div>
        </section>

        <section className="preview-panel" aria-label="プレビュー">
          <div className="preview-heading">
            <div>
              <p className="section-kicker">Preview</p>
              <h2>完成プレビュー</h2>
            </div>
            <button className="icon-text-button primary" type="button" onClick={savePreviewImage} disabled={isSavingImage || isSavingSplit}>
              <Download size={18} aria-hidden="true" />
              {isSavingImage ? "生成中" : "1枚で保存"}
            </button>
            <button className="icon-text-button" type="button" onClick={saveSplitImages} disabled={isSavingImage || isSavingSplit}>
              <Download size={18} aria-hidden="true" />
              {isSavingSplit ? "生成中" : "分割保存"}
            </button>
          </div>
          <div className="preview-scroll">
            <PreviewSheet ref={previewRef} state={sheetState} imageUrls={imageUrls} />
          </div>
        </section>
      </main>
      <div className="export-only" aria-hidden="true">
        {splitPages.map((page) => (
          <PreviewSheet
            key={page.index}
            ref={(node) => {
              splitPreviewRefs.current[page.index - 1] = node;
            }}
            state={{ ...sheetState, cps: page.entries }}
            imageUrls={imageUrls}
            pageLabel={page.label}
          />
        ))}
      </div>
      <ManagementActions onExportJson={exportJson} onImportJson={importJson} onClearAll={clearAllData} />
      <Footer />
    </div>
  );
}
