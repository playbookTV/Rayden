import "./globals.css";

export const metadata = {
  title: "Rayden App",
  description: "Created with create-rayden-app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
