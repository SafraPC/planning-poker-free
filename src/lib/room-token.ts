const URL_SAFE = "0123456789abcdefghijkmnpqrstuvwxyz";

export function generateRoomToken(): string {
  const n = 24;
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  let s = "";
  for (let i = 0; i < n; i += 1) {
    s += URL_SAFE[out[i]! % URL_SAFE.length]!;
  }
  return s;
}
