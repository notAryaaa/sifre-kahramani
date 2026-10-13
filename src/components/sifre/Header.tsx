import { Icon } from "@/components/sifre/Icon";

const NAV_LINKS = [
  { href: "#lab", label: "Şifre Testi" },
  { href: "#ogren", label: "Öğren" },
  { href: "#oyun", label: "Oyun" },
  { href: "#kurallar", label: "Kurallar" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-violet text-ink">
            <Icon name="shieldcheck" className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-semibold">Şifre Kahramanı</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-mist-dim md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-mist">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#lab"
          className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cyan"
        >
          Şifremi Test Et
        </a>
      </div>
    </header>
  );
}
