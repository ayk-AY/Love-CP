import { ChangeEvent, useRef } from "react";
import { FileDown, FileUp, Trash2 } from "lucide-react";

interface ManagementActionsProps {
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onClearAll: () => void;
}

export function ManagementActions({ onExportJson, onImportJson, onClearAll }: ManagementActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    event.target.value = "";
  }

  return (
    <section className="management-panel" aria-label="データ管理">
      <div>
        <p className="section-kicker">Settings</p>
        <h2>データ管理</h2>
      </div>
      <div className="management-actions">
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
    </section>
  );
}
