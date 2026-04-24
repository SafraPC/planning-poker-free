export const PERSISTENT_USER_ID_STORAGE_KEY = "pp_user_id";
const SUFFIX_LEN = 8;
const ALPHANUM =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomSuffix(): string {
  const out = new Uint8Array(SUFFIX_LEN);
  crypto.getRandomValues(out);
  let s = "";
  for (let i = 0; i < SUFFIX_LEN; i += 1) {
    s += ALPHANUM[out[i]! % ALPHANUM.length]!;
  }
  return s;
}

function isValidUserId(v: string): boolean {
  return /^\d{10,20}-[A-Za-z0-9]{8}$/.test(v);
}

export function getOrCreatePersistentUserId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(PERSISTENT_USER_ID_STORAGE_KEY);
  if (existing && isValidUserId(existing)) {
    return existing;
  }
  const id = `${Date.now()}-${randomSuffix()}`;
  localStorage.setItem(PERSISTENT_USER_ID_STORAGE_KEY, id);
  return id;
}
