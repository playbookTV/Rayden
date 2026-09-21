"use client";

import { useEffect, useId, useState } from "react";

interface CatalogComponent {
  name: string;
  description: string;
  exportNames: string[];
  importPath: string;
  prompt: string;
}

interface GuidanceCatalog {
  flavor: string;
  uiVersion: string;
  aiVersion: string;
  components: CatalogComponent[];
  motion?: { exports?: Record<string, { name: string; importPath: string; prompt: string }> };
}

function isCatalog(value: unknown): value is GuidanceCatalog {
  if (!value || typeof value !== "object") return false;
  const catalog = value as Partial<GuidanceCatalog>;
  return (
    typeof catalog.flavor === "string" &&
    typeof catalog.uiVersion === "string" &&
    typeof catalog.aiVersion === "string" &&
    Array.isArray(catalog.components) &&
    catalog.components.every(
      (entry) =>
        typeof entry.name === "string" &&
        typeof entry.description === "string" &&
        typeof entry.importPath === "string" &&
        typeof entry.prompt === "string" &&
        Array.isArray(entry.exportNames) &&
        entry.exportNames.every((name) => typeof name === "string")
    )
  );
}

/** Guidance is generated from the same catalog as the AI package and MCP. */
export function AgentGuidance({ component }: { component?: string }) {
  const id = useId();
  const [catalog, setCatalog] = useState<GuidanceCatalog | null>(null);
  const [selected, setSelected] = useState(component ?? "Button");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/ai/catalog.json", { signal: controller.signal });
        if (!response.ok) throw new Error("Catalog unavailable");
        const data: unknown = await response.json();
        if (!isCatalog(data)) throw new Error("Invalid catalog");
        setCatalog(data);
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "Component guidance is unavailable. The API documentation below is still available."
          );
        }
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  const name = component ?? selected;
  const motionEntries: CatalogComponent[] = Object.values(catalog?.motion?.exports ?? {})
    .filter(
      (entry) =>
        typeof entry.name === "string" &&
        typeof entry.importPath === "string" &&
        typeof entry.prompt === "string"
    )
    .map((entry) => ({
      ...entry,
      exportNames: [entry.name],
      description:
        "Optional motion API for Citrionus. System reduced-motion preferences remain effective.",
    }));
  const entries = [...(catalog?.components ?? []), ...motionEntries];
  const entry = entries.find(
    (candidate) => candidate.name === name || candidate.exportNames.includes(name)
  );

  async function copy() {
    if (!entry) return;
    try {
      await navigator.clipboard.writeText(entry.prompt);
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Select the prompt below and copy it manually.");
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="not-prose my-6 rounded-xl border border-grey-200 bg-grey-50 p-4 text-grey-900 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`${id}-title`} className="m-0 text-base font-semibold">
            Build with an agent
          </h2>
          <p className="mt-1 text-sm text-grey-600">
            Copy component guidance grounded in this release of Citrionus.
          </p>
        </div>
        {entry && (
          <button
            type="button"
            onClick={copy}
            className="min-h-11 rounded-lg bg-action-primary px-4 py-2 text-sm font-medium text-white hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
          >
            Copy prompt
          </button>
        )}
      </div>
      {!catalog && !error && (
        <p role="status" className="mt-3 text-sm">
          Loading component guidance…
        </p>
      )}
      {error && (
        <p role="status" className="mt-3 text-sm">
          {error}
        </p>
      )}
      {catalog && (
        <>
          {!component && (
            <div className="mt-4">
              <label htmlFor={`${id}-component`} className="mb-1 block text-sm font-medium">
                Component
              </label>
              <select
                id={`${id}-component`}
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value);
                  setCopyStatus("");
                }}
                className="min-h-11 w-full rounded-lg border border-grey-300 bg-white px-3 text-base text-grey-900 focus-visible:outline-2 focus-visible:outline-action-primary-text sm:max-w-sm"
              >
                {entries.map((candidate) => (
                  <option key={candidate.name} value={candidate.name}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {entry ? (
            <>
              <p className="mt-4 text-sm">{entry.description}</p>
              <p className="mt-2 break-words text-sm text-grey-600">
                {entry.exportNames.join(", ")} · {entry.importPath}
              </p>
              <p className="mt-2 text-xs text-grey-600">
                Reference UI {catalog.uiVersion} · AI {catalog.aiVersion}. Your installed version
                has not been inspected.
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-action-primary-text">
                  Read or select the prompt
                </summary>
                <textarea
                  aria-label={`${entry.name} agent prompt`}
                  readOnly
                  value={entry.prompt}
                  rows={9}
                  className="mt-2 block w-full resize-y rounded-lg border border-grey-200 bg-white p-3 font-mono text-sm leading-relaxed text-grey-900 focus-visible:outline-2 focus-visible:outline-action-primary-text"
                />
              </details>
              <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-grey-600">
                {copyStatus}
              </p>
            </>
          ) : (
            <p role="status" className="mt-3 text-sm">
              This component is not in the reference catalog.
            </p>
          )}
        </>
      )}
    </section>
  );
}
