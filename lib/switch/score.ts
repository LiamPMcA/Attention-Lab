import type { SessionScore, SwitchTrialOutcome } from "@/lib/types";
import type { DifficultyLevel } from "@/lib/difficulty";

export type SwitchSessionSummary = SessionScore & {
  repeatRt: number;
  switchRt: number;
};

function averageReactionTime(outcomes: SwitchTrialOutcome[]): number {
  const hits = outcomes.filter((outcome) => outcome.correct && outcome.reactionTime > 0);
  if (hits.length === 0) return 0;
  return Math.round(
    hits.reduce((sum, outcome) => sum + outcome.reactionTime, 0) / hits.length,
  );
}

export function summarizeSwitchSession(
  outcomes: SwitchTrialOutcome[],
  difficulty?: DifficultyLevel,
): SwitchSessionSummary {
  const repeatOutcomes = outcomes.filter((outcome) => !outcome.isSwitchTrial);
  const switchOutcomes = outcomes.filter((outcome) => outcome.isSwitchTrial);

  const repeatRt = averageReactionTime(repeatOutcomes);
  const switchRt = averageReactionTime(switchOutcomes);
  const switchCost = Math.max(0, switchRt - repeatRt);

  const correctTrials = outcomes.filter((outcome) => outcome.correct);

  return {
    id: crypto.randomUUID(),
    gameId: "switch",
    timestamp: Date.now(),
    reactionTime: switchCost,
    accuracy: outcomes.length > 0 ? correctTrials.length / outcomes.length : 0,
    trials: outcomes.length,
    repeatRt,
    switchRt,
    difficulty,
  };
}

export function switchScore(session: SessionScore): number | null {
  const summary = session as SwitchSessionSummary;
  if (!summary.repeatRt || !summary.switchRt) return null;
  if (summary.reactionTime === 0) {
    return Math.round((summary.repeatRt / summary.switchRt) * session.accuracy * 100);
  }
  return Math.round((summary.repeatRt / summary.switchRt) * session.accuracy * 100);
}
