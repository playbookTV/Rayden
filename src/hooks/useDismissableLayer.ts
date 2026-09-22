import { useEffect, useRef, type RefObject } from "react";

export type DismissReason = "escape" | "outside-pointer" | "outside-focus";
interface Layer {
  element: HTMLElement;
  active: () => boolean;
  dismiss: (reason: DismissReason) => void;
  focusOutside: () => boolean;
}

// One listener set per document. Nested layers must not all handle the same Escape.
const documents = new WeakMap<Document, { layers: Layer[]; dispose: () => void }>();

function topLayer(layers: Layer[]): Layer | undefined {
  return layers
    .filter((layer) => layer.element.isConnected && layer.active())
    .reduce<
      Layer | undefined
    >((top, layer) => (top && layer.element.contains(top.element) ? top : layer), undefined);
}

function register(document: Document, layer: Layer) {
  let state = documents.get(document);
  if (!state) {
    const layers: Layer[] = [];
    const contains = (layer: Layer, event: Event) => event.composedPath().includes(layer.element);
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
      const top = topLayer(layers);
      if (!top) return;
      // Also prevent the native dialog cancel action when a child popup consumes Escape.
      event.preventDefault();
      event.stopPropagation();
      top.dismiss("escape");
    };
    const pointer = (event: PointerEvent) => {
      if (event.defaultPrevented) return;
      for (const layer of [...layers].reverse()) {
        if (layer.active() && !contains(layer, event)) layer.dismiss("outside-pointer");
      }
    };
    const focus = (event: FocusEvent) => {
      for (const layer of [...layers].reverse()) {
        if (layer.active() && layer.focusOutside() && !contains(layer, event))
          layer.dismiss("outside-focus");
      }
    };
    const blur = (event: FocusEvent) => {
      // A null destination can mean Tab left the document or focus was removed.
      if (event.relatedTarget !== null) return;
      const affected = layers.filter((layer) => contains(layer, event));
      queueMicrotask(() => {
        for (const layer of affected) {
          if (
            layer.active() &&
            layer.focusOutside() &&
            !layer.element.contains(document.activeElement)
          )
            layer.dismiss("outside-focus");
        }
      });
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);
    state = {
      layers,
      dispose: () => {
        document.removeEventListener("keydown", key);
        document.removeEventListener("pointerdown", pointer);
        document.removeEventListener("focusin", focus);
        document.removeEventListener("focusout", blur);
      },
    };
    documents.set(document, state);
  }
  state.layers.push(layer);
  return () => {
    const index = state.layers.indexOf(layer);
    if (index !== -1) state.layers.splice(index, 1);
    if (!state.layers.length) {
      state.dispose();
      documents.delete(document);
    }
  };
}

/** For anchored, non-portalled popup roots. Modal dialogs retain native dismissal. */
export function useDismissableLayer({
  open,
  containerRef,
  onDismiss,
  dismissOnFocusOutside = true,
}: {
  open: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onDismiss: (reason: DismissReason) => void;
  dismissOnFocusOutside?: boolean;
}) {
  const latest = useRef({ open, onDismiss, dismissOnFocusOutside });
  latest.current = { open, onDismiss, dismissOnFocusOutside };
  useEffect(() => {
    const element = containerRef.current;
    if (!open || !element) return;
    return register(element.ownerDocument, {
      element,
      active: () => latest.current.open && element.isConnected,
      dismiss: (reason) => {
        if (latest.current.open) latest.current.onDismiss(reason);
      },
      focusOutside: () => latest.current.dismissOnFocusOutside,
    });
  }, [open, containerRef]);
}
