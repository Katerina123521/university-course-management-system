import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Uni Courses App",
  description: "University courses management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-nav">
            <div className="app-nav-inner">
              <div className="app-logo">
                <span className="icon">U</span>
                <span>Uni Courses</span>
              </div>
              <nav className="app-nav-links">
                <Link href="/courses">Courses</Link>
                <Link href="/courses/new">New course</Link>
                <Link href="/login">Login</Link>
              </nav>
            </div>
          </header>
          <main className="app-main">
            <div className="app-main-inner">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
