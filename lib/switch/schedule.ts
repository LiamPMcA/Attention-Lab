import type { SwitchRule } from "@/lib/types";

export const SWITCH_TRIAL_COUNT = 20;
const DEFAULT_BLOCK_SIZE = 4;

export function getRuleForTrial(
  trialIndex: number,
  blockSize = DEFAULT_BLOCK_SIZE,
): {
  rule: SwitchRule;
  isSwitchTrial: boolean;
} {
  const blockIndex = Math.floor(trialIndex / blockSize);
  const positionInBlock = trialIndex % blockSize;
  const rule: SwitchRule = blockIndex % 2 === 0 ? "odd" : "vowel";
  const isSwitchTrial = trialIndex > 0 && positionInBlock === 0;

  return { rule, isSwitchTrial };
}

export function ruleLabel(rule: SwitchRule): string {
  return rule === "odd" ? "Tap ODD numbers" : "Tap VOWELS";
}
