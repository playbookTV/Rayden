import { Outlet } from "react-router-dom";
import Header from "./Header";
import BlogSidebar from "./BlogSidebar";

export default function BlogLayout() {
  return (
    <div className="min-h-screen bg-grey-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-8">
            <Outlet />
          </main>
          <aside className="hidden lg:block lg:col-span-4">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
