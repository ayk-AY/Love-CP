import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useImageUrls", () => ({
  useImageUrls: () => ({})
}));

describe("App layout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("places the design theme selector above the preview instead of the edit workspace", () => {
    render(<App />);

    const workspace = screen.getByLabelText("操作と編集");
    const previewPanel = screen.getByLabelText("プレビュー");

    expect(within(workspace).queryByLabelText("デザインテーマ")).not.toBeInTheDocument();
    expect(within(previewPanel).getByLabelText("デザインテーマ")).toBeInTheDocument();
  });
});
