import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardBody, CardFooter, CardImage } from "./Card";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Avatar } from "../Avatar";
import { Icon } from "../Icon";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "elevated", "ghost"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    rounded: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    shadow: { control: "select", options: ["none", "sm", "md", "lg"] },
    hoverable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader title="Card Title" subtitle="Card subtitle goes here" />
      <CardBody>
        <p className="text-grey-600">
          This is the card body content. You can put any content here including text, images, and
          other components.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="grey" appearance="outlined" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["default", "outlined", "elevated", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="w-64">
          <CardHeader title={`${variant.charAt(0).toUpperCase() + variant.slice(1)}`} />
          <CardBody>
            <p className="text-sm text-grey-600">This card uses the {variant} variant styling.</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Card key={size} size={size} className="w-64">
          <CardHeader title={`Size: ${size}`} bordered />
          <CardBody>
            <p className="text-sm text-grey-600">This card uses {size} size padding.</p>
          </CardBody>
          <CardFooter bordered>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-80">
      <CardImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
        alt="Mountain landscape"
        aspectRatio="video"
      />
      <CardHeader title="Beautiful Mountains" subtitle="Explore nature" />
      <CardBody>
        <p className="text-sm text-grey-600">
          Discover breathtaking mountain views and pristine wilderness.
        </p>
      </CardBody>
    </Card>
  ),
};

export const ImagePositions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card className="w-72">
        <CardImage
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=150&fit=crop"
          alt="Nature scene"
          position="top"
          aspectRatio="video"
        />
        <CardBody>
          <p className="font-medium text-grey-900">Image at top</p>
          <p className="text-sm text-grey-500">Default position</p>
        </CardBody>
      </Card>
      <Card className="w-72">
        <CardBody>
          <p className="font-medium text-grey-900">Image at bottom</p>
          <p className="text-sm text-grey-500">Content first</p>
        </CardBody>
        <CardImage
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=150&fit=crop"
          alt="Foggy landscape"
          position="bottom"
          aspectRatio="video"
        />
      </Card>
    </div>
  ),
};

export const HeaderWithActions: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader
        title="Project Updates"
        subtitle="Last updated 2 hours ago"
        actions={
          <>
            <Badge color="success">Active</Badge>
            <Button variant="grey" appearance="outlined" size="sm">
              <Icon name="ellipsis-horizontal" size="sm" />
            </Button>
          </>
        }
        bordered
      />
      <CardBody>
        <p className="text-grey-600">
          Your project has been updated with 5 new commits. Review the changes and merge when ready.
        </p>
      </CardBody>
      <CardFooter bordered>
        <Button variant="primary" size="sm">
          View Changes
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const FooterAlignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["left", "center", "right", "between"] as const).map((align) => (
        <Card key={align} className="w-80">
          <CardBody>
            <p className="text-sm text-grey-600">Footer align: {align}</p>
          </CardBody>
          <CardFooter align={align} bordered>
            <Button variant="grey" appearance="outlined" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Confirm
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card hoverable className="w-64 cursor-pointer">
        <CardBody>
          <p className="font-medium text-grey-900">Hoverable Card</p>
          <p className="text-sm text-grey-500">Hover to see shadow effect</p>
        </CardBody>
      </Card>
      <Card className="w-64">
        <CardBody>
          <p className="font-medium text-grey-900">Static Card</p>
          <p className="text-sm text-grey-500">No hover effect</p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-72" hoverable>
      <CardImage
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
        alt="Product watch"
        aspectRatio="square"
      />
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-grey-900">Premium Watch</p>
            <p className="text-sm text-grey-500">Leather strap</p>
          </div>
          <Badge color="orange">Sale</Badge>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-grey-900">$299</span>
          <span className="text-sm text-grey-400 line-through">$399</span>
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const UserProfileCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader
        actions={
          <Button variant="grey" appearance="outlined" size="sm">
            <Icon name="ellipsis-horizontal" size="sm" />
          </Button>
        }
      />
      <CardBody className="text-center">
        <Avatar
          size="2xl"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
          alt="John Doe"
          className="mx-auto"
        />
        <h3 className="mt-4 text-lg font-semibold text-grey-900">John Doe</h3>
        <p className="text-sm text-grey-500">Senior Developer</p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div>
            <p className="font-semibold text-grey-900">128</p>
            <p className="text-grey-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold text-grey-900">1.2k</p>
            <p className="text-grey-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-grey-900">284</p>
            <p className="text-grey-500">Following</p>
          </div>
        </div>
      </CardBody>
      <CardFooter align="center" bordered>
        <Button variant="primary" size="sm">
          Follow
        </Button>
        <Button variant="grey" appearance="outlined" size="sm">
          Message
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <Card className="w-96" hoverable>
      <CardImage
        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=250&fit=crop"
        alt="Laptop and coffee"
        aspectRatio="video"
      />
      <CardBody>
        <div className="mb-2 flex gap-2">
          <Badge color="blue" size="sm">
            Technology
          </Badge>
          <Badge color="neutral" size="sm">
            5 min read
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-grey-900">Building Modern Web Applications</h3>
        <p className="mt-2 text-sm text-grey-600">
          Learn the best practices for building scalable and maintainable web applications using
          modern frameworks and tools.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Avatar
            size="sm"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
            alt="Jane Smith"
          />
          <div className="text-sm">
            <p className="font-medium text-grey-900">Jane Smith</p>
            <p className="text-grey-500">Mar 15, 2024</p>
          </div>
        </div>
      </CardBody>
    </Card>
  ),
};

export const NestedCards: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader title="Dashboard Overview" bordered />
      <CardBody>
        <div className="space-y-3">
          <Card variant="ghost" size="sm" className="bg-grey-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Total Users</span>
                <span className="font-semibold text-grey-900">1,234</span>
              </div>
            </CardBody>
          </Card>
          <Card variant="ghost" size="sm" className="bg-grey-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Revenue</span>
                <span className="font-semibold text-success-600">$12,345</span>
              </div>
            </CardBody>
          </Card>
          <Card variant="ghost" size="sm" className="bg-grey-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Active Sessions</span>
                <span className="font-semibold text-grey-900">89</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  ),
};
