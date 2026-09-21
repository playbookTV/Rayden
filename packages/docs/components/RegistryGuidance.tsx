"use client";

import { useEffect, useId, useState } from "react";

interface RegistryItem {
  name: string;
  title?: string;
  description: string;
  meta?: { rayden?: { registryVersion?: string; distribution?: string } };
}

export function RegistryGuidance() {
  const id = useId();
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [selected, setSelected] = useState("button-actions");
  const [origin, setOrigin] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setOrigin(window.location.origin);
    void fetch("/r/registry.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Registry unavailable");
        const data: { items?: RegistryItem[] } = await response.json();
        if (!Array.isArray(data.items) || !data.items.length) throw new Error("Empty registry");
        if (
          data.items.some(
            (item) => !/^[a-z0-9-]+$/.test(item.name) || typeof item.description !== "string"
          )
        ) {
          throw new Error("Invalid registry");
        }
        setItems(data.items);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Registry guidance is unavailable. Follow the setup instructions below.");
      });
    return () => controller.abort();
  }, []);

  const item = items.find((candidate) => candidate.name === selected) ?? items[0];
  const version = item?.meta?.rayden?.registryVersion;
  const namespace = JSON.stringify(
    { registries: { "@rayden": `${origin}/r/${version ? `${version}/` : ""}{name}.json` } },
    null,
    2
  );
  const command = item ? `pnpm dlx shadcn@4.21.0 add @rayden/${item.name}` : "";

  async function copy(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(success);
    } catch {
      setStatus("Select the text below and copy it manually.");
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="not-prose my-6 rounded-xl border border-grey-200 bg-grey-50 p-4 text-grey-900 sm:p-5"
    >
      <h2 id={`${id}-title`} className="text-base font-semibold">
        Try a registry item
      </h2>
      <p className="mt-1 text-sm text-grey-600">
        Configure the namespace in your app before using the install command. This pilot needs the
        locally built UI package for unreleased motion APIs.
      </p>
      {error && (
        <p role="status" className="mt-3 text-sm">
          {error}
        </p>
      )}
      {!error && !item && (
        <p role="status" className="mt-3 text-sm">
          Loading registry items…
        </p>
      )}
      {item && (
        <>
          <label htmlFor={`${id}-item`} className="mb-1 mt-4 block text-sm font-medium">
            Registry item
          </label>
          <select
            id={`${id}-item`}
            value={item.name}
            onChange={(event) => {
              setSelected(event.target.value);
              setStatus("");
            }}
            className="min-h-11 w-full rounded-lg border border-grey-300 bg-white px-3 text-base text-grey-900 focus-visible:outline-2 focus-visible:outline-action-primary-text"
          >
            {items.map((candidate) => (
              <option key={candidate.name} value={candidate.name}>
                {candidate.title ?? candidate.name}
              </option>
            ))}
          </select>
          <p className="mt-3 text-sm">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(command, "Install command copied.")}
              className="min-h-11 rounded-lg bg-action-primary px-4 text-sm font-medium text-white hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
            >
              Copy install command
            </button>
            <button
              type="button"
              onClick={() => copy(namespace, "Namespace configuration copied.")}
              className="min-h-11 rounded-lg border border-grey-300 px-4 text-sm font-medium hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
            >
              Copy namespace
            </button>
          </div>
          <label htmlFor={`${id}-command`} className="mb-1 mt-4 block text-sm font-medium">
            Install command
          </label>
          <input
            id={`${id}-command`}
            readOnly
            value={command}
            className="min-h-11 w-full rounded-lg border border-grey-200 bg-white px-3 font-mono text-sm text-grey-900"
          />
          <details className="mt-3">
            <summary className="cursor-pointer py-2 text-sm font-medium">
              Namespace for this server
            </summary>
            <textarea
              aria-label="Registry namespace configuration"
              readOnly
              rows={5}
              value={namespace}
              className="w-full rounded-lg border border-grey-200 bg-white p-3 font-mono text-sm text-grey-900"
            />
          </details>
          <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-grey-600">
            {status}
          </p>
        </>
      )}
    </section>
  );
}
