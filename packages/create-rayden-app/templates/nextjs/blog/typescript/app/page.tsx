import { posts, getFeaturedPost } from "@/data/posts";
import PostCard from "@/components/PostCard";

export default function Home() {
  const featuredPost = getFeaturedPost();
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Latest Posts</h1>
        <p className="text-grey-600">
          Discover tutorials, guides, and insights about building with Rayden UI.
        </p>
      </div>

      {featuredPost && <PostCard post={featuredPost} featured />}

      <div className="grid gap-6 sm:grid-cols-2">
        {regularPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
