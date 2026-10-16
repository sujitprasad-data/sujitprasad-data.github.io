import Link from "next/link";

const links = [
  { href: "/#projects", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#101014]/85 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Primary">
        <Link href="/" className="font-display text-sm font-semibold text-zinc-100">
          Sujit Prasad
        </Link>
        <ul className="flex items-center gap-5 text-sm text-zinc-400">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-violet-400">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
