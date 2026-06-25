export type GameId = "calibration" | "capture" | "switch" | "recover";

export type TrialPhase = "idle" | "ready" | "stimulus" | "feedback" | "complete";

export type TrialOutcome = {
  reactionTime: number;
  accuracy: number;
  timestamp: number;
  falseStart?: boolean;
};

export type SessionScore = {
  id: string;
  gameId: GameId;
  timestamp: number;
  reactionTime: number;
  accuracy: number;
  trials: number;
};
