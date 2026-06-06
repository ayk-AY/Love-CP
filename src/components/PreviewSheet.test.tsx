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
});
