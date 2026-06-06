import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createCpEntry } from "../data/cp";
import { CpEditor } from "./CpEditor";

function renderEditor(entry = createCpEntry()) {
  render(
    <CpEditor
      entry={entry}
      index={0}
      total={1}
      defaultOpen
      imageUrls={{}}
      onUpdate={vi.fn()}
      onDelete={vi.fn()}
      onMove={vi.fn()}
      onImageUpload={vi.fn()}
      onImageRemove={vi.fn()}
    />
  );
}

describe("CpEditor", () => {
  it("labels the title field as work or CP name", () => {
    renderEditor();

    expect(screen.getByLabelText("作品名やCP名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("作品名やCP名")).toBeInTheDocument();
  });

  it("places the tagline field before the work or CP name field", () => {
    renderEditor();

    const taglineInput = screen.getByPlaceholderText("例：運命に振り回される二人の、最高に美しい共犯関係");
    const titleInput = screen.getByPlaceholderText("作品名やCP名");

    expect(taglineInput.compareDocumentPosition(titleInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("uses left and right labels when the relationship is combo", () => {
    renderEditor(createCpEntry({ relationshipKind: "combo" }));

    expect(screen.getByRole("heading", { name: "左側" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "右側" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "攻めキャラ" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "受けキャラ" })).not.toBeInTheDocument();
  });
});
