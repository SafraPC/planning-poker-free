import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  key: z.string().min(2).max(32),
});

function flattenAdf(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (n.type === "text" && typeof n.text === "string") return n.text;
  if (Array.isArray(n.content)) {
    return n.content.map(flattenAdf).join("");
  }
  return "";
}

export async function POST(req: Request) {
  const base = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!base || !email || !token) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Chave inválida." }, { status: 400 });
  }
  const key = encodeURIComponent(parsed.data.key);
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const url = `${base.replace(/\/$/, "")}/rest/api/3/issue/${key}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Issue não encontrada ou sem permissão." },
      { status: 404 },
    );
  }
  const issue = (await res.json()) as {
    fields?: { summary?: string; description?: unknown };
  };
  const summary = issue.fields?.summary ?? "";
  const description = flattenAdf(issue.fields?.description);
  return NextResponse.json({ summary, description });
}
