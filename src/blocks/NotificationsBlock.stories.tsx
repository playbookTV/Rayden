import type { Meta, StoryObj } from "@storybook/react";
import { NotificationsBlock } from "./NotificationsBlock";
import { Avatar } from "../components/Avatar";

const meta: Meta<typeof NotificationsBlock> = {
  title: "Blocks/Notifications",
  component: NotificationsBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotificationsBlock>;

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-[460px] p-6">
      <NotificationsBlock
        unreadCount={7}
        items={[
          {
            id: "1",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            unread: true,
          },
          {
            id: "2",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            unread: true,
            link: { label: "Marketing Design", href: "#" },
            content: {
              type: "file",
              title: "Meeting minute",
              size: "13MB",
              fileType: "PDF File",
              date: "11 Sept 23",
            },
          },
          {
            id: "3",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            unread: true,
            content: {
              type: "file",
              title: "Meeting minute",
              size: "13MB",
              fileType: "PDF File",
              date: "11 Sept 23",
            },
          },
          {
            id: "4",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            link: { label: "Marketing Design", href: "#" },
            content: {
              type: "cta",
              primaryAction: { label: "Accept" },
              secondaryAction: { label: "Decline" },
            },
          },
          {
            id: "5",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            link: { label: "Marketing Design", href: "#" },
            content: {
              type: "comment",
              avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="xs" />,
              author: "David",
              timestamp: "2 hours ago",
              comment:
                "Kindly resolve the discrepancies, this is the blank empty state to start with nothing to share just you and the engineering team hating on the CPO",
              reactions: 10,
              replies: 12,
            },
          },
        ]}
      />
    </div>
  ),
};

/* ─── Long content (narrow-width regression) ──────────────────────── */
export const LongContent: Story = {
  name: "Long content",
  parameters: {
    docs: {
      description: {
        story:
          "Long filenames, long link labels and long comment bodies must reflow inside the item rather than overlap the timestamp. Resize to 320px to check the stacked metadata.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-[460px] p-6">
      <NotificationsBlock
        unreadCount={3}
        items={[
          {
            id: "long-1",
            avatar: <Avatar type="initials" initials="AO" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">Adeola Okonkwo-Fitzgerald</span>{" "}
                uploaded a revised attachment to{" "}
                <span className="font-medium text-action-primary-text">
                  Q4 brand refresh and website redesign
                </span>
              </>
            ),
            date: "Thurs 21 September, 2023",
            time: "10 mins",
            unread: true,
            link: { label: "Marketing Design — Website workstream", href: "#" },
            content: {
              type: "file",
              title: "2023-Q4-brand-refresh-meeting-minutes-final-v3.pdf",
              size: "13MB",
              fileType: "PDF File",
              date: "11 Sept 23",
            },
          },
          {
            id: "long-2",
            avatar: <Avatar type="initials" initials="DA" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21 September, 2023",
            time: "2 hours",
            unread: true,
            badge: "#Marketing-Design-Website",
            content: {
              type: "comment",
              avatar: <Avatar type="initials" initials="DA" size="xs" />,
              author: "David Oyelowo-Abimbola",
              timestamp: "2 hours ago",
              comment:
                "Kindly resolve the discrepancies between the exported specification and the implemented spacing scale before Thursday, because the engineering handover depends on a single agreed source of truth.",
              reactions: 10,
              replies: 12,
            },
          },
          {
            id: "long-3",
            avatar: <Avatar type="initials" initials="SA" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">Sarah</span> invited you to join{" "}
                <span className="font-medium text-action-primary-text">Marketing Team</span>
              </>
            ),
            date: "Thurs 21 September, 2023",
            time: "3 days",
            link: { label: "Review the invitation details", href: "#" },
            content: {
              type: "cta",
              primaryAction: { label: "Accept" },
              secondaryAction: { label: "Decline" },
            },
          },
        ]}
      />
    </div>
  ),
};

/* ─── Narrow container ────────────────────────────────────────────── */
export const NarrowContainer: Story = {
  name: "Narrow container",
  parameters: {
    docs: {
      description: {
        story:
          "The metadata responds to the width the item actually has, so the block still reads correctly inside a narrow sidebar on a wide screen.",
      },
    },
  },
  render: () => (
    <div className="w-[288px] p-2">
      <NotificationsBlock
        title="Notifications"
        headingLevel={2}
        unreadCount={2}
        items={[
          {
            id: "narrow-1",
            avatar: <Avatar type="initials" initials="DA" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a comment on{" "}
                <span className="font-medium text-action-primary-text">Site redesign</span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            unread: true,
            link: { label: "Marketing Design", href: "#" },
          },
          {
            id: "narrow-2",
            avatar: <Avatar type="initials" initials="SA" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700">Sarah</span> shared a file in{" "}
                <span className="font-medium text-action-primary-text">Research</span>
              </>
            ),
            date: "Wed 20, 2023",
            time: "1 hour",
            unread: true,
            content: {
              type: "file",
              title: "research-report-2023.docx",
              size: "4.2MB",
              fileType: "DOC File",
              date: "20 Sept 23",
            },
          },
        ]}
      />
    </div>
  ),
};
