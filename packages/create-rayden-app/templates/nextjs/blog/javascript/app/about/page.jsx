import { Avatar, Divider, Button } from "@raydenui/ui";
import { authors } from "@/data/posts";

export default function About() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-4">About This Blog</h1>
        <p className="text-grey-600 mb-8">
          Welcome to the Rayden UI blog! This is where we share tutorials, guides,
          and insights about building beautiful user interfaces with our component library.
        </p>

        <Divider className="my-8" />

        <h2 className="text-xl font-semibold text-grey-900 mb-6">Our Authors</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {Object.values(authors).map((author) => (
            <div
              key={author.initials}
              className="flex items-start gap-4 p-4 rounded-xl bg-grey-50"
            >
              <Avatar initials={author.initials} size="lg" />
              <div>
                <p className="font-semibold text-grey-900">{author.name}</p>
                <p className="text-sm text-grey-500 mb-2">{author.role}</p>
                <p className="text-sm text-grey-600">{author.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider className="my-8" />

        <h2 className="text-xl font-semibold text-grey-900 mb-4">Stay Updated</h2>
        <p className="text-grey-600 mb-6">
          Subscribe to our newsletter to get the latest posts delivered directly to your inbox.
        </p>
        <Button>Subscribe to Newsletter</Button>
      </div>
    </div>
  );
}
