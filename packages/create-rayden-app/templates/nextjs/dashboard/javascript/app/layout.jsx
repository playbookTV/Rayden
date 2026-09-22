import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Rayden Dashboard",
  description: "Created with create-rayden-app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen bg-grey-50">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
