import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("shows the creator name input only after the name checkbox is enabled", () => {
    render(<App />);

    expect(screen.queryByLabelText("名前やアカウント名")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "名前" }));

    expect(screen.getByLabelText("名前やアカウント名")).toBeInTheDocument();
  });
});
