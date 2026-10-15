"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/sifre/Icon";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export function ThemeToggle() {
  // null on the server: the real theme is only known in the browser.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  function toggle() {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode); the choice just won't be remembered.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Karanlık temaya geç" : "Aydınlık temaya geç"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist-dim transition hover:text-mist"
    >
      {theme && <Icon name={theme === "light" ? "moon" : "sun"} className="h-5 w-5" />}
    </button>
  );
}

