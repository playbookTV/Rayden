import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { Slider, RangeSlider } from "./Slider";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./Table";
import { Tabs, Tab } from "./Tabs";
import { DatePicker } from "./DatePicker";
import { FileUpload, type FileUploadFileData } from "./FileUpload";
import { Tooltip } from "./Tooltip";
import { Select, SelectOption } from "./Select";
import { Pagination } from "./Pagination";
import { Input } from "./Input";
import { Button } from "./Button";
import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";
import { ProgressBar } from "./ProgressBar";
import { ProgressCircle } from "./ProgressCircle";
import { SearchableTableBlock } from "../blocks/SearchableTableBlock";
import { Banner } from "./Banner";
import { RaydenChart } from "./Chart";
import { Counter } from "./Counter";
import { Modal } from "./Modal";
import { useForm } from "react-hook-form";
import { useRaydenInput } from "../hooks/form/useRaydenInput";

export default {
  title: "Quality/Interaction contracts",
  parameters: { a11y: { test: "error" }, layout: "padded" },
} satisfies Meta;
type Story = StoryObj;

export const SliderKeyboard: Story = {
  render: () => (
    <div className="max-w-sm">
      <Slider label="Volume" min={10} max={30} step={2} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider", { name: "Volume" });
    slider.focus();
    await userEvent.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
    await userEvent.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "28");
    await userEvent.keyboard("{Home}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  },
};
export const RangeKeyboard: Story = {
  render: () => (
    <div className="max-w-sm">
      <RangeSlider label="Budget" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      low = c.getByRole("slider", { name: "Budget minimum" }),
      high = c.getByRole("slider", { name: "Budget maximum" });
    low.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(low).toHaveAttribute("aria-valuenow", "26");
    high.focus();
    await userEvent.keyboard("{Home}");
    expect(high).toHaveAttribute("aria-valuenow", "26");
    expect(low).toHaveAttribute("aria-valuemax", "26");
  },
};
export const RangeWithStep: Story = {
  render: () => (
    <div className="w-72">
      <RangeSlider label="Capacity" min={10} max={30} step={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const low = within(canvasElement).getByRole("slider", { name: "Capacity minimum" });
    expect(low).toHaveAttribute("aria-valuenow", "14");
    low.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(low).toHaveAttribute("aria-valuenow", "18");
  },
};
const sort = fn();
export const KeyboardSorting: Story = {
  render: () => (
    <Table aria-label="Team">
      <TableHeader>
        <TableRow>
          <TableHead sortable onSort={sort}>
            Name
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    sort.mockClear();
    const button = within(canvasElement).getByRole("button", { name: "Name" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(sort).toHaveBeenCalledOnce();
  },
};
export const DefaultTabs: Story = {
  render: function DefaultTabsDemo() {
    const [disabled, setDisabled] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setDisabled(true)}>
          Disable first
        </button>
        <Tabs>
          <Tab value="one" disabled={disabled}>
            One
          </Tab>
          <Tab value="two">Two</Tab>
        </Tabs>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    expect(c.getByRole("tab", { name: "One" })).toHaveAttribute("tabindex", "0");
    await userEvent.click(c.getByRole("button", { name: "Disable first" }));
    expect(c.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "0");
  },
};
export const CalendarKeyboard: Story = {
  render: () => <DatePicker defaultValue={new Date(2026, 8, 1)} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    c.getByRole("button", { name: "Selected, Tuesday, September 1, 2026" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(c.getByRole("button", { name: "Wednesday, September 2, 2026" })).toHaveFocus();
    await userEvent.keyboard("{PageDown}{Enter}");
    expect(c.getByRole("button", { name: "Selected, Friday, October 2, 2026" })).toHaveFocus();
    expect(canvasElement.querySelectorAll('[data-day][tabindex="0"]')).toHaveLength(1);
  },
};
export const ControlledRangeReset: Story = {
  render: function RangeReset() {
    const [range, setRange] = useState<[Date | null, Date | null]>([
      new Date(2026, 8, 1),
      new Date(2026, 8, 3),
    ]);
    return (
      <>
        <button type="button" onClick={() => setRange([null, null])}>
          Reset dates
        </button>
        <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText("Reset dates"));
    expect(canvasElement.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
  },
};
export const TooltipTrigger: Story = {
  render: () => (
    <div className="p-16">
      <Tooltip content="Help with your project">
        <button type="button">Help</button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      button = c.getByRole("button", { name: "Help" });
    expect(c.queryByRole("tooltip")).toBeNull();
    button.focus();
    await waitFor(() => expect(c.getByRole("tooltip")).toBeVisible());
    expect(button).toHaveAttribute("aria-describedby", c.getByRole("tooltip").id);
    await userEvent.keyboard("{Escape}");
    expect(c.queryByRole("tooltip")).toBeNull();
    expect(button).toHaveFocus();
  },
};
export const TooltipActions: Story = {
  render: () => (
    <div className="p-20">
      <Tooltip
        title="Project help"
        content="Choose an action"
        onClose={() => {}}
        primaryAction={{ label: "Learn more", onClick: () => {} }}
      >
        <button type="button">Project help</button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Project help" });
    await userEvent.click(trigger);
    expect(c.getByRole("dialog", { name: "Project help" })).toHaveFocus();
    await userEvent.click(c.getByRole("button", { name: "Close" }));
    expect(c.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  },
};
export const UploadSelection: Story = {
  render: function UploadDemo() {
    const [files, setFiles] = useState<FileUploadFileData[]>([]);
    return (
      <FileUpload
        multiple
        accept=".pdf"
        maxFiles={2}
        maxSize={100}
        files={files}
        onFilesChange={setFiles}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(["pdf"], "test.pdf", { type: "application/pdf" }));
    expect(c.getByText("test.pdf")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Remove test.pdf" }));
    expect(c.queryByText("test.pdf")).toBeNull();
    // The drop handler must validate files even when the browser chooser is bypassed.
    const event = new Event("drop", { bubbles: true });
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [new File(["text"], "wrong.txt", { type: "text/plain" })] },
    });
    await fireEvent(c.getByRole("region"), event);
    expect(c.getByRole("alert")).toHaveTextContent("wrong.txt: Choose a supported file type");
    await userEvent.upload(
      input,
      new File(["x".repeat(101)], "large.pdf", { type: "application/pdf" })
    );
    expect(c.getByRole("alert")).toHaveTextContent("large.pdf: File exceeds");
  },
};
export const SelectTabDismissal: Story = {
  render: () => (
    <>
      <Select label="Country">
        <SelectOption value="uk">United Kingdom</SelectOption>
        <SelectOption value="ca">Canada</SelectOption>
      </Select>
      <button type="button">Continue</button>
    </>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("combobox"));
    await waitFor(() => expect(c.getByRole("option", { name: "United Kingdom" })).toHaveFocus());
    await userEvent.tab();
    expect(c.queryByRole("listbox")).toBeNull();
    expect(c.getByText("Continue")).toHaveFocus();
  },
};
export const ThemeAndNarrowLayouts: Story = {
  render: () => (
    <div className="space-y-6">
      {["rayden-light", "dark"].map((theme) => (
        <section
          key={theme}
          className={`${theme} w-[280px] bg-grey-50 p-2 text-grey-900`}
          aria-label={theme}
        >
          <Pagination
            aria-label={`${theme} pagination`}
            currentPage={5}
            totalPages={20}
            siblingCount={3}
            onPageChange={() => {}}
          />
          <Input label="Email" defaultValue="ada@example.com" success="Email is available" />
          <Table aria-label={`${theme} people`}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell>ada.with.a.long.address@example.com</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const section of canvasElement.querySelectorAll("section")) {
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      const nav = section.querySelector("nav")!;
      expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth);
    }
  },
};

/* ─── Regressions from the 2026-09-20 comprehensive audit ──────────────── */

export const ButtonsDoNotSubmitForms: Story = {
  render: function ButtonsDoNotSubmitFormsExample() {
    const [submits, setSubmits] = useState(0);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmits((n) => n + 1);
        }}
      >
        <Button>Plain button</Button>
        <ButtonGroup>
          <ButtonGroupItem active>Monthly</ButtonGroupItem>
          <ButtonGroupItem>Yearly</ButtonGroupItem>
        </ButtonGroup>
        <Button type="submit">Real submit</Button>
        <output data-testid="submits">{submits}</output>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const count = c.getByTestId("submits");
    // Neither primitive defaulted to type="button", so both submitted the form.
    await userEvent.click(c.getByRole("button", { name: "Plain button" }));
    await userEvent.click(c.getByRole("button", { name: "Monthly" }));
    expect(count).toHaveTextContent("0");
    // An explicit submit must still submit.
    await userEvent.click(c.getByRole("button", { name: "Real submit" }));
    await waitFor(() => expect(count).toHaveTextContent("1"));
  },
};

export const CollapsedAccordionIsNotFocusable: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="one">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>
          <button type="button">Inside panel</button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Shipping" });
    const inside = c.getByRole("button", { name: "Inside panel", hidden: true });

    // Collapsed panels were only hidden visually, so Tab walked straight into them.
    expect(inside.closest("[inert]")).not.toBeNull();
    trigger.focus();
    await userEvent.tab();
    expect(inside).not.toHaveFocus();

    await userEvent.click(trigger);
    await waitFor(() => expect(inside.closest("[inert]")).toBeNull());
    inside.focus();
    expect(inside).toHaveFocus();

    // Closing around focus must hand it back to the trigger, not the document.
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ProgressExposesItsLabel: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <ProgressBar label="Storage used" value={42} />
      <ProgressCircle value={70} label="Upload progress" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // aria-label used to land on the wrapper, and the visible label had no id.
    const bar = c.getByRole("progressbar", { name: "Storage used" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    const circle = c.getByRole("progressbar", { name: "Upload progress" });
    expect(circle).toHaveAttribute("aria-valuenow", "70");
  },
};

export const SortReordersRows: Story = {
  render: () => (
    <SearchableTableBlock
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email" },
      ]}
      rows={[
        { id: "2", name: "Zelda", email: "z@example.com" },
        { id: "1", name: "Alice", email: "a@example.com" },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const names = () =>
      [...canvasElement.querySelectorAll("tbody tr td:first-child")].map((n) => n.textContent);

    expect(names()).toEqual(["Zelda", "Alice"]);
    // The indicator used to move while the rows stayed put.
    await userEvent.click(c.getByRole("button", { name: /Name/ }));
    await waitFor(() => expect(names()).toEqual(["Alice", "Zelda"]));
    await userEvent.click(c.getByRole("button", { name: /Name/ }));
    await waitFor(() => expect(names()).toEqual(["Zelda", "Alice"]));
  },
};

export const RevealControlIsReachable: Story = {
  render: () => (
    <div className="max-w-sm">
      <Input
        label="Password"
        type="password"
        trailingAction={
          <button type="button" aria-label="Show password">
            👁
          </button>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const reveal = within(canvasElement).getByRole("button", { name: "Show password" });
    // The control used to sit inside Input's aria-hidden decorative icon slot.
    expect(reveal.closest("[aria-hidden='true']")).toBeNull();
  },
};

export const NarrowLayoutsDoNotClipOrOverflow: Story = {
  render: () => (
    <div className="space-y-6">
      {/* A phone-width container, matching the 390px viewport the audit measured. */}
      <section aria-label="banner" className="w-[390px] p-2">
        <Banner
          status="information"
          title="Update available"
          description="A new version of the workspace is ready to install with several fixes and improvements."
          buttonLabel="Update now"
          onDismiss={() => {}}
        />
      </section>
      <section aria-label="toolbar" className="w-[390px] p-2">
        <SearchableTableBlock
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "email", label: "Email" },
          ]}
          rows={[{ id: "1", name: "Alice", email: "a@example.com" }]}
          showFilter
          showDateSelector
          onFilter={() => {}}
          onDateSelect={() => {}}
        />
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const banner = canvasElement.querySelector("section[aria-label='banner']")!;
    const toolbar = canvasElement.querySelector("section[aria-label='toolbar']")!;

    // The banner had a fixed height plus overflow-hidden, so 538px of content was
    // clipped inside a 308px box without the page itself overflowing.
    const alert = banner.querySelector("[role='alert']") as HTMLElement;
    expect(alert.scrollHeight).toBeLessThanOrEqual(alert.clientHeight + 1);
    expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth + 1);

    // The search toolbar sits outside the table's scroll wrapper and reached 505px.
    expect(toolbar.scrollWidth).toBeLessThanOrEqual(toolbar.clientWidth + 1);
  },
};

export const TypingInPopoverKeepsFocus: Story = {
  render: function TypingInPopoverExample() {
    const [note, setNote] = useState("");
    return (
      <Tooltip
        defaultOpen
        content={
          <Input
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            data-testid="note"
          />
        }
        onClose={() => {}}
      >
        <button type="button">Add note</button>
      </Tooltip>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("dialog")).toHaveFocus();
    const input = canvas.getByTestId("note") as HTMLInputElement;
    input.focus();
    // The focus effect depended on `children` and callback identities, so each keystroke
    // rerendered the parent, re-ran the effect and pulled focus back to the panel.
    await userEvent.keyboard("hello");
    expect(input).toHaveFocus();
    expect(input.value).toBe("hello");
  },
};

export const NestedFieldErrorsSurface: Story = {
  render: function NestedFieldErrorsExample() {
    const form = useForm<{ profile: { email: string } }>({
      defaultValues: { profile: { email: "" } },
    });
    const field = useRaydenInput({ form, name: "profile.email" });
    form.register("profile.email", { required: "Email is required" });
    return (
      <form onSubmit={form.handleSubmit(() => {})} className="max-w-sm">
        <Input label="Email" {...field} />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Errors were looked up as errors["profile.email"], but RHF nests them, so a
    // nested field always reported no error and its message never reached the Input.
    await userEvent.click(c.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(c.getByText("Email is required")).toBeInTheDocument());
  },
};

export const SelectAllTracksVisibleRows: Story = {
  render: function SelectAllTracksVisibleRowsDemo() {
    const [query, setQuery] = useState("");
    const rows = [
      { id: "1", name: "Alice", email: "a@example.com" },
      { id: "2", name: "Zelda", email: "z@example.com" },
    ].filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div>
        <Button onClick={() => setQuery("Zelda")}>Filter to Zelda</Button>
        <SearchableTableBlock columns={[{ key: "name", label: "Name" }]} rows={rows} selectable />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const selectAll = () =>
      c.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;

    await userEvent.click(c.getByRole("checkbox", { name: "Select Alice" }));
    // Partial selection must read as mixed, not checked.
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(true);

    // Filtering to a row that is not selected must not leave select-all checked.
    await userEvent.click(c.getByRole("button", { name: "Filter to Zelda" }));
    await waitFor(() => expect(c.queryByRole("checkbox", { name: "Select Alice" })).toBeNull());
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(false);
  },
};

export const ScatterChartsHaveADataTable: Story = {
  render: () => (
    <div className="w-full max-w-[360px]">
      <RaydenChart
        type="scatter"
        title="Latency vs load"
        height={200}
        data={{
          datasets: [
            {
              label: "Requests",
              data: [
                { x: 10, y: 120 },
                { x: 20, y: 240 },
              ],
            },
          ],
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Point-based data carries no `labels`, which previously suppressed the table
    // entirely and left scatter/bubble values canvas-only.
    const table = canvasElement.querySelector("table")!;
    expect(table).not.toBeNull();
    expect(table.textContent).toContain("10, 120");
    expect(table.textContent).toContain("20, 240");
  },
};

/* ─── Regressions from the 2026-09-21 sweep ───────────────────────────── */

export const CounterStartsInsideItsRange: Story = {
  render: () => <Counter min={5} max={10} />,
  play: async ({ canvasElement }) => {
    // Only update() clamped, so min=5 still displayed 0 until the first increment.
    expect(canvasElement.textContent).toContain("5");
    expect(canvasElement.textContent).not.toContain("0");
  },
};

export const AccordionCallbackDoesNotBlockToggle: Story = {
  render: function AccordionCallbackDemo() {
    const [clicks, setClicks] = useState(0);
    return (
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger onClick={() => setClicks((n) => n + 1)}>
            Details ({clicks})
          </AccordionTrigger>
          <AccordionContent>Panel body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: /Details/ });
    // {...rest} came after the internal onClick, so an analytics handler replaced it.
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    expect(trigger.textContent).toContain("(1)");
  },
};

export const BannerHidesDismissWithoutHandler: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner status="information" title="No handler" />
      <Banner status="information" title="With handler" onDismiss={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // dismissible defaulted to true, so a close button rendered and did nothing.
    const dismissers = within(canvasElement).getAllByRole("button", { name: "Dismiss banner" });
    expect(dismissers).toHaveLength(1);
  },
};

export const ModalKeepsItsDescriptionWithoutAHeader: Story = {
  render: () => (
    <Modal open onClose={() => {}} description="Deep-linked explanation" showClose={false} />
  ),
  play: async () => {
    const dialog = await within(document.body).findByRole("dialog", { name: "Dialog" });
    // The description lived inside the header, so a title-less modal dropped it while
    // aria-describedby still pointed at its id.
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(dialog.textContent).toContain("Deep-linked explanation");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("Deep-linked explanation");
  },
};

export const ModalOmitsUnconfiguredActions: Story = {
  render: () => <Modal open onClose={() => {}} title="Confirm" secondaryLabel="Back" />,
  play: async () => {
    const dialog = await within(document.body).findByRole("dialog", { name: "Confirm" });
    // Accessible name, not text content: the close button is icon-only but named.
    const names = [...dialog.querySelectorAll("button")].map(
      (b) => b.getAttribute("aria-label") ?? b.textContent?.trim() ?? ""
    );
    // A default "Save" rendered with no handler, and primaryLabel="" produced an
    // unnamed third button.
    expect(names.filter((n) => n === "")).toHaveLength(0);
    expect(names).not.toContain("Save");
    expect(names).toContain("Back");
  },
};
