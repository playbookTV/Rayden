"use client";
import { useState } from "react";
import { NotificationsBlock } from "@raydenui/ui/blocks";
import { Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const avatar = (initials: string) => (
  <span
    style={{
      display: "grid",
      placeItems: "center",
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "var(--color-surface-muted)",
      fontWeight: 600,
    }}
  >
    {initials}
  </span>
);
export default function Example({ state = "default" }: { state?: string }) {
  const [read, setRead] = useState(state === "read");
  const [message, setMessage] = useState("");
  return (
    <div style={{ width: "min(100%, 700px)" }}>
      <NotificationsBlock
        title="A little closer to done."
        unreadCount={read ? 0 : 2}
        items={[
          {
            id: "review",
            avatar: avatar("SR"),
            text: (
              <>
                <strong>Sam Rivera</strong> requested your review.
              </>
            ),
            date: "24 Sep",
            time: "09:40",
            unread: !read,
            content: {
              type: "cta",
              primaryAction: {
                label: "Review prototype",
                onClick: () => {
                  setRead(true);
                  setMessage("Prototype review opened in this demo.");
                },
              },
              secondaryAction: {
                label: "Later",
                onClick: () => setMessage("Review deferred in this demo."),
              },
            },
          },
          {
            id: "handoff",
            avatar: avatar("JL"),
            text: (
              <>
                <strong>Jordan Lee</strong> shared the latest handoff.
              </>
            ),
            date: "24 Sep",
            time: "08:15",
            unread: !read,
            link: {
              label: "View handoff",
              onClick: () => {
                setRead(true);
                setMessage("Handoff selected in this demo.");
              },
            },
          },
        ]}
      />
      <div style={{ marginTop: 24 }}>
        <Button variant="secondary" disabled={read} onClick={() => setRead(true)}>
          {read ? "All caught up" : "Mark all as read"}
        </Button>
        <p role="status" style={{ marginTop: 16 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
