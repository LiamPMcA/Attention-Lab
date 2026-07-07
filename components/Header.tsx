import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" },
  { href: "/results", label: "Results" },
];

export default function Header() {
  return (
    <header className="border-b border-warm-tan/20 bg-cream-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-warm-dark"
        >
          Attention Lab
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-warm-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-warm-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
