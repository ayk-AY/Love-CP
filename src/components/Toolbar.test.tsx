import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toolbar } from "./Toolbar";

describe("Toolbar", () => {
  it("keeps only autosave status in the edit toolbar", () => {
    render(<Toolbar statusMessage="入力内容は自動保存されます" />);

    expect(screen.queryByLabelText("デザインテーマ")).not.toBeInTheDocument();
    expect(screen.getByText("入力内容は自動保存されます")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CP追加/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /1枚で保存/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /分割保存/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /JSON出力/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /JSON読込/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /全データ削除/ })).not.toBeInTheDocument();
  });
});
