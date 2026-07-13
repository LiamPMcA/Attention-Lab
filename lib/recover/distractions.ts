import { randomDelay } from "@/lib/timing";

export type DistractionKind = "flash" | "text" | "burst";

export type Distraction = {
  kind: DistractionKind;
  label?: string;
  durationMs: number;
  pauseMs: number;
};

const TEXT_LABELS = ["Look here!", "Hey!", "Over here!", "Wait!"];

export function getDistraction(intensity = 1): Distraction {
  const durationScale = 0.85 + intensity * 0.3;
  const pauseScale = 1.25 - intensity * 0.35;

  const roll = Math.random();

  if (roll < 0.33) {
    return {
      kind: "flash",
      durationMs: Math.round(randomDelay(260, 720) * durationScale),
      pauseMs: Math.round(randomDelay(180, 520) * pauseScale),
    };
  }

  if (roll < 0.66) {
    return {
      kind: "text",
      label: TEXT_LABELS[Math.floor(Math.random() * TEXT_LABELS.length)],
      durationMs: Math.round(randomDelay(300, 750) * durationScale),
      pauseMs: Math.round(randomDelay(180, 520) * pauseScale),
    };
  }

  return {
    kind: "burst",
    label: TEXT_LABELS[Math.floor(Math.random() * TEXT_LABELS.length)],
    durationMs: Math.round(randomDelay(320, 780) * durationScale),
    pauseMs: Math.round(randomDelay(180, 520) * pauseScale),
  };
}
