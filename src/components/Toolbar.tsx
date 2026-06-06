import { RotateCcw } from "lucide-react";

interface ToolbarProps {
  statusMessage: string;
}

export function Toolbar({ statusMessage }: ToolbarProps) {
  return (
    <div className="toolbar">
      <p className="autosave-status">
        <RotateCcw size={15} aria-hidden="true" />
        {statusMessage}
      </p>
    </div>
  );
}
