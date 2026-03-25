"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@raydenui/ui";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-grey-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-grey-900">Rayden Blog</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary-600"
                      : "text-grey-600 hover:text-grey-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <Button size="sm">Subscribe</Button>
        </div>
      </div>
    </header>
  );
}
