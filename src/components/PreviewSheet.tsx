import { forwardRef, type CSSProperties } from "react";
import { getRelationshipOption } from "../data/relationships";
import { themeConfigs } from "../themes";
import { DEFAULT_SHEET_TITLE, type CharacterInfo, type CpEntry, type SheetState } from "../types";
import { getReadableTextColor, mixWithWhite, withAlpha } from "../utils/colors";
import { getImageCropTransform } from "../utils/imageCrop";

interface PreviewSheetProps {
  state: SheetState;
  imageUrls: Record<string, string>;
  pageLabel?: string;
}

function fallback(value: string, text: string): string {
  return value.trim() || text;
}

function characterStyle(character: CharacterInfo) {
  return {
    "--accent": character.color,
    "--accent-soft": mixWithWhite(character.color, 0.84),
    "--accent-border": withAlpha(character.color, 0.54),
    "--accent-strong-text": getReadableTextColor(character.color)
  } as CSSProperties;
}

function CharacterPreview({ character, label, imageUrl }: { character: CharacterInfo; label: string; imageUrl?: string }) {
  const imageStyle = {
    objectPosition: `${character.imagePositionX}% ${character.imagePositionY}%`,
    transform: getImageCropTransform(character),
    transformOrigin: "center center"
  } as CSSProperties;

  return (
    <div className="sheet-character" style={characterStyle(character)}>
      <div className={`sheet-character__image ${character.imageShape === "circle" ? "is-circle" : "is-square"}`}>
        {imageUrl ? <img src={imageUrl} alt={`${label}画像`} style={imageStyle} /> : <span>No Image</span>}
      </div>
      <div className="sheet-character__attribute">{fallback(character.attribute, `${label}属性`)}</div>
      <div className="sheet-character__name">{fallback(character.name, `${label}名`)}</div>
    </div>
  );
}

function CpPreviewRow({ entry, imageUrls }: { entry: CpEntry; imageUrls: Record<string, string> }) {
  const relationship = getRelationshipOption(entry.relationshipKind);
  const isCombo = entry.relationshipKind === "combo";
  const semeLabel = isCombo ? "左側" : "攻め";
  const ukeLabel = isCombo ? "右側" : "受け";

  return (
    <article className="sheet-row">
      <div className="sheet-row__tagline">{fallback(entry.tagline, "おすすめの1文、キャッチコピー")}</div>
      <div className="sheet-grid">
        <div className="sheet-work">
          <strong>{entry.workTitle.trim()}</strong>
        </div>
        <CharacterPreview character={entry.seme} label={semeLabel} imageUrl={entry.seme.imageId ? imageUrls[entry.seme.imageId] : undefined} />
        <div className="sheet-cross" aria-label={relationship.label}>
          <span className="sheet-cross__symbol">{relationship.symbol}</span>
          {entry.relationshipKind === "coupling" && entry.isReversible ? (
            <span className="sheet-cross__badge">リバ</span>
          ) : (
            <span className="sheet-cross__label">{relationship.shortLabel}</span>
          )}
        </div>
        <CharacterPreview character={entry.uke} label={ukeLabel} imageUrl={entry.uke.imageId ? imageUrls[entry.uke.imageId] : undefined} />
        <div className="sheet-comment">
          <p>{fallback(entry.comment, "好きな関係性やおすすめポイントをここに表示します。")}</p>
        </div>
      </div>
    </article>
  );
}

export const PreviewSheet = forwardRef<HTMLDivElement, PreviewSheetProps>(({ state, imageUrls, pageLabel }, ref) => {
  const theme = themeConfigs[state.settings.themeId];
  const sheetTitle = state.settings.sheetTitle.trim() || DEFAULT_SHEET_TITLE;
  const creatorName = state.settings.showCreatorName ? state.settings.creatorName.trim() : "";
  const hasTitleMeta = creatorName || pageLabel;

  return (
    <div ref={ref} className={`preview-sheet ${theme.className}`}>
      <div className="sheet-title">
        <p>{sheetTitle}</p>
        {hasTitleMeta ? (
          <div className="sheet-title__meta">
            {creatorName ? <span className="sheet-creator">by {creatorName}</span> : null}
            {pageLabel ? <span className="sheet-page-label">{pageLabel}</span> : null}
          </div>
        ) : null}
      </div>
      <div className="sheet-rows">
        {state.cps.map((entry) => (
          <CpPreviewRow key={entry.id} entry={entry} imageUrls={imageUrls} />
        ))}
      </div>
    </div>
  );
});

PreviewSheet.displayName = "PreviewSheet";
