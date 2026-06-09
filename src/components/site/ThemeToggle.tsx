import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("leadmap-theme");
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const selectTheme = (next: Theme) => {
    setTheme(next);
    window.localStorage.setItem("leadmap-theme", next);
    document.cookie = `leadmap-theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
    applyTheme(next);
  };

  return (
    <div className="inline-flex items-center border border-border bg-background p-1" aria-label="Theme">
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => selectTheme("light")}
        className={`inline-flex h-9 items-center gap-2 px-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
          theme === "light"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => selectTheme("dark")}
        className={`inline-flex h-9 items-center gap-2 px-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
          theme === "dark"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}
