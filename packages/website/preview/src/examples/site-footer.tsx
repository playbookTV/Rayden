"use client";
import { useState } from "react";
import { SiteFooterBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example() {
  const [language, setLanguage] = useState("en");
  const [destination, setDestination] = useState("Choose a footer destination.");
  const link = (id: string, label: string) => ({
    id,
    label,
    href: "#footer-demo-destination",
    onClick: () => setDestination(`${label} selected in this demo.`),
  });
  return (
    <div style={{ width: "100%" }}>
      <SiteFooterBlock
        label="Form and Field demo footer"
        brand={{ name: "Form & Field", description: "A little structure. A lot of possibility." }}
        groups={[
          {
            id: "product",
            title: "Product",
            links: [
              link("workspace", "Workspace"),
              link("projects", "Projects"),
              link("updates", "What is new"),
            ],
          },
          {
            id: "resources",
            title: "Resources",
            links: [
              link("guides", "Guides"),
              link("examples", "Examples"),
              link("support", "Support"),
            ],
          },
          {
            id: "studio",
            title: "Studio",
            links: [link("about", "About us"), link("journal", "Journal")],
          },
        ]}
        localeControls={[
          {
            id: "language",
            label: "Demo language",
            value: language,
            options: [
              { value: "en", label: "English" },
              { value: "fr", label: "Français" },
            ],
            onChange: setLanguage,
            hint: "Changes the demo preference only.",
          },
        ]}
        copyright="© 2026 Form & Field. A fictional studio."
      />
      <div id="footer-demo-destination" role="status" style={{ marginTop: 32 }}>
        <p>{destination}</p>
        <p>
          Selected language: {language === "en" ? "English" : "Français"}. This example does not
          translate the page.
        </p>
      </div>
    </div>
  );
}
