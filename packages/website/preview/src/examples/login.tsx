"use client";
import { useState } from "react";
import { LoginBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [message, setMessage] = useState("");
  return (
    <div style={{ width: "min(100%, 440px)", margin: "auto" }}>
      <LoginBlock
        variant="card"
        title="Welcome back."
        subtitle="Use a demo email and password. Nothing is sent."
        socialProviders={[]}
        onSignUp={() => setMessage("Sign-up preview only. No account has been created.")}
        submitLabel="Try sign in"
        showRememberMe
        onSubmit={() =>
          setMessage("Demo submitted. No account was accessed and no credentials were sent.")
        }
        onForgotPassword={() => setMessage("Recovery is a demo action. No email has been sent.")}
        error={state === "error" ? "Example error: check your email and password." : undefined}
        pending={state === "pending"}
      />
      <p role="status" style={{ marginTop: 20 }}>
        {message}
      </p>
    </div>
  );
}
