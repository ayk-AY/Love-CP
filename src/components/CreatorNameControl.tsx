import { UserRound } from "lucide-react";

interface CreatorNameControlProps {
  enabled: boolean;
  value: string;
  onEnabledChange: (enabled: boolean) => void;
  onNameChange: (value: string) => void;
}

export function CreatorNameControl({ enabled, value, onEnabledChange, onNameChange }: CreatorNameControlProps) {
  return (
    <section className="creator-control" aria-label="名前表示">
      <label className="creator-control__toggle">
        <input type="checkbox" checked={enabled} onChange={(event) => onEnabledChange(event.target.checked)} />
        <span className="creator-control__toggle-text">
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
