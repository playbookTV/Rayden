"use client";

import { Button } from "@raydenui/ui";

export interface ButtonActionsProps {
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

/** Editable application composition; Button behavior remains in the Rayden package. */
export function ButtonActions({ onSave, onCancel, saving = false }: ButtonActionsProps) {
  return (
    <div aria-label="Changes" role="group" style={{ display: "flex", gap: 12 }}>
      <Button variant="secondary" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={saving} aria-busy={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
