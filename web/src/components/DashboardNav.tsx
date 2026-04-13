"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home" },
  { href: "/plan", label: "Plan" },
  { href: "/friends", label: "Friends" },
  { href: "/profile", label: "Profile" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-neutral-200 bg-white p-6 gap-2">
        <Link
          href="/"
          className="font-display font-black text-xl text-primary mb-8"
        >
          Journy
        </Link>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-4 py-2.5 rounded-[10px] font-body text-sm font-medium transition-colors
                ${
                  active
                    ? "bg-primary-light text-primary"
                    : "text-neutral-600 hover:bg-neutral-100"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex-1 flex items-center justify-center h-full
                  font-body text-xs font-medium transition-colors
                  ${active ? "text-primary" : "text-neutral-400"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
