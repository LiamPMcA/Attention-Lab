import type { RecoverTrialOutcome, SessionScore } from "@/lib/types";
import type { DifficultyLevel } from "@/lib/difficulty";

function averageReactionTime(outcomes: RecoverTrialOutcome[]): number {
  const hits = outcomes.filter(
    (outcome) => outcome.accuracy > 0 && !outcome.miss && !outcome.falseStart,
  );
  if (hits.length === 0) return 0;
  return Math.round(
    hits.reduce((sum, outcome) => sum + outcome.reactionTime, 0) / hits.length,
  );
}

export type RecoverSessionSummary = SessionScore & {
  baselineRt: number;
  recoveryRt: number;
};

export function summarizeRecoverSession(
  outcomes: RecoverTrialOutcome[],
  difficulty?: DifficultyLevel,
): RecoverSessionSummary {
  const baselineOutcomes = outcomes.filter(
    (outcome) => outcome.probeType === "baseline",
  );
  const recoveryOutcomes = outcomes.filter(
    (outcome) => outcome.probeType === "recovery",
  );

  const baselineRt = averageReactionTime(baselineOutcomes);
  const recoveryRt = averageReactionTime(recoveryOutcomes);
  const recoveryCost = Math.max(0, recoveryRt - baselineRt);

  const validTrials = outcomes.filter(
    (outcome) => outcome.accuracy > 0 && !outcome.miss && !outcome.falseStart,
  );

  return {
    id: crypto.randomUUID(),
    gameId: "recover",
    timestamp: Date.now(),
    reactionTime: recoveryCost,
    accuracy: outcomes.length > 0 ? validTrials.length / outcomes.length : 0,
    trials: outcomes.length,
    baselineRt,
    recoveryRt,
    difficulty,
  };
}

export function recoverScore(session: SessionScore): number | null {
  const summary = session as RecoverSessionSummary;
  if (!summary.baselineRt || !summary.recoveryRt) return null;
  return Math.round((summary.baselineRt / summary.recoveryRt) * session.accuracy * 100);
}
