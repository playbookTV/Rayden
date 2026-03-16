import type { Meta, StoryObj } from "@storybook/react";
import { ActivityItem } from "./ActivityItem";
import { ActivityContent } from "./ActivityContent";
import { Avatar } from "../Avatar";

const meta: Meta<typeof ActivityItem> = {
  title: "Elements/ActivityFeed",
  component: ActivityItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActivityItem>;

/* ─── Single Item ─────────────────────────────────────────────────── */
export const SingleItem: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> left a comment on{" "}
            <span className="font-medium text-primary-400">Site redesign</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
      />
    </div>
  ),
};

/* ─── With File Content ───────────────────────────────────────────── */
export const WithFileContent: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> uploaded a file to{" "}
            <span className="font-medium text-primary-400">Site redesign</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
        link={{ label: "Marketing Design", href: "#" }}
      >
        <ActivityContent
          variant="file"
          title="Meeting minute"
          size="13MB"
          fileType="PDF File"
          date="11 Sept 23"
        />
      </ActivityItem>
    </div>
  ),
};

/* ─── With Comment Content ────────────────────────────────────────── */
export const WithCommentContent: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> left a comment on{" "}
            <span className="font-medium text-primary-400">Site redesign</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
      >
        <ActivityContent
          variant="comment"
          avatar={<Avatar type="initials" initials="DA" size="xs" />}
          author="David"
          timestamp="2 hours ago"
          comment="I've reviewed the latest mockups and I think we should adjust the color palette to better match our brand guidelines."
          attachments={[
            { name: "Brief", extension: "pdf" },
            { name: "Assets", extension: "zip" },
            { name: "Notes", extension: "doc" },
          ]}
          reactions={4}
          replies={2}
          onReply={() => {}}
        />
      </ActivityItem>
    </div>
  ),
};

/* ─── With CTA Content ────────────────────────────────────────────── */
export const WithCTAContent: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="SA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">Sarah</span> invited you to join{" "}
            <span className="font-medium text-primary-400">Marketing Team</span>
          </>
        }
        date="Thurs 21, 2023"
        time="5 mins"
      >
        <ActivityContent
          variant="cta"
          primaryAction={{ label: "Accept", onClick: () => {} }}
          secondaryAction={{ label: "Decline", onClick: () => {} }}
        />
      </ActivityItem>
    </div>
  ),
};

/* ─── Unread State ────────────────────────────────────────────────── */
export const UnreadState: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> left a comment on{" "}
            <span className="font-medium text-primary-400">Site redesign</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
        unread
      />
    </div>
  ),
};

/* ─── With Badge ──────────────────────────────────────────────────── */
export const WithBadge: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> posted in{" "}
            <span className="font-medium text-primary-400">#general</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
        link={{ label: "Marketing Design", href: "#" }}
        badge="#Marketing-Design"
      />
    </div>
  ),
};

/* ─── Timeline ────────────────────────────────────────────────────── */
export const Timeline: Story = {
  render: () => (
    <div className="w-[480px] p-6">
      <ActivityItem
        avatar={<Avatar type="initials" initials="DA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">David</span> uploaded a file to{" "}
            <span className="font-medium text-primary-400">Site redesign</span>
          </>
        }
        date="Thurs 21, 2023"
        time="10 mins"
        link={{ label: "Marketing Design", href: "#" }}
        connector="top"
        unread
      >
        <ActivityContent
          variant="file"
          title="Meeting minute"
          size="13MB"
          fileType="PDF File"
          date="11 Sept 23"
        />
      </ActivityItem>

      <ActivityItem
        avatar={<Avatar type="initials" initials="SA" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">Sarah</span> left a comment on{" "}
            <span className="font-medium text-primary-400">Brand update</span>
          </>
        }
        date="Thurs 21, 2023"
        time="30 mins"
        connector="middle"
      >
        <ActivityContent
          variant="comment"
          contentStyle="container"
          avatar={<Avatar type="initials" initials="SA" size="xs" />}
          author="Sarah"
          timestamp="30 mins ago"
          comment="The new brand colors look great! Let's finalize these for the Q2 campaign."
          reactions={3}
          replies={1}
        />
      </ActivityItem>

      <ActivityItem
        avatar={<Avatar type="initials" initials="MJ" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">Michael</span> invited you to join{" "}
            <span className="font-medium text-primary-400">Design Team</span>
          </>
        }
        date="Thurs 21, 2023"
        time="1 hour"
        connector="middle"
      >
        <ActivityContent
          variant="cta"
          primaryAction={{ label: "Accept", onClick: () => {} }}
          secondaryAction={{ label: "Decline", onClick: () => {} }}
        />
      </ActivityItem>

      <ActivityItem
        avatar={<Avatar type="initials" initials="JK" size="sm" />}
        text={
          <>
            <span className="font-medium text-grey-700">Jessica</span> shared a document in{" "}
            <span className="font-medium text-primary-400">Research</span>
          </>
        }
        date="Thurs 21, 2023"
        time="2 hours"
        connector="last"
      >
        <ActivityContent
          variant="file"
          contentStyle="container"
          title="Research report"
          size="4.2MB"
          fileType="DOC File"
          date="20 Sept 23"
          icon="file-text"
        />
      </ActivityItem>
    </div>
  ),
};

/* ─── Content Styles ──────────────────────────────────────────────── */
export const ContentStyles: Story = {
  render: () => (
    <div className="w-[480px] space-y-6 p-6">
      <div>
        <p className="text-xs font-medium text-grey-400 mb-2">Card (default)</p>
        <ActivityContent
          variant="file"
          contentStyle="card"
          title="Meeting minute"
          size="13MB"
          fileType="PDF File"
          date="11 Sept 23"
        />
      </div>

      <div>
        <p className="text-xs font-medium text-grey-400 mb-2">Container</p>
        <ActivityContent
          variant="file"
          contentStyle="container"
          title="Meeting minute"
          size="13MB"
          fileType="PDF File"
          date="11 Sept 23"
        />
      </div>

      <div>
        <p className="text-xs font-medium text-grey-400 mb-2">Plain</p>
        <ActivityContent
          variant="comment"
          contentStyle="plain"
          avatar={<Avatar type="initials" initials="DA" size="xs" />}
          author="David"
          timestamp="2 hours ago"
          comment="This is a plain-styled comment with a vertical connector line."
        />
      </div>
    </div>
  ),
};
