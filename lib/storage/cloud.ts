import { createClient } from "@/lib/supabase/client";
import type { GameId, SessionScore } from "@/lib/types";

type GameSessionRow = {
  id: string;
  user_id: string;
  game_id: GameId;
  played_at: number;
  reaction_time: number;
  accuracy: number;
  trials: number;
  difficulty: number | null;
  baseline_rt: number | null;
  recovery_rt: number | null;
  repeat_rt: number | null;
  switch_rt: number | null;
};

function rowToSession(row: GameSessionRow): SessionScore {
  return {
    id: row.id,
    gameId: row.game_id,
    timestamp: row.played_at,
    reactionTime: row.reaction_time,
    accuracy: row.accuracy,
    trials: row.trials,
    difficulty: row.difficulty ?? undefined,
    baselineRt: row.baseline_rt ?? undefined,
    recoveryRt: row.recovery_rt ?? undefined,
    repeatRt: row.repeat_rt ?? undefined,
    switchRt: row.switch_rt ?? undefined,
  };
}

function sessionToRow(session: SessionScore, userId: string): GameSessionRow {
  return {
    id: session.id,
    user_id: userId,
    game_id: session.gameId,
    played_at: session.timestamp,
    reaction_time: session.reactionTime,
    accuracy: session.accuracy,
    trials: session.trials,
    difficulty: session.difficulty ?? null,
    baseline_rt: session.baselineRt ?? null,
    recovery_rt: session.recoveryRt ?? null,
    repeat_rt: session.repeatRt ?? null,
    switch_rt: session.switchRt ?? null,
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchCloudSessions(userId: string): Promise<SessionScore[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: false });

  if (error) throw error;
  return (data as GameSessionRow[]).map(rowToSession);
}

export async function insertCloudSession(
  userId: string,
  session: SessionScore,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("game_sessions")
    .upsert(sessionToRow(session, userId), { onConflict: "id" });

  if (error) throw error;
}

export async function insertCloudSessions(
  userId: string,
  sessions: SessionScore[],
): Promise<void> {
  if (sessions.length === 0) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("game_sessions")
    .upsert(
      sessions.map((session) => sessionToRow(session, userId)),
      { onConflict: "id" },
    );

  if (error) throw error;
}
