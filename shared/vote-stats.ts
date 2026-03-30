import type { AgreementResult, VoteStatRow, VoteValue } from "./types";
import { isStatExcluded, VOTE_SEQUENCE } from "./types";

export function votesForStats(votes: VoteValue[]): VoteValue[] {
  return votes.filter((v) => !isStatExcluded(v));
}

export function computeDistribution(votes: VoteValue[]): VoteStatRow[] {
  const relevant = votesForStats(votes);
  const total = relevant.length;
  const counts = new Map<VoteValue, number>();
  for (const v of VOTE_SEQUENCE) {
    if (isStatExcluded(v)) continue;
    counts.set(v, 0);
  }
  for (const v of relevant) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const rows: VoteStatRow[] = [];
  for (const v of VOTE_SEQUENCE) {
    if (isStatExcluded(v)) continue;
    const count = counts.get(v) ?? 0;
    rows.push({
      value: v,
      label: v === "UNKNOWN" ? "?" : v,
      count,
      share: total === 0 ? 0 : count / total,
    });
  }
  return rows.filter((r) => r.count > 0);
}

export function computeAgreement(votes: VoteValue[]): AgreementResult {
  const relevant = votesForStats(votes);
  const n = relevant.length;
  if (n === 0) {
    return { percent: 0, mode: null, votingCount: 0 };
  }
  const freq = new Map<VoteValue, number>();
  for (const v of relevant) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  let mode: VoteValue | null = null;
  let best = 0;
  for (const [v, c] of freq) {
    if (c > best) {
      best = c;
      mode = v;
    }
  }
  const percent = Math.round((best / n) * 100);
  return { percent, mode, votingCount: n };
}

export function isFullUnanimity(votes: VoteValue[]): boolean {
  const relevant = votesForStats(votes);
  if (relevant.length <= 1) return false;
  const first = relevant[0];
  return relevant.every((v) => v === first);
}

export function shouldCelebrateUnanimity(votes: VoteValue[]): boolean {
  const relevant = votesForStats(votes);
  if (relevant.length === 0) return false;
  const first = relevant[0];
  return relevant.every((v) => v === first);
}
