import { Link } from "react-router-dom";
import { Badge, Avatar } from "@raydenui/ui";
import type { Post } from "../data/posts";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        to={`/post/${post.slug}`}
        className="block bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 hover:shadow-lg transition-shadow"
      >
        <Badge color="orange" className="mb-4">
          Featured
        </Badge>
        <h2 className="text-2xl font-bold text-grey-900 mb-3">{post.title}</h2>
        <p className="text-grey-600 mb-6 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-3">
          <Avatar initials={post.author.initials} size="sm" />
          <div>
            <p className="text-sm font-medium text-grey-900">{post.author.name}</p>
            <p className="text-xs text-grey-500">
              {post.publishedAt} · {post.readTime}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.slug}`}
      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <Badge color="neutral">{post.category}</Badge>
        <span className="text-xs text-grey-500">{post.readTime}</span>
      </div>
      <h3 className="text-lg font-semibold text-grey-900 mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-grey-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center gap-3">
        <Avatar initials={post.author.initials} size="xs" />
        <div>
          <p className="text-sm font-medium text-grey-900">{post.author.name}</p>
          <p className="text-xs text-grey-500">{post.publishedAt}</p>
        </div>
      </div>
    </Link>
  );
}
