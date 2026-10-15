import { Icon } from "@/components/sifre/Icon";
import { ThemeToggle } from "@/components/sifre/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-violet text-ink">
            <Icon name="shieldcheck" className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-semibold">Şifre Kahramanı</span>
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
