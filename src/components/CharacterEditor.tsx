import { useRef, useState, type CSSProperties, type ChangeEvent, type PointerEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import type { CharacterInfo } from "../types";
import { colorPresets, getReadableTextColor, mixWithWhite } from "../utils/colors";
import { calculateDraggedImagePosition, getImageCropTransform } from "../utils/imageCrop";

interface CharacterEditorProps {
  label: string;
  character: CharacterInfo;
  imageUrl?: string;
  onChange: (patch: Partial<CharacterInfo>) => void;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export function CharacterEditor({ label, character, imageUrl, onChange, onImageUpload, onImageRemove }: CharacterEditorProps) {
  const dragSession = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPositionX: number;
    startPositionY: number;
    width: number;
    height: number;
    scale: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!acceptedImageTypes.includes(file.type)) {
      window.alert("JPG / PNG / WebP の画像を選んでください。");
      event.target.value = "";
      return;
    }

    onImageUpload(file);
    event.target.value = "";
  }

  function handleCropPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!imageUrl) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    dragSession.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPositionX: character.imagePositionX,
      startPositionY: character.imagePositionY,
      width: bounds.width,
      height: bounds.height,
      scale: character.imageScale
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handleCropPointerMove(event: PointerEvent<HTMLDivElement>) {
    const session = dragSession.current;
    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    onChange(
      calculateDraggedImagePosition({
        currentX: session.startPositionX,
        currentY: session.startPositionY,
        deltaX: event.clientX - session.startClientX,
        deltaY: event.clientY - session.startClientY,
        width: session.width,
        height: session.height,
        scale: session.scale
      })
    );
  }

  function handleCropPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragSession.current?.pointerId === event.pointerId) {
      dragSession.current = null;
      setIsDragging(false);
    }
  }

  const accentStyle = {
    "--character-color": character.color,
    "--character-soft": mixWithWhite(character.color, 0.82),
    "--character-text": getReadableTextColor(character.color)
  } as CSSProperties;

  const imageStyle = {
    objectPosition: `${character.imagePositionX}% ${character.imagePositionY}%`,
    transform: getImageCropTransform(character),
    transformOrigin: "center center"
  } as CSSProperties;

  return (
    <section className="character-editor" style={accentStyle}>
      <div className="character-editor__header">
        <h4>{label}</h4>
        <span style={{ background: character.color, color: getReadableTextColor(character.color) }}>Theme</span>
      </div>

      <div className="image-control">
        <div
          className={`image-control__preview ${character.imageShape === "circle" ? "is-circle" : "is-square"} ${
            imageUrl ? "is-draggable" : ""
          } ${isDragging ? "is-dragging" : ""}`}
          onPointerDown={handleCropPointerDown}
          onPointerMove={handleCropPointerMove}
          onPointerUp={handleCropPointerEnd}
          onPointerCancel={handleCropPointerEnd}
          onPointerLeave={handleCropPointerEnd}
        >
          {imageUrl ? <img src={imageUrl} alt={`${label}キャラ画像`} style={imageStyle} /> : <span>画像未設定</span>}
        </div>
        <div className="image-control__buttons">
          <label className="icon-text-button compact">
            <ImagePlus size={16} aria-hidden="true" />
            画像選択
            <input className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
          </label>
          <button className="icon-button" type="button" onClick={onImageRemove} disabled={!imageUrl} aria-label={`${label}画像を削除`}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="segmented-control" aria-label={`${label}画像の形`}>
        <button
          type="button"
          className={character.imageShape === "circle" ? "is-active" : ""}
          onClick={() => onChange({ imageShape: "circle" })}
        >
          丸型
        </button>
        <button
          type="button"
          className={character.imageShape === "square" ? "is-active" : ""}
          onClick={() => onChange({ imageShape: "square" })}
        >
          正方形
        </button>
      </div>

      {imageUrl ? (
        <div className="image-adjust-controls">
          <label className="range-label">
            拡大率 <span>{character.imageScale.toFixed(1)}x</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={character.imageScale}
              onChange={(event) => onChange({ imageScale: Number(event.target.value) })}
            />
          </label>
          <label className="range-label">
            横位置 <span>{Math.round(character.imagePositionX)}%</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={character.imagePositionX}
              onChange={(event) => onChange({ imagePositionX: Number(event.target.value) })}
            />
          </label>
          <label className="range-label">
            縦位置 <span>{Math.round(character.imagePositionY)}%</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={character.imagePositionY}
              onChange={(event) => onChange({ imagePositionY: Number(event.target.value) })}
            />
          </label>
        </div>
      ) : null}

      <label className="field-label">
        キャラ属性
        <input
          type="text"
          maxLength={40}
          value={character.attribute}
          onChange={(event) => onChange({ attribute: event.target.value.slice(0, 40) })}
          placeholder="例：執着強めの天才"
        />
      </label>
      <label className="field-label">
        キャラ名
        <input
          type="text"
          maxLength={40}
          value={character.name}
          onChange={(event) => onChange({ name: event.target.value.slice(0, 40) })}
          placeholder="キャラ名"
        />
      </label>
      <label className="field-label">
        テーマカラー
        <input type="color" value={character.color} onChange={(event) => onChange({ color: event.target.value })} />
      </label>
      <div className="color-presets" aria-label={`${label}プリセットカラー`}>
        {colorPresets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            title={preset.label}
            aria-label={preset.label}
            className={character.color.toLowerCase() === preset.value ? "is-selected" : ""}
            style={{ background: preset.value }}
            onClick={() => onChange({ color: preset.value })}
          />
        ))}
      </div>
    </section>
  );
}
