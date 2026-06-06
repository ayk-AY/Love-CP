import { ChangeEvent, useRef } from "react";
import { FileDown, FileUp, ImageDown, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { themeList } from "../themes";
import type { ThemeId } from "../types";

interface ToolbarProps {
  themeId: ThemeId;
  isSavingImage: boolean;
  isSavingSplit: boolean;
  statusMessage: string;
  onThemeChange: (themeId: ThemeId) => void;
  onAddEntry: () => void;
  onSaveImage: () => void;
  onSaveSplitImages: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onClearAll: () => void;
}

export function Toolbar({
  themeId,
  isSavingImage,
  isSavingSplit,
  statusMessage,
  onThemeChange,
  onAddEntry,
  onSaveImage,
  onSaveSplitImages,
  onExportJson,
  onImportJson,
  onClearAll
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    event.target.value = "";
  }

  return (
    <div className="toolbar">
      <div className="toolbar__theme">
        <label htmlFor="theme-select">
          <Sparkles size={16} aria-hidden="true" />
          デザインテーマ
        </label>
        <select id="theme-select" value={themeId} onChange={(event) => onThemeChange(event.target.value as ThemeId)}>
          {themeList.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
        <p>{themeList.find((theme) => theme.id === themeId)?.description}</p>
      </div>

      <div className="toolbar__actions">
        <button className="icon-text-button" type="button" onClick={onAddEntry}>
          <Plus size={18} aria-hidden="true" />
          CP追加
        </button>
        <button className="icon-text-button primary" type="button" onClick={onSaveImage} disabled={isSavingImage || isSavingSplit}>
          <ImageDown size={18} aria-hidden="true" />
          {isSavingImage ? "生成中" : "1枚で保存"}
        </button>
        <button className="icon-text-button" type="button" onClick={onSaveSplitImages} disabled={isSavingImage || isSavingSplit}>
          <ImageDown size={18} aria-hidden="true" />
          {isSavingSplit ? "生成中" : "分割保存"}
        </button>
        <button className="icon-text-button" type="button" onClick={onExportJson}>
          <FileDown size={18} aria-hidden="true" />
          JSON出力
        </button>
        <button className="icon-text-button" type="button" onClick={() => fileInputRef.current?.click()}>
          <FileUp size={18} aria-hidden="true" />
          JSON読込
        </button>
        <button className="icon-text-button danger" type="button" onClick={onClearAll}>
          <Trash2 size={18} aria-hidden="true" />
          全データ削除
        </button>
        <input ref={fileInputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={handleImport} />
      </div>

      <p className="autosave-status">
        <RotateCcw size={15} aria-hidden="true" />
        {statusMessage}
      </p>
    </div>
  );
}
