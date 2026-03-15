# ActivityFeed

Activity feed components for displaying notifications, activity timelines, and event streams.

## Import

```tsx
import { ActivityItem, ActivityContent } from "@raydenui/ui";
import type {
  ActivityItemProps,
  ActivityItemLink,
  ActivityContentProps,
  ActivityContentVariant,
  ActivityContentStyle,
  ActivityContentAttachment,
  ActivityContentAction,
} from "@raydenui/ui";
```

## Usage

### Basic Activity Item

```tsx
<ActivityItem
  avatar={<Avatar type="initials" initials="JD" size="sm" />}
  text={<><strong>John Doe</strong> uploaded a new file</>}
  date="Thurs 21, 2023"
  time="10 mins"
/>
```

### With Unread Indicator

```tsx
<ActivityItem
  avatar={<Avatar type="image" src="..." size="sm" />}
  text={<><strong>Jane Smith</strong> mentioned you in a comment</>}
  date="Today"
  time="5 mins"
  unread
/>
```

### With Link and Badge

```tsx
<ActivityItem
  avatar={<Avatar type="initials" initials="AB" size="sm" />}
  text={<><strong>Alice Brown</strong> joined the team</>}
  date="Sept 15, 2023"
  link={{ label: "View Profile", href: "/users/alice" }}
  badge="#Marketing-Design"
/>
```

### Timeline Layout (Connectors)

Use the `connector` prop to create a timeline:

```tsx
<div className="flex flex-col">
  <ActivityItem
    connector="top"
    avatar={<Avatar type="initials" initials="JD" />}
    text={<><strong>John</strong> created the project</>}
    date="Sept 1, 2023"
  />
  <ActivityItem
    connector="middle"
    avatar={<Avatar type="initials" initials="AS" />}
    text={<><strong>Alice</strong> added a file</>}
    date="Sept 3, 2023"
  />
  <ActivityItem
    connector="last"
    avatar={<Avatar type="initials" initials="BW" />}
    text={<><strong>Bob</strong> completed the review</>}
    date="Sept 5, 2023"
  />
</div>
```

### With File Content

```tsx
<ActivityItem
  avatar={<Avatar type="initials" initials="JD" />}
  text={<><strong>John Doe</strong> uploaded a document</>}
  date="Today"
  time="2 hours ago"
>
  <ActivityContent
    variant="file"
    icon="file"
    title="Project_Proposal.pdf"
    size="13MB"
    fileType="PDF File"
    date="11 Sept 23"
  />
</ActivityItem>
```

### With Comment Content

```tsx
<ActivityItem
  avatar={<Avatar type="image" src="..." />}
  text={<><strong>Jane Smith</strong> left a comment</>}
  date="Today"
>
  <ActivityContent
    variant="comment"
    avatar={<Avatar type="image" src="..." size="xs" />}
    author="Jane Smith"
    timestamp="2 hours ago"
    comment="Great work on this design! I think we should consider adding more contrast to the header section."
    reactions={12}
    replies={3}
    onReply={() => openReplyDialog()}
  />
</ActivityItem>
```

### With CTA Actions

```tsx
<ActivityItem
  avatar={<Avatar type="initials" initials="SY" />}
  text={<><strong>System</strong> is requesting your approval</>}
  date="Today"
>
  <ActivityContent
    variant="cta"
    primaryAction={{ label: "Accept", onClick: () => accept() }}
    secondaryAction={{ label: "Decline", onClick: () => decline() }}
  />
</ActivityItem>
```

## API Reference

### ActivityItemProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | `ReactNode` | — | Avatar element (required) |
| `text` | `ReactNode` | — | Primary text content (required) |
| `unread` | `boolean` | `false` | Show green unread indicator |
| `date` | `string` | — | Date label (e.g., "Thurs 21, 2023") |
| `time` | `string` | — | Time label, right-aligned (e.g., "10 mins") |
| `link` | `ActivityItemLink` | — | Optional action link in meta row |
| `badge` | `string` | — | Badge text (e.g., "#Marketing-Design") |
| `connector` | `"top" \| "middle" \| "last"` | — | Timeline connector line position |
| `children` | `ReactNode` | — | Optional content block (ActivityContent) |

### ActivityItemLink

```ts
interface ActivityItemLink {
  label: string;
  href?: string;
  onClick?: () => void;
}
```

### ActivityContentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"file" \| "comment" \| "cta"` | — | Content variant (required) |
| `contentStyle` | `"plain" \| "card" \| "container"` | `"card"` | Visual style wrapper |

#### File Variant Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode \| IconName` | `"file"` | Leading icon |
| `title` | `string` | — | File name |
| `size` | `string` | — | File size (e.g., "13MB") |
| `fileType` | `string` | — | File type label (e.g., "PDF File") |
| `date` | `string` | — | File date (e.g., "11 Sept 23") |

#### Comment Variant Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | `ReactNode` | — | Author avatar |
| `author` | `string` | — | Author name |
| `timestamp` | `string` | — | Timestamp (e.g., "2 hours ago") |
| `comment` | `string` | — | Comment body text |
| `attachments` | `ActivityContentAttachment[]` | — | File attachments |
| `reactions` | `number` | — | Number of reactions |
| `replies` | `number` | — | Number of replies |
| `onReply` | `() => void` | — | Reply button callback |

#### CTA Variant Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primaryAction` | `ActivityContentAction` | — | Primary action button |
| `secondaryAction` | `ActivityContentAction` | — | Secondary action button |

### Supporting Types

```ts
interface ActivityContentAttachment {
  name: string;
  extension: string;
}

interface ActivityContentAction {
  label: string;
  onClick?: () => void;
}

type ActivityContentStyle = "plain" | "card" | "container";
```

## Content Styles

| Style | Description |
|-------|-------------|
| `plain` | No background, with vertical connector line |
| `card` | White background with soft shadow |
| `container` | Grey background with border |

## Examples

### Notifications Panel

```tsx
function NotificationsPanel({ notifications }) {
  return (
    <div className="flex flex-col divide-y divide-grey-100">
      {notifications.map((notification) => (
        <ActivityItem
          key={notification.id}
          avatar={<Avatar type="image" src={notification.user.avatar} size="sm" />}
          text={
            <>
              <strong>{notification.user.name}</strong> {notification.action}
            </>
          }
          date={notification.date}
          time={notification.timeAgo}
          unread={!notification.read}
          link={notification.link}
        />
      ))}
    </div>
  );
}
```

### Project Activity Timeline

```tsx
function ProjectTimeline({ activities }) {
  return (
    <div className="flex flex-col">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          connector={
            index === 0 ? "top" :
            index === activities.length - 1 ? "last" : "middle"
          }
          avatar={<Avatar type="initials" initials={activity.initials} />}
          text={activity.description}
          date={activity.date}
        >
          {activity.file && (
            <ActivityContent
              variant="file"
              title={activity.file.name}
              size={activity.file.size}
              fileType={activity.file.type}
            />
          )}
        </ActivityItem>
      ))}
    </div>
  );
}
```
