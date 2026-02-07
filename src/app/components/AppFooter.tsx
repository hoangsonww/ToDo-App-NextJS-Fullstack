"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const appLinks = [
  { label: "Home", href: "/home" },
  { label: "Planner", href: "/planner" },
  { label: "Insights", href: "/insights" },
  { label: "Focus", href: "/focus" },
  { label: "Profile", href: "/profile" },
];

export default function AppFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/landing") {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="app-footer" aria-label="Application footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <h2>Flowlist App</h2>
          <p>
            Keep planning, focus, and insights aligned in a single workspace for
            reliable delivery.
          </p>
        </div>

        <nav className="app-footer__nav" aria-label="Footer navigation">
          {appLinks.map((link) => (
            <Link key={link.href} href={link.href} className="app-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="app-footer__meta">
          <Link href="/api-docs" className="app-footer__link">
            API Docs
          </Link>
          <Link href="/swagger" className="app-footer__link">
            Swagger UI
          </Link>
          <span>Copyright {year} Flowlist</span>
        </div>
      </div>
    </footer>
  );
}
