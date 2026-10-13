import { Icon } from "@/components/sifre/Icon";

export function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6 lg:px-8">
        <span className="flex items-center gap-2 text-mist-dim">
          <Icon name="shieldcheck" className="h-4 w-4 text-cyan" />
          <span className="font-display text-sm font-semibold text-mist">Şifre Kahramanı</span>
        </span>
        <p className="text-xs text-mist-faint">
          Siber Güvenlik Kulübü tarafından hazırlandı. Şifreni güçlendir, dijital dünyanı koru!
        </p>
      </div>
    </footer>
  );
}
