import { Link } from "react-router-dom";
import { Input, Badge, Avatar, Divider } from "@raydenui/ui";
import { posts, categories, authors } from "../data/posts";

export default function BlogSidebar() {
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="space-y-8 sticky top-8">
      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-grey-900 mb-4">Search</h3>
        <Input placeholder="Search posts..." leadingIcon="search" />
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-grey-900 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map((category) => (
            <Badge key={category} color="neutral" className="cursor-pointer hover:bg-grey-200">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-grey-900 mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.slug}`} className="block group">
              <h4 className="text-sm font-medium text-grey-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-grey-500 mt-1">{post.publishedAt}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Author Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-grey-900 mb-4">About the Author</h3>
        <div className="flex items-start gap-3">
          <Avatar initials={authors.sarah.initials} size="lg" />
          <div>
            <p className="font-medium text-grey-900">{authors.sarah.name}</p>
            <p className="text-sm text-grey-500">{authors.sarah.role}</p>
            <Divider className="my-3" />
            <p className="text-sm text-grey-600">{authors.sarah.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
