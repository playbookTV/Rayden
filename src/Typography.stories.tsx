import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button } from "./components/Button/Button";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Roles: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fonts = canvasElement.ownerDocument.fonts;
    // Check actual font files, not just CSS family names that could fall back.
    for (const descriptor of [
      '600 24px "Manrope"',
      '400 16px "Hanken Grotesk"',
      'italic 400 16px "Hanken Grotesk"',
    ]) {
      const faces = await fonts.load(descriptor, "Workspace");
      await expect(faces.length).toBeGreaterThan(0);
      await expect(faces.every((face) => face.status === "loaded")).toBe(true);
    }
    await expect(getComputedStyle(canvas.getByRole("heading", { level: 1 })).fontFamily).toContain(
      "Manrope"
    );
    await expect(getComputedStyle(canvas.getByRole("navigation")).fontFamily).toContain(
      "Hanken Grotesk"
    );
    await expect(getComputedStyle(canvas.getByRole("textbox")).fontFamily).toContain(
      "Hanken Grotesk"
    );
    await expect(getComputedStyle(canvasElement.querySelector("code")!).fontFamily).toContain(
      "Menlo"
    );
  },
  render: () => (
    <main className="min-h-screen bg-surface p-6 text-grey-900 md:p-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-4">
          <p className="text-caption-sm uppercase text-grey-500">Rayden / Typography</p>
          <h1 className="text-h2 md:text-display-lg">A clear voice at every size.</h1>
          <p className="text-body-lg prose-measure text-grey-600">
            Manrope leads. Hanken Grotesk makes the everyday feel effortless. Native monospace keeps
            code precise.
          </p>
        </header>
        <section className="space-y-4 border-t border-grey-200 pt-6">
          <h2 className="text-h5">Built for reading</h2>
          <p className="text-body-md prose-measure">
            Good typography makes room for the message. Comfortable line spacing, a measured reading
            width, and a quiet hierarchy help you find what matters. Use{" "}
            <strong>bold emphasis</strong> sparingly, and <em>true italic</em> when the voice needs
            a change.
          </p>
          <p className="text-body-sm text-grey-500">Supporting copy stays readable and distinct.</p>
        </section>
        <section className="space-y-4 border-t border-grey-200 pt-6">
          <h2 className="text-h5">Made for everyday work</h2>
          <nav aria-label="Typography example" className="flex flex-wrap gap-6 text-label-md">
            <a href="#workspace">Overview</a>
            <a href="#workspace">Projects</a>
            <a href="#workspace">Activity</a>
          </nav>
          <div id="workspace" className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-2 text-label-md">
              Workspace name
              <input
                defaultValue="Design studio"
                className="max-w-full rounded-lg border border-grey-300 bg-surface px-3 py-2 text-label-lg"
              />
            </label>
            <Button>Save changes</Button>
          </div>
        </section>
        <section className="space-y-4 border-t border-grey-200 pt-6">
          <h2 className="text-h5">Precise by default</h2>
          <pre className="overflow-x-auto rounded-xl bg-grey-50 p-4 text-code-md">
            <code>
              {'import { Button } from "@raydenui/ui";\n\n<Button>Start building</Button>'}
            </code>
          </pre>
          <p className="text-body-sm text-grey-500">
            Open search with <kbd className="text-code-sm">⌘ K</kbd>.
          </p>
        </section>
      </div>
    </main>
  ),
};

export const Scale: Story = {
  render: () => (
    <main className="min-h-screen space-y-6 bg-surface p-6 text-grey-900 md:p-12">
      <h1 className="text-h3">The type scale</h1>
      <div className="overflow-x-auto space-y-6">
        <p className="text-display-lg">Display / 56</p>
        <p className="text-display-sm">Display / 48</p>
        <p className="text-h1">Heading / 40</p>
        <p className="text-h2">Heading / 36</p>
        <p className="text-h3">Heading / 32</p>
        <p className="text-h4">Heading / 28</p>
        <p className="text-h5">Heading / 24</p>
        <p className="text-h6">Heading / 20</p>
      </div>
      <p className="text-body-lg">Body large / 18 / A little more room to read.</p>
      <p className="text-body-md">Body default / 16 / Your everyday reading size.</p>
      <p className="text-body-sm">Body small / 14 / Supporting detail.</p>
      <p className="text-body-xs">Body extra small / 12 / Footnotes.</p>
      <p className="text-label-lg">Label large / 16</p>
      <p className="text-label-md">Label default / 14</p>
      <p className="text-label-sm">Label small / 12</p>
      <p className="text-caption-lg uppercase">Caption large / 14</p>
      <p className="text-caption-sm uppercase">Caption small / 12</p>
      <p className="text-caption-xs uppercase">Caption compatibility / 12</p>
      <p className="text-code-md">Code default / 14 / const ready = true;</p>
      <p className="text-code-sm">Code small / 12 / npm install @raydenui/ui</p>
    </main>
  ),
};

export const Dark: Story = { ...Roles, globals: { theme: "dark" } };
