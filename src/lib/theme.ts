export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "sifre-theme";
export const THEME_CHANGE_EVENT = "sifre-themechange";

// Runs before first paint so a saved choice never flashes the wrong theme.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
