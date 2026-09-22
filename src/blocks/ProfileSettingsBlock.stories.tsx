import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProfileSettingsBlock, type ProfileSettingsValues } from "./ProfileSettingsBlock";
import { FileUpload } from "../components/FileUpload";
import type { FileUploadFileData } from "../components/FileUpload";

const meta: Meta<typeof ProfileSettingsBlock> = {
  title: "Blocks/ProfileSettings",
  component: ProfileSettingsBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProfileSettingsBlock>;

function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="mx-auto w-full max-w-[720px]">{children}</div>;
}

const savedProfile: ProfileSettingsValues = {
  firstName: "Amara",
  lastName: "Okonkwo",
  email: "amara.okonkwo@example.com",
  jobTitle: "Operations lead",
  timeZone: "Africa/Lagos",
  bio: "I look after supplier onboarding and keep our delivery promises honest.",
};

/* ─── Default ─────────────────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        avatar={{ src: "https://i.pravatar.cc/150?img=47", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onAvatarRemove={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  ),
};

/* ─── Unsaved-change tracking ─────────────────────────────────────── */
/* Editing a field must flip the block into an unsaved state, enable both
   footer actions, and Cancel must restore the saved values. */
function DirtyHarness() {
  const [value, setValue] = useState(savedProfile);
  const [saved, setSaved] = useState(false);
  return (
    <Frame>
      <ProfileSettingsBlock
        value={value}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        status={saved ? "success" : "idle"}
        successMessage="Your profile was updated."
        onSave={(next) => {
          setValue(next);
          setSaved(true);
        }}
        onCancel={fn()}
        onDirtyChange={fn()}
      />
    </Frame>
  );
}

export const UnsavedChanges: Story = {
  render: () => <DirtyHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save changes" });
    const cancel = canvas.getByRole("button", { name: "Cancel" });

    // Clean: nothing to save, nothing to discard.
    await expect(canvas.getByText("All changes saved.")).toBeVisible();
    await expect(save).toBeDisabled();
    await expect(cancel).toBeDisabled();

    const jobTitle = canvas.getByLabelText("Job title");
    await userEvent.clear(jobTitle);
    await userEvent.type(jobTitle, "Head of operations");

    await expect(canvas.getByText("You have unsaved changes.")).toBeVisible();
    await expect(save).toBeEnabled();
    await expect(cancel).toBeEnabled();

    // Cancel restores the saved values and clears the unsaved state.
    await userEvent.click(cancel);
    await expect(canvas.getByLabelText("Job title")).toHaveValue("Operations lead");
    await expect(canvas.getByText("All changes saved.")).toBeVisible();

    // Save reports the edited values to the application.
    await userEvent.clear(canvas.getByLabelText("Job title"));
    await userEvent.type(canvas.getByLabelText("Job title"), "Head of operations");
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
    await expect(canvas.getByText("Your profile was updated.")).toBeVisible();
    await expect(canvas.getByText("All changes saved.")).toBeVisible();
  },
};

/* ─── Field validation ────────────────────────────────────────────── */
export const ValidationErrors: Story = {
  render: () => {
    return (
      <Frame>
        <ProfileSettingsBlock value={savedProfile} onSave={fn()} />
      </Frame>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email address");
    await userEvent.clear(email);
    await userEvent.type(email, "amara@@example");
    await userEvent.tab();
    await expect(
      canvas.getByText("Enter an email address such as name@example.com.")
    ).toBeVisible();
  },
};

/* ─── Saving ──────────────────────────────────────────────────────── */
export const Saving: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={{ ...savedProfile, jobTitle: "Head of operations" }}
        status="saving"
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Every field and both footer actions are held while a save is in flight.
    await expect(canvas.getByLabelText("First name")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Saving…" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeDisabled();
  },
};

/* ─── Save failed ─────────────────────────────────────────────────── */
export const SaveFailed: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        status="error"
        errorMessage="The profile service did not respond. Your edits are still here — try saving again."
        fieldErrors={{ email: "Another account already uses this address." }}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  ),
};

/* ─── Save confirmed by the application ───────────────────────────── */
export const SaveConfirmed: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        status="success"
        successMessage="Your profile was updated."
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onSave={fn()}
      />
    </Frame>
  ),
};

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={{
          firstName: "",
          lastName: "",
          email: "",
          jobTitle: "",
          timeZone: "Europe/London",
          bio: "",
        }}
        status="loading"
        onSave={fn()}
      />
    </Frame>
  ),
};

/* ─── No permission to edit ───────────────────────────────────────── */
/* Read-only fields stay focusable and readable; the footer actions are not
   rendered at all rather than rendered inert. */
export const ReadOnlyNoPermission: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        canEdit={false}
        avatar={{ src: "https://i.pravatar.cc/150?img=47", alt: "Amara Okonkwo" }}
        onSave={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("First name")).toHaveAttribute("readonly");
    await expect(canvas.queryByRole("button", { name: "Save changes" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Cancel" })).toBeNull();
    await expect(canvas.getByText("View only")).toBeVisible();
  },
};

/* ─── One field owned elsewhere ───────────────────────────────────── */
export const DirectoryManagedEmail: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        readOnlyFields={["email"]}
        readOnlyFieldMessages={{
          email: "Your email address comes from your company directory.",
        }}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  ),
};

/* ─── Avatar upload states ────────────────────────────────────────── */
export const AvatarUploading: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        avatarStatus="uploading"
        onAvatarChange={fn()}
        onSave={fn()}
      />
    </Frame>
  ),
};

export const AvatarUploadFailed: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        avatarStatus="error"
        avatarErrorMessage="That image is larger than 5 MB. Choose a smaller file."
        onAvatarChange={fn()}
        onSave={fn()}
      />
    </Frame>
  ),
};

/* ─── Avatar handled by the FileUpload component ──────────────────── */
function FileUploadAvatarHarness() {
  const [files, setFiles] = useState<FileUploadFileData[]>([]);
  return (
    <Frame>
      <ProfileSettingsBlock
        value={savedProfile}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        avatarSlot={
          <FileUpload
            multiple={false}
            accept="image/png,image/jpeg"
            title="Profile photo"
            description="PNG or JPG, up to 5 MB"
            files={files}
            onFilesChange={setFiles}
            onRemove={(id) => setFiles((prev) => prev.filter((file) => file.id !== id))}
          />
        }
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  );
}

export const AvatarWithFileUpload: Story = {
  render: () => <FileUploadAvatarHarness />,
};

/* ─── Long content and a missing photo ────────────────────────────── */
export const LongValuesNoPhoto: Story = {
  render: () => (
    <Frame>
      <ProfileSettingsBlock
        value={{
          firstName: "Maximiliane-Charlotte",
          lastName: "Von Hohenlohe-Langenburg",
          email: "maximiliane.charlotte.von.hohenlohe@a-very-long-company-domain.example.com",
          jobTitle: "Interim Director of Supplier Onboarding and Delivery Assurance",
          timeZone: "Europe/Berlin",
          bio: "Ich koordiniere die Lieferantenanbindung, die Qualitätssicherung und die Terminzusagen für drei Regionen und arbeite eng mit dem Betriebsteam zusammen.",
        }}
        onAvatarChange={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </Frame>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A brand surface value is mode-specific: Rayden has no paired foreground
   role yet, so a light brand surface is scoped as an explicit light island
   (`rayden-light`). Without that scope, a light surface inside a dark
   document would keep the inverted, near-white grey foregrounds. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="rayden-light w-full bg-surface-muted p-4"
      style={
        {
          "--color-surface": "#f2e9da",
          "--color-surface-border": "#e0d3bd",
          "--color-surface-border-strong": "#c8b393",
        } as CSSProperties
      }
    >
      <Frame>
        <ProfileSettingsBlock
          value={savedProfile}
          avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
          onAvatarChange={fn()}
          onSave={fn()}
          onCancel={fn()}
        />
      </Frame>
    </div>
  ),
};

/* ─── Narrow container ────────────────────────────────────────────── */
/* A 360px settings column at a desktop viewport: avatar row, name grid and
   footer all stack from the container width, not the viewport. */
export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[360px] border border-dashed border-surface-border-strong p-2">
      <ProfileSettingsBlock
        value={savedProfile}
        avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
        onAvatarChange={fn()}
        onAvatarRemove={fn()}
        onSave={fn()}
        onCancel={fn()}
      />
    </div>
  ),
};
