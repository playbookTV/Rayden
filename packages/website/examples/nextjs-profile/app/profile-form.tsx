"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@raydenui/ui";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSavedName(trimmedName);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <Input
        id="display-name"
        name="displayName"
        label="Display name"
        autoComplete="nickname"
        placeholder="How should we call you?"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setSavedName("");
        }}
        maxLength={60}
        required
        helperText="This demo keeps your name only until the page reloads."
      />
      <div className="profile-actions">
        <Button type="submit" variant="primary" disabled={!name.trim()}>
          Save display name
        </Button>
      </div>
      <p className="profile-status" role="status">
        {savedName ? `Looking good, ${savedName}. Your demo profile is updated.` : ""}
      </p>
    </form>
  );
}
