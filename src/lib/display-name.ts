import { PERSISTENT_USER_ID_STORAGE_KEY } from "./user-id";

export const PREFERRED_DISPLAY_NAME_KEY = "pp_display_name";

export function getStoredDisplayName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PREFERRED_DISPLAY_NAME_KEY)?.trim() ?? "";
}

export function setStoredDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  const t = name.trim();
  if (t) localStorage.setItem(PREFERRED_DISPLAY_NAME_KEY, t);
}

export function clearLocalStoragePreservingUserIdAndDisplayName(): void {
  if (typeof window === "undefined") return;
  const uid = localStorage.getItem(PERSISTENT_USER_ID_STORAGE_KEY);
  const display = localStorage.getItem(PREFERRED_DISPLAY_NAME_KEY);
  localStorage.clear();
  if (uid) localStorage.setItem(PERSISTENT_USER_ID_STORAGE_KEY, uid);
  if (display) localStorage.setItem(PREFERRED_DISPLAY_NAME_KEY, display);
}
