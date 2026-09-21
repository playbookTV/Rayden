"use client";

import { Tab, Tabs } from "@raydenui/ui";
import { MotionProvider } from "@raydenui/ui/motion";

/** Motion is opt-in. The provider respects the user's reduced-motion preference. */
export function MotionTabs() {
  return (
    <MotionProvider preset="snappy">
      <Tabs motion variant="segmented" defaultValue="week">
        <Tab value="week">This week</Tab>
        <Tab value="month">This month</Tab>
        <Tab value="year">This year</Tab>
      </Tabs>
    </MotionProvider>
  );
}
