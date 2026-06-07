import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createCpEntry, createInitialState } from "../data/cp";
import { PreviewSheet } from "./PreviewSheet";

describe("PreviewSheet", () => {
  it("shows the work or CP name without a work-title label in the finished sheet", () => {
    const entry = createCpEntry({ workTitle: "銀河バディ" });
    const state = {
      ...createInitialState(),
      cps: [entry]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    const workCell = screen.getByText("銀河バディ").closest(".sheet-work");

    expect(workCell).not.toBeNull();
    expect(within(workCell as HTMLElement).queryByText("作品名")).not.toBeInTheDocument();
    expect(screen.getByText("銀河バディ")).toBeInTheDocument();
  });

  it("uses left and right character labels for combo relationships", () => {
    const entry = createCpEntry({ relationshipKind: "combo" });
    const state = {
      ...createInitialState(),
      cps: [entry]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    expect(screen.getByText("左側属性")).toBeInTheDocument();
    expect(screen.getByText("左側名")).toBeInTheDocument();
    expect(screen.getByText("右側属性")).toBeInTheDocument();
    expect(screen.getByText("右側名")).toBeInTheDocument();
    expect(screen.queryByText("攻め属性")).not.toBeInTheDocument();
    expect(screen.queryByText("受け属性")).not.toBeInTheDocument();
  });

  it("shows comment text without a comment label in the finished sheet", () => {
    const entry = createCpEntry({ comment: "この距離感がたまらなく好きです。" });
    const state = {
      ...createInitialState(),
      cps: [entry]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    const commentCell = screen.getByText("この距離感がたまらなく好きです。").closest(".sheet-comment");

    expect(commentCell).not.toBeNull();
    expect(within(commentCell as HTMLElement).queryByText("コメント")).not.toBeInTheDocument();
  });

  it("shows a creator byline only when the name option is enabled and filled", () => {
    const state = {
      ...createInitialState(),
      settings: {
        ...createInitialState().settings,
        showCreatorName: true,
        creatorName: "お名前/@xxxxxx"
      },
      cps: [createCpEntry()]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    expect(screen.getByText("by お名前/@xxxxxx")).toBeInTheDocument();
  });

  it("does not show a creator byline when the name option is disabled", () => {
    const state = {
      ...createInitialState(),
      settings: {
        ...createInitialState().settings,
        showCreatorName: false,
        creatorName: "お名前/@xxxxxx"
      },
      cps: [createCpEntry()]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    expect(screen.queryByText("by お名前/@xxxxxx")).not.toBeInTheDocument();
  });

  it("renders the configured sheet title in the finished sheet header", () => {
    const state = {
      ...createInitialState(),
      settings: {
        ...createInitialState().settings,
        sheetTitle: "推し関係性まとめ"
      },
      cps: [createCpEntry()]
    };

    render(<PreviewSheet state={state} imageUrls={{}} />);

    expect(screen.getByText("推し関係性まとめ")).toBeInTheDocument();
    expect(screen.queryByText("好きCP布教シート")).not.toBeInTheDocument();
  });
});
