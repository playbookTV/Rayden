import { useState } from "react";
import { Button, Input, Badge } from "@raydenui/ui";

function App() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-soft-md max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-semibold text-grey-900">
            Welcome to Rayden UI
          </h1>
          <Badge color="success">New</Badge>
        </div>

        <p className="text-grey-600 mb-6">
          Start building beautiful interfaces with our pre-built components.
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Enter your email"
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button variant="primary" className="w-full">
            Get Started
          </Button>

          <Button variant="secondary" appearance="outlined" className="w-full">
            View Documentation
          </Button>
        </div>

        <div className="flex gap-2 mt-6 pt-6 border-t border-grey-200">
          <Badge color="orange">React 19</Badge>
          <Badge color="blue">Tailwind v4</Badge>
          <Badge color="neutral">JavaScript</Badge>
        </div>
      </div>
    </div>
  );
}

export default App;
