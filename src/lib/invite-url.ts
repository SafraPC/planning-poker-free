export const TOKEN_PARAM = "token";

export function buildSalaUrlWithToken(origin: string, token: string): string {
  const u = new URL("/sala", origin);
  u.searchParams.set(TOKEN_PARAM, token);
  return u.toString();
}
