import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

const PlusCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const LogoBadge = () => (
  <span className="shrink-0 flex items-center justify-center bg-primary-500 text-white rounded-full p-2.5">
    <svg viewBox="0 0 12 12" fill="currentColor" className="size-3">
      <path d="M6 0C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6S9.3 0 6 0zm2.5 8.5L6 7 3.5 8.5l.7-2.8L2 3.9l2.9-.2L6 1l1.1 2.7 2.9.2-2.2 1.8.7 2.8z" />
    </svg>
  </span>
);

const content =
  "Please insert the notification description here. To ensure optimal readability and visual appeal, it's recommended to split the text into two lines.";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["default", "nested"] },
    multiple: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Nested: Story = {
  render: () => (
    <Accordion type="nested" className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Accordion className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithNumbers: Story = {
  render: () => (
    <Accordion className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger leadingNumber="01">This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger leadingNumber="02">This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger leadingNumber="03">This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithLogo: Story = {
  render: () => (
    <Accordion className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger leadingLogo={<LogoBadge />}>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger leadingLogo={<LogoBadge />}>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger leadingLogo={<LogoBadge />}>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Accordion className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger badge={2}>This is an accordion title</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger badge={5} leadingIcon={<PlusCircleIcon />}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger badge={3} leadingNumber="01">
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple defaultValue={["1", "3"]} className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger>First accordion</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>Second accordion</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger>Third accordion</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const NestedWithIcons: Story = {
  render: () => (
    <Accordion type="nested" className="w-[750px]">
      <AccordionItem value="1">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />} badge={2}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />} badge={2}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger leadingIcon={<PlusCircleIcon />} badge={2}>
          This is an accordion title
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
