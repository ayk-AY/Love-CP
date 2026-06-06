import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import type { CharacterInfo, CharacterRole, CpEntry } from "../types";
import { CharacterEditor } from "./CharacterEditor";
import { RelationshipEditor } from "./RelationshipEditor";

interface CpEditorProps {
  entry: CpEntry;
  index: number;
  total: number;
  imageUrls: Record<string, string>;
  onUpdate: (patch: Partial<CpEntry>) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onImageUpload: (role: CharacterRole, file: File) => void;
  onImageRemove: (role: CharacterRole) => void;
}

export function CpEditor({
  entry,
  index,
  total,
  imageUrls,
  onUpdate,
  onDelete,
  onMove,
  onImageUpload,
  onImageRemove
}: CpEditorProps) {
  function updateCharacter(role: CharacterRole, patch: Partial<CharacterInfo>) {
    onUpdate({
      [role]: {
        ...entry[role],
        ...patch
      }
    });
  }

  return (
    <details className="editor-card" open={index === 0}>
      <summary>
        <span className="summary-title">
          <GripVertical size={17} aria-hidden="true" />
          {entry.workTitle || entry.seme.name || entry.uke.name || `CP ${index + 1}`}
        </span>
        <span className="summary-hint">クリックで開閉</span>
      </summary>

      <div className="editor-card__body">
        <div className="editor-actions">
          <button className="icon-text-button compact" type="button" onClick={() => onMove("up")} disabled={index === 0}>
            <ChevronUp size={16} aria-hidden="true" />
            上へ
          </button>
          <button className="icon-text-button compact" type="button" onClick={() => onMove("down")} disabled={index === total - 1}>
            <ChevronDown size={16} aria-hidden="true" />
            下へ
          </button>
          <button className="icon-text-button compact danger" type="button" onClick={onDelete}>
            <Trash2 size={16} aria-hidden="true" />
            削除
          </button>
        </div>

        <label className="field-label">
          作品名
          <input
            type="text"
            maxLength={40}
            value={entry.workTitle}
            onChange={(event) => onUpdate({ workTitle: event.target.value.slice(0, 40) })}
            placeholder="作品名"
          />
        </label>

        <label className="field-label">
          おすすめの1文、キャッチコピー
          <input
            type="text"
            maxLength={80}
            value={entry.tagline}
            onChange={(event) => onUpdate({ tagline: event.target.value.slice(0, 80) })}
            placeholder="例：運命に振り回される二人の、最高に美しい共犯関係"
          />
          <span className="field-counter">{80 - entry.tagline.length}字</span>
        </label>

        <RelationshipEditor
          relationshipKind={entry.relationshipKind}
          isReversible={entry.isReversible}
          onChange={(relationshipKind, isReversible) =>
            onUpdate({
              relationshipKind,
              isReversible: relationshipKind === "coupling" && isReversible
            })
          }
        />

        <div className="character-editor-grid">
          <CharacterEditor
            label="攻めキャラ"
            character={entry.seme}
            imageUrl={entry.seme.imageId ? imageUrls[entry.seme.imageId] : undefined}
            onChange={(patch) => updateCharacter("seme", patch)}
            onImageUpload={(file) => onImageUpload("seme", file)}
            onImageRemove={() => onImageRemove("seme")}
          />
          <CharacterEditor
            label="受けキャラ"
            character={entry.uke}
            imageUrl={entry.uke.imageId ? imageUrls[entry.uke.imageId] : undefined}
            onChange={(patch) => updateCharacter("uke", patch)}
            onImageUpload={(file) => onImageUpload("uke", file)}
            onImageRemove={() => onImageRemove("uke")}
          />
        </div>

        <label className="field-label">
          コメント
          <textarea
            maxLength={500}
            rows={6}
            value={entry.comment}
            onChange={(event) => onUpdate({ comment: event.target.value.slice(0, 500) })}
            placeholder="CPの好きなところ、関係性、おすすめポイントなど"
          />
          <span className="field-counter">{500 - entry.comment.length}字</span>
        </label>
      </div>
    </details>
  );
}
