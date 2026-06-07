import { Type, UserRound } from "lucide-react";

interface SheetDisplaySettingsProps {
  sheetTitle: string;
  onSheetTitleChange: (value: string) => void;
  enabled: boolean;
  value: string;
  onEnabledChange: (enabled: boolean) => void;
  onNameChange: (value: string) => void;
}

export function SheetDisplaySettings({
  sheetTitle,
  onSheetTitleChange,
  enabled,
  value,
  onEnabledChange,
  onNameChange
}: SheetDisplaySettingsProps) {
  return (
    <section className="sheet-settings-control" aria-label="シート表示設定">
      <label className="field-label">
        <span className="sheet-settings-control__label-text">
          <Type size={16} aria-hidden="true" />
          シートタイトル
        </span>
        <input
          type="text"
          value={sheetTitle}
          maxLength={40}
          placeholder="好きCP布教シート"
          onChange={(event) => onSheetTitleChange(event.target.value)}
        />
      </label>
      <label className="sheet-settings-control__toggle">
        <input type="checkbox" checked={enabled} onChange={(event) => onEnabledChange(event.target.checked)} />
        <span className="sheet-settings-control__toggle-text">
          <UserRound size={16} aria-hidden="true" />
          名前
        </span>
      </label>
      {enabled ? (
        <label className="field-label">
          名前やアカウント名
          <input
            type="text"
            value={value}
            maxLength={40}
            placeholder="例：お名前/@xxxxxx"
            onChange={(event) => onNameChange(event.target.value)}
          />
        </label>
      ) : null}
    </section>
  );
}
