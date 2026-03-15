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
    <div className="w-[460px] p-6">
      <NotificationsBlock
        unreadCount={7}
        items={[
          {
            id: "1",
            avatar: (
              <Avatar
                type="image"
                src="https://i.pravatar.cc/150?img=11"
                size="sm"
              />
            ),
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            unread: true,
          },
          {
            id: "2",
            avatar: (
              <Avatar
                type="image"
                src="https://i.pravatar.cc/150?img=11"
                size="sm"
              />
            ),
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
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
            avatar: (
              <Avatar
                type="image"
                src="https://i.pravatar.cc/150?img=11"
                size="sm"
              />
            ),
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
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
            avatar: (
              <Avatar
                type="image"
                src="https://i.pravatar.cc/150?img=11"
                size="sm"
              />
            ),
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
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
            avatar: (
              <Avatar
                type="image"
                src="https://i.pravatar.cc/150?img=11"
                size="sm"
              />
            ),
            text: (
              <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>
            ),
            date: "Thurs 21, 2023",
            time: "10 mins",
            link: { label: "Marketing Design", href: "#" },
            content: {
              type: "comment",
              avatar: (
                <Avatar
                  type="image"
                  src="https://i.pravatar.cc/150?img=11"
                  size="xs"
                />
              ),
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
