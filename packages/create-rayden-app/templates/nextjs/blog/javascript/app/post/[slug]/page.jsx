import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Avatar, Breadcrumb, Divider, Button } from "@raydenui/ui";
import { getPostBySlug, posts } from "@/data/posts";

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: post.category },
            { label: post.title },
          ]}
          className="mb-6"
        />

        <Badge color="neutral" className="mb-4">
          {post.category}
        </Badge>

        <h1 className="text-3xl font-bold text-grey-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <Avatar initials={post.author.initials} size="md" />
          <div>
            <p className="font-medium text-grey-900">{post.author.name}</p>
            <p className="text-sm text-grey-500">
              {post.publishedAt} · {post.readTime}
            </p>
          </div>
        </div>

        <Divider className="mb-8" />

        <div className="prose prose-grey max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={index} className="text-2xl font-bold text-grey-900 mt-8 mb-4">
                  {paragraph.slice(2)}
                </h1>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl font-semibold text-grey-900 mt-6 mb-3">
                  {paragraph.slice(3)}
                </h2>
              );
            }
            if (paragraph.startsWith("```")) {
              return null;
            }
            if (paragraph.startsWith("- ")) {
              return (
                <li key={index} className="text-grey-700 ml-4">
                  {paragraph.slice(2)}
                </li>
              );
            }
            if (paragraph.trim()) {
              return (
                <p key={index} className="text-grey-700 mb-4">
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>

        <Divider className="my-8" />

        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="grey" appearance="outlined">
              ← Back to Posts
            </Button>
          </Link>
          <Button>Share Article</Button>
        </div>
      </div>
    </article>
  );
}
