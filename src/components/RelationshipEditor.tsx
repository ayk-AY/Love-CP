import type { RelationshipKind } from "../types";
import { relationshipOptions } from "../data/relationships";

interface RelationshipEditorProps {
  relationshipKind: RelationshipKind;
  isReversible: boolean;
  onChange: (relationshipKind: RelationshipKind, isReversible: boolean) => void;
}

export function RelationshipEditor({ relationshipKind, isReversible, onChange }: RelationshipEditorProps) {
  return (
    <section className="relationship-control">
      <div className="relationship-control__header">
        <h4>二人の関係性</h4>
        {relationshipKind === "coupling" ? (
          <label className="reversible-check">
            <input
              type="checkbox"
              checked={isReversible}
              onChange={(event) => onChange("coupling", event.target.checked)}
            />
            リバ
          </label>
        ) : null}
      </div>
      <div className="relationship-options" aria-label="二人の間の記号">
        {relationshipOptions.map((option) => (
          <button
            key={option.kind}
            type="button"
            className={relationshipKind === option.kind ? "is-selected" : ""}
            aria-pressed={relationshipKind === option.kind}
            onClick={() => onChange(option.kind, option.kind === "coupling" ? isReversible : false)}
          >
            <span>{option.symbol}</span>
            <small>{option.label}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
