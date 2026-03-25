import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-grey-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-grey-200 mt-16 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-grey-500">
            <p>© 2024 Rayden Store. Built with Rayden UI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
