import {
  fetchCloudSessions,
  getCurrentUserId,
  insertCloudSession,
  insertCloudSessions,
} from "@/lib/storage/cloud";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { GameId, SessionScore } from "@/lib/types";

const SESSIONS_KEY = "attention-lab-sessions";
const MIGRATED_KEY = "attention-lab-cloud-migrated";

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
  void persistSessionToCloud(session);
}

async function persistSessionToCloud(session: SessionScore): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await insertCloudSession(userId, session);
  } catch {
    // Cloud save failed — local copy still exists.
  }
}

export async function migrateLocalSessionsIfNeeded(
  userId: string,
): Promise<void> {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;

  if (localStorage.getItem(MIGRATED_KEY) === userId) return;

  const localSessions = getSessions();
  if (localSessions.length > 0) {
    await insertCloudSessions(userId, localSessions);
  }

  localStorage.setItem(MIGRATED_KEY, userId);
}

export async function loadSessions(): Promise<SessionScore[]> {
  if (!isSupabaseConfigured()) return getSessions();

  try {
    const userId = await getCurrentUserId();
    if (!userId) return getSessions();

    await migrateLocalSessionsIfNeeded(userId);
    return await fetchCloudSessions(userId);
  } catch {
    return getSessions();
  }
}

export function getSessionsByGame(gameId: GameId): SessionScore[] {
  return getSessions()
    .filter((session) => session.gameId === gameId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function loadSessionsByGame(
  gameId: GameId,
): Promise<SessionScore[]> {
  const sessions = await loadSessions();
  return sessions
    .filter((session) => session.gameId === gameId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getLatestSession(gameId: GameId): SessionScore | null {
  return getSessionsByGame(gameId)[0] ?? null;
}

export async function loadLatestSession(
  gameId: GameId,
): Promise<SessionScore | null> {
  return (await loadSessionsByGame(gameId))[0] ?? null;
}

export async function isUsingCloudStorage(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const userId = await getCurrentUserId();
  return Boolean(userId);
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
