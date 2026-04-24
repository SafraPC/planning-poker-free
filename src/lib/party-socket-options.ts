export const PING_INTERVAL_MS = 25_000;

export const partySocketReconnectOptions = {
  minReconnectionDelay: 800,
  maxReconnectionDelay: 30_000,
  reconnectionDelayGrowFactor: 1.35,
  connectionTimeout: 15_000,
  maxRetries: Number.POSITIVE_INFINITY,
  maxEnqueuedMessages: Number.POSITIVE_INFINITY,
};
