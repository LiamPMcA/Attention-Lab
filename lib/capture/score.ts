import type { CaptureTrialOutcome, SessionScore } from "@/lib/types";

export function summarizeCaptureSession(
  outcomes: CaptureTrialOutcome[],
): SessionScore {
  const hits = outcomes.filter((outcome) => outcome.hitTarget);
  const averageReactionTime =
    hits.length > 0
      ? Math.round(
          hits.reduce((sum, outcome) => sum + outcome.reactionTime, 0) /
            hits.length,
        )
      : 0;

  return {
    id: crypto.randomUUID(),
    gameId: "capture",
    timestamp: Date.now(),
    reactionTime: averageReactionTime,
    accuracy: outcomes.length > 0 ? hits.length / outcomes.length : 0,
    trials: outcomes.length,
  };
}

export function captureScore(session: SessionScore): number | null {
  if (session.reactionTime === 0 || session.accuracy === 0) return null;
  return Math.round((session.accuracy * 1000) / session.reactionTime);
}
