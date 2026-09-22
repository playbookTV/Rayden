# Internal interaction helpers

These hooks are internal to Rayden; public component props remain the consumer contract.

- `useControllableValue` owns the controlled/uncontrolled value convention. A controlled value is authoritative; callbacks can change identity without resetting state.
- `usePopupList` owns Select/DropdownMenu initial focus, enabled-item navigation, typeahead, trigger arrow keys, dismissal, and immediate focus restoration. Consumer handlers run first and can cancel with `preventDefault()`. Items belong to their nearest menu/listbox, so nested lists do not enter the parent's navigation order.
- `useDismissableLayer` owns document pointer/focus dismissal and Escape for anchored popups, including Tooltip. Escape affects the innermost open layer and prevents a parent native dialog from cancelling on the same key. Callback changes do not reinstall listeners. This helper assumes each popup stays inside its container; portalled popup trees need explicit branch ownership before using it.
- `useCollisionAwareSide` owns the existing side-flipping policy and observes viewport, trigger, and panel size changes. It is not a complete floating-positioning engine: horizontal shifting and clipping-ancestor detection are not provided.
- `useBodyScrollLock` counts open modal locks and restores the original body overflow after the final release, including out-of-order closes. Modal still uses the browser's dialog lifecycle for modal behavior.

Do not add parallel document listeners, delayed focus restoration, or separate open-state helpers in these components. Keep interaction policy here and visual recipes in components. On selection, restore focus before invoking a callback that may open another surface; a delayed focus callback can steal focus from that surface.

The focused browser suite is in `src/components/MaintenanceRegression.stories.tsx`; the existing interaction, sweep, and motion stories also cover these consumers. The native Escape test uses the browser provider because synthetic keyboard events do not execute a dialog's native cancel action.

For icon maintenance, update the canonical SVG registry, run `pnpm icons:build`, then rebuild and run `pnpm check:icons`. The generated name/export catalogs contain no SVG data. `IconSource` and `resolveIcon` define the shared icon-slot convention. Keep the Markdown guide, MDX guide, authored Icon manifest, and generated AI contracts/guidance aligned with the runtime API.
