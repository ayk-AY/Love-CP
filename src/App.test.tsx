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

  it("updates the finished sheet title from the title input above the name checkbox", () => {
    render(<App />);

    const titleInput = screen.getByLabelText("シートタイトル");
    const nameCheckbox = screen.getByRole("checkbox", { name: "名前" });
    const displaySettings = screen.getByLabelText("シート表示設定");
    const controls = Array.from(displaySettings.querySelectorAll("input"));

    expect(titleInput).toHaveValue("好きCP布教シート");
    expect(controls.indexOf(titleInput as HTMLInputElement)).toBeLessThan(controls.indexOf(nameCheckbox as HTMLInputElement));

    fireEvent.change(titleInput, { target: { value: "推し関係性まとめ" } });

    expect(within(screen.getByLabelText("プレビュー")).getByText("推し関係性まとめ")).toBeInTheDocument();
  });
});
