import { Sparkles } from "lucide-react";
import { themeList } from "../themes";
import type { ThemeId } from "../types";

interface ThemeSelectorProps {
  themeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export function ThemeSelector({ themeId, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
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
  );
}
