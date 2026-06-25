import type { GameId, SessionScore } from "@/lib/types";

const SESSIONS_KEY = "attention-lab-sessions";

function isSessionScore(value: unknown): value is SessionScore {
  if (!value || typeof value !== "object") return false;
  const session = value as SessionScore;
  return (
    typeof session.id === "string" &&
    typeof session.gameId === "string" &&
    typeof session.timestamp === "number" &&
    typeof session.reactionTime === "number" &&
    typeof session.accuracy === "number" &&
    typeof session.trials === "number"
  );
}

export function getSessions(): SessionScore[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isSessionScore);
  } catch {
    return [];
  }
}

export function saveSession(session: SessionScore): void {
  if (typeof window === "undefined") return;

  const sessions = getSessions();
  sessions.push(session);
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getSessionsByGame(gameId: GameId): SessionScore[] {
  return getSessions()
    .filter((session) => session.gameId === gameId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getLatestSession(gameId: GameId): SessionScore | null {
  return getSessionsByGame(gameId)[0] ?? null;
}

export function summarizeSession(
  gameId: GameId,
  outcomes: { reactionTime: number; accuracy: number; falseStart?: boolean }[],
): SessionScore {
  const validTrials = outcomes.filter(
    (outcome) => !outcome.falseStart && outcome.accuracy > 0,
  );
  const averageReactionTime =
    validTrials.length > 0
      ? Math.round(
          validTrials.reduce((sum, outcome) => sum + outcome.reactionTime, 0) /
            validTrials.length,
        )
      : 0;

  return {
    id: crypto.randomUUID(),
    gameId,
    timestamp: Date.now(),
    reactionTime: averageReactionTime,
    accuracy: outcomes.length > 0 ? validTrials.length / outcomes.length : 0,
    trials: outcomes.length,
  };
}
