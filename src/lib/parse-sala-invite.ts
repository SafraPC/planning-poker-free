const TOKEN = "token";

function buildSalaPath(params: URLSearchParams): { path: string } | { error: string } {
  const token =
    params.get(TOKEN) ?? params.get("Token");
  if (!token?.trim()) {
    return { error: "O link precisa ter o parâmetro token=…" };
  }
  const out = new URLSearchParams();
  out.set(TOKEN, token.trim());
  for (const key of ["host", "room", "name"] as const) {
    const v = params.get(key) ?? params.get(key.charAt(0).toUpperCase() + key.slice(1));
    if (v) out.set(key, v);
  }
  return { path: `/sala?${out.toString()}` };
}

export function parseSalaInviteInput(raw: string): { path: string } | { error: string } {
  const t = raw.trim();
  if (!t) {
    return { error: "Cole o link de convite." };
  }
  const origin = "https://pivot.local";
  try {
    if (/^https?:\/\//i.test(t)) {
      const u = new URL(t);
      if (!u.pathname.includes("sala")) {
        return { error: "O link precisa conter /sala e o parâmetro token=…" };
      }
      return buildSalaPath(u.searchParams);
    }
    if (t.startsWith("/sala")) {
      return buildSalaPath(new URL(t, origin).searchParams);
    }
    if (t.startsWith("?")) {
      return buildSalaPath(new URLSearchParams(t.slice(1)));
    }
    if (t.includes("token=") || t.includes("Token=")) {
      return buildSalaPath(new URLSearchParams(t));
    }
  } catch {
    return { error: "Não deu para ler. Copie a URL de novo." };
  }
  return { error: "Cole a URL completa ou o trecho com ?token=…" };
}
