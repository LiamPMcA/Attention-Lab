import { randomDelay } from "@/lib/timing";

export type DistractionKind = "flash" | "text" | "burst";

export type Distraction = {
  kind: DistractionKind;
  label?: string;
  durationMs: number;
  pauseMs: number;
};

const TEXT_LABELS = ["Look here!", "Hey!", "Over here!", "Wait!"];

export function getDistraction(): Distraction {
  const roll = Math.random();

  if (roll < 0.33) {
    return {
      kind: "flash",
      durationMs: randomDelay(260, 720),
      pauseMs: randomDelay(180, 520),
    };
  }

  if (roll < 0.66) {
    return {
      kind: "text",
      label: TEXT_LABELS[Math.floor(Math.random() * TEXT_LABELS.length)],
      durationMs: randomDelay(300, 750),
      pauseMs: randomDelay(180, 520),
    };
  }

  return {
    kind: "burst",
    label: TEXT_LABELS[Math.floor(Math.random() * TEXT_LABELS.length)],
    durationMs: randomDelay(320, 780),
    pauseMs: randomDelay(180, 520),
  };
}
