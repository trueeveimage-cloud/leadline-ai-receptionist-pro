import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useI18n } from "@/lib/i18n";

function Flag({ country, className = "" }: { country: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${country}.png`}
      srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
      width={20}
      height={15}
      alt=""
      aria-hidden
      className={`inline-block rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.06)] ${className}`}
    />
  );
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("lang.label")}
        className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-none border border-border bg-background text-[12px] font-medium tracking-tight hover:border-foreground/40 transition-colors ${className}`}
      >
        <Languages className="h-3.5 w-3.5 opacity-70" />
        <span className="uppercase">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`gap-2.5 cursor-pointer ${l.code === lang ? "font-semibold" : ""}`}
          >
            <Flag country={l.country} />
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
