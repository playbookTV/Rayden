import { useEffect, useRef, useState } from "react";

/**
 * Internal selection state shared by the table blocks. Not part of the public package
 * surface — it is imported directly by `src/blocks/*`, deliberately not re-exported from
 * `src/components/Table/index.ts`.
 *
 * ## Reconciliation contract
 *
 * An uncontrolled block's selection covers **only the rows it is currently given**. When
 * `dataIds` changes, any selected id that is no longer present is dropped permanently — it
 * does not return if that row comes back later. So:
 *
 * - Deleting a row deselects it.
 * - Replacing rows with new ids clears the selection, so the header reports "none
 *   selected" rather than a stale "all selected" over unchecked rows.
 * - Filtering or sorting *inside* a block — where `dataIds` stays the whole data set and
 *   `scopeIds` narrows to the visible rows — retains selections of rows that left view.
 * - Filtering or paginating *outside* a block, where the consumer hands over a different
 *   `rows` array, drops the selections that left with it: from the block's side that is
 *   indistinguishable from deletion.
 *
 * Reconciliation is not silent. Dropping ids fires `onSelectionChange` with what remains,
 * so a consumer mirroring the selection cannot run a bulk action against a row that is
 * already gone.
 *
 * Consumers who need a selection to survive paging, or a filter they apply themselves,
 * pass `selectedIds` and own the state. Controlled selection is never reconciled: the
 * supplied value is authoritative, and ids outside the current page are preserved by the
 * toggles rather than dropped.
 *
 * ## Header state
 *
 * Full and partial selection are derived from membership of `scopeIds` (the rows on
 * screen), never from set sizes. Comparing sizes is what let one-of-two read as fully
 * checked, and let a two-of-two selection stay checked after both rows were swapped out.
 */
export interface UseTableSelectionOptions {
  /** Every row id the block was given. Defines what survives reconciliation. */
  dataIds: string[];
  /** Row ids the "select all" control governs. Defaults to `dataIds`. */
  scopeIds?: string[];
  /** Controlled selection. When supplied the block never reconciles it. */
  selectedIds?: string[];
  /** Fired with the full resulting selection, for user interaction and reconciliation. */
  onSelectionChange?: (ids: string[]) => void;
}

export interface TableSelection {
  /** True when every row in scope is selected and there is at least one. */
  allSelected: boolean;
  /** True when some — but not all — rows in scope are selected. Drives `aria-checked="mixed"`. */
  someSelected: boolean;
  isSelected: (id: string) => boolean;
  toggleRow: (id: string) => void;
  /** Selects every row in scope, or clears them, leaving out-of-scope selections alone. */
  toggleAll: () => void;
}

const EMPTY: readonly string[] = [];
const KEY_SEPARATOR = "\u0000";

export function useTableSelection({
  dataIds,
  scopeIds = dataIds,
  selectedIds,
  onSelectionChange,
}: UseTableSelectionOptions): TableSelection {
  const isControlled = selectedIds !== undefined;
  const dataKey = dataIds.join(KEY_SEPARATOR);

  const [state, setState] = useState<{ key: string; ids: readonly string[] }>(() => ({
    key: dataKey,
    ids: EMPTY,
  }));

  // Ids dropped by reconciliation are announced from an effect: the prune itself happens
  // during render, where calling a consumer's handler would be a side effect.
  const pendingEmit = useRef<string[] | null>(null);
  const notify = useRef(onSelectionChange);
  notify.current = onSelectionChange;

  let stored = state.ids;
  if (!isControlled && state.key !== dataKey) {
    // Adjust state during render rather than in an effect, so this render already shows
    // the reconciled selection: React re-runs the component before committing.
    const present = new Set(dataIds);
    const pruned = stored.filter((id) => present.has(id));
    if (pruned.length !== stored.length) {
      stored = pruned;
      pendingEmit.current = pruned;
    }
    setState({ key: dataKey, ids: stored });
  }

  useEffect(() => {
    const dropped = pendingEmit.current;
    if (!dropped) return;
    pendingEmit.current = null;
    notify.current?.(dropped);
  });

  const current = isControlled ? selectedIds : stored;
  const currentSet = new Set(current);
  const scopeSet = new Set(scopeIds);

  const allSelected = scopeIds.length > 0 && scopeIds.every((id) => currentSet.has(id));
  const someSelected = !allSelected && scopeIds.some((id) => currentSet.has(id));

  const commit = (next: string[]) => {
    // This change is already being announced, so the reconciliation effect must not
    // announce it a second time.
    pendingEmit.current = null;
    if (!isControlled) setState({ key: dataKey, ids: next });
    onSelectionChange?.(next);
  };

  return {
    allSelected,
    someSelected,
    isSelected: (id) => currentSet.has(id),
    toggleRow: (id) =>
      commit(currentSet.has(id) ? current.filter((x) => x !== id) : [...current, id]),
    toggleAll: () =>
      commit(
        allSelected
          ? current.filter((id) => !scopeSet.has(id))
          : [...current, ...scopeIds.filter((id) => !currentSet.has(id))]
      ),
  };
}
