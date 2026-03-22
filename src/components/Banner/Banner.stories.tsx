import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./Banner";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["information", "success", "error", "warning", "feature", "opportunity"],
    },
    emphasis: { control: "select", options: ["bold", "subtle"] },
    size: { control: "select", options: ["sm", "lg"] },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    title: "Attention! This is an important alert that provides details about the situation.",
    description: "Here's a brief overview of the issue at hand.",
    buttonLabel: "Click Here",
  },
};

export const Bold: Story = {
  args: {
    title: "Attention! This is an important alert that provides details about the situation.",
    description: "Here's a brief overview of the issue at hand.",
    emphasis: "bold",
    buttonLabel: "Button",
  },
};

export const Small: Story = {
  args: {
    title: "Attention! This is an important alert.",
    description: "Brief overview.",
    size: "sm",
    buttonLabel: "Button",
  },
};

export const AllSubtle: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner
        status="information"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Click Here"
      />
      <Banner
        status="success"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="error"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="warning"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="feature"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="opportunity"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
    </div>
  ),
};

export const AllBold: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner
        status="information"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="success"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="error"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="warning"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="feature"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="opportunity"
        emphasis="bold"
        title="Attention! This is an important alert."
        description="Here's a brief overview."
        buttonLabel="Button"
      />
    </div>
  ),
};

export const SmallVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner
        status="information"
        size="sm"
        title="Attention! This is an important alert."
        description="Brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="information"
        emphasis="bold"
        size="sm"
        title="Attention! This is an important alert."
        description="Brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="error"
        size="sm"
        title="Attention! This is an important alert."
        description="Brief overview."
        buttonLabel="Button"
      />
      <Banner
        status="error"
        emphasis="bold"
        size="sm"
        title="Attention! This is an important alert."
        description="Brief overview."
        buttonLabel="Button"
      />
    </div>
  ),
};

export const NoDismiss: Story = {
  args: {
    title: "This banner cannot be dismissed.",
    dismissible: false,
    status: "feature",
    emphasis: "bold",
  },
};
