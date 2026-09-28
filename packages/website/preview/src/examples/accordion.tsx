"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  return (
    <div style={{ width: "min(100%, 580px)" }}>
      <Accordion
        defaultValue={["start"]}
        multiple={state === "multiple"}
        type={state === "nested" ? "nested" : "default"}
      >
        <AccordionItem value="start">
          <AccordionTrigger>Where should I start?</AccordionTrigger>
          <AccordionContent>
            Choose a component, copy its example, and adapt it to your project. Import the Rayden
            stylesheet once.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="theme">
          <AccordionTrigger>Can I change the theme?</AccordionTrigger>
          <AccordionContent>
            Rayden supports light and dark themes. Use the preview theme control to compare them.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="blocks">
          <AccordionTrigger>What makes a block different?</AccordionTrigger>
          <AccordionContent>
            A block combines smaller components into a complete interface pattern. The blocks in
            this release are experimental.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
