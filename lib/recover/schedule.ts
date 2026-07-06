import type { RecoverProbeType } from "@/lib/types";

export const RECOVER_PROBE_COUNT = 15;

export const RECOVER_PROBE_SCHEDULE: RecoverProbeType[] = [
  "baseline",
  "baseline",
  "baseline",
  "recovery",
  "baseline",
  "recovery",
  "recovery",
  "baseline",
  "recovery",
  "recovery",
  "recovery",
  "recovery",
  "recovery",
  "recovery",
  "recovery",
];

export function getProbeType(probeIndex: number): RecoverProbeType {
  return RECOVER_PROBE_SCHEDULE[probeIndex] ?? "recovery";
}
