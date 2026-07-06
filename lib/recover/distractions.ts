export type DistractionKind = "flash" | "text" | "burst";

export type Distraction = {
  kind: DistractionKind;
  label?: string;
  durationMs: number;
  pauseMs: number;
};

export function getDistraction(probeIndex: number): Distraction {
  if (probeIndex < 6) {
    return { kind: "flash", durationMs: 380, pauseMs: 350 };
  }
  if (probeIndex < 10) {
    return { kind: "text", label: "Look here!", durationMs: 520, pauseMs: 300 };
  }
  return { kind: "burst", label: "Hey!", durationMs: 680, pauseMs: 250 };
}
