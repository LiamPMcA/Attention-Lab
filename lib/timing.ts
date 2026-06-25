export function now(): number {
  return performance.now();
}

export function reactionTime(stimulusAt: number, responseAt: number): number {
  return Math.round(responseAt - stimulusAt);
}

export function randomDelay(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs);
}
