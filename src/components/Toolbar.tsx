import { RotateCcw, Sparkles } from "lucide-react";
import { themeList } from "../themes";
import type { ThemeId } from "../types";

interface ToolbarProps {
  themeId: ThemeId;
  statusMessage: string;
  onThemeChange: (themeId: ThemeId) => void;
}

export function Toolbar({
  themeId,
  statusMessage,
  onThemeChange
}: ToolbarProps) {
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

      <p className="autosave-status">
        <RotateCcw size={15} aria-hidden="true" />
        {statusMessage}
      </p>
    </div>
  );
}
