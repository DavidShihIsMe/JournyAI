"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "./landing/brand";

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
      <aside
        className="hidden md:flex flex-col w-60 p-6 gap-2"
        style={{ borderRight: `1px solid ${INK}`, background: PAPER2 }}
      >
        <Link
          href="/"
          className="mb-8"
          style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 900, color: INK }}
        >
          Journy
        </Link>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2.5 transition-colors"
              style={{
                border: `1px solid ${active ? INK : "transparent"}`,
                background: active ? PAPER : "transparent",
                color: active ? INK : INK2,
                borderRadius: 0,
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: PAPER2, borderTop: `1px solid ${INK}` }}
      >
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex items-center justify-center h-full transition-colors"
                style={{
                  color: active ? INK : INK3,
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
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
