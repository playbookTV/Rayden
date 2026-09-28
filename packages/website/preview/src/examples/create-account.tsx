"use client";
import { useState } from "react";
import { CreateAccountBlock, type CreateAccountStatus } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ width: "min(100%, 600px)" }}>
      <CreateAccountBlock
        title="Make room for your ideas."
        description="Try the registration flow with example details. Nothing is sent."
        defaultValues={{ firstName: "Avery", lastName: "Morgan", email: "avery@example.com" }}
        consentLabel="I understand this is a local demonstration."
        onSubmit={() => setSubmitted(true)}
        status={
          submitted ? "success" : state === "default" ? "idle" : (state as CreateAccountStatus)
        }
        successMessage="Demo completed. No account was created and no details were sent."
        errorMessage="Example error: registration is temporarily unavailable."
        submitLabel="Try creating an account"
      />
    </div>
  );
}
