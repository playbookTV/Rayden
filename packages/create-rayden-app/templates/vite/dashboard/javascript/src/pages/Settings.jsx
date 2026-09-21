import { useState } from "react";
import { Input, Button, Toggle, Avatar } from "@raydenui/ui";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-grey-900">Settings</h1>
        <p className="text-grey-600 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-grey-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-grey-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar size="lg" initials="JD" />
            <Button
              variant="secondary"
              appearance="outlined"
              size="sm"
              onClick={() => alert("Connect this to your upload flow.")}
            >
              Change Avatar
            </Button>
          </div>
          <div className="grid gap-4">
            <Input label="Full Name" defaultValue="John Doe" size="md" />
            <Input
              label="Email"
              type="email"
              defaultValue="john@example.com"
              size="md"
            />
          </div>
        </div>

        <hr className="border-grey-200" />

        <div>
          <h2 className="text-lg font-semibold text-grey-900 mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p id="email-notifications-label" className="font-medium text-grey-900">Email Notifications</p>
                <p className="text-sm text-grey-500">
                  Receive email updates about your account
                </p>
              </div>
              <Toggle
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              aria-labelledby="email-notifications-label"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p id="marketing-emails-label" className="font-medium text-grey-900">Marketing Emails</p>
                <p className="text-sm text-grey-500">
                  Receive news and promotional offers
                </p>
              </div>
              <Toggle
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
              aria-labelledby="marketing-emails-label"
              />
            </div>
          </div>
        </div>

        <hr className="border-grey-200" />

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            appearance="outlined"
            onClick={() => {
              setEmailNotifications(true);
              setMarketingEmails(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => alert("Saved. Persist these to your API.")}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
