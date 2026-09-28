import { Component, lazy, Suspense, useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@raydenui/ui/styles.css";
import "./preview.css";
const params = new URLSearchParams(location.search);
const slug = params.get("example") || "button";
const state = params.get("state") || "default";
document.documentElement.classList.toggle("dark", params.get("theme") === "dark");
document.body.dataset.example = slug;
const examples = import.meta.glob<{ default: React.ComponentType<{ state?: string }> }>(
  "./examples/*.tsx"
);
const loader = examples[`./examples/${slug}.tsx`];
const Example = loader ? lazy(loader) : null;
function report(type: string) {
  document.documentElement.dataset.previewStatus = type;
  parent.postMessage({ source: "rayden-preview", type }, location.origin);
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    report("error");
  }
  render() {
    return this.state.failed ? (
      <p role="alert">This preview could not load. Use Reset preview to try again.</p>
    ) : (
      this.props.children
    );
  }
}
function Ready() {
  useEffect(() => {
    report("ready");
  }, []);
  return null;
}
createRoot(document.getElementById("root")!).render(
  <Boundary>
    <Suspense fallback={<p role="status">Loading the Rayden example…</p>}>
      <div className="demo-stage">
        {Example ? (
          <>
            <Example state={state} />
            <Ready />
          </>
        ) : (
          <p role="alert">Example not found.</p>
        )}
      </div>
    </Suspense>
  </Boundary>
);
