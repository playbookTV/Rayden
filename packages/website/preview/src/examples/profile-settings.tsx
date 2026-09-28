"use client";
import { useState } from "react";
import { ProfileSettingsBlock, type ProfileSettingsValues } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";

const initial: ProfileSettingsValues = {
  firstName: "Avery",
  lastName: "Morgan",
  email: "avery@example.com",
  jobTitle: "Product designer",
  timeZone: "Europe/London",
  bio: "Making thoughtful things for the web.",
};
export default function Example({ state = "default" }: { state?: string }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <ProfileSettingsBlock
      title="Your profile"
      description="A little about you. Changes stay in this demo."
      value={value}
      onSave={(next) => {
        setValue(next);
        setSaved(true);
      }}
      onCancel={() => setSaved(false)}
      status={
        state === "loading" ? "loading" : state === "error" ? "error" : saved ? "success" : "idle"
      }
      errorMessage="Example error: your changes could not be saved."
      successMessage="Saved in this preview only. Reloading resets the profile."
    />
  );
}
