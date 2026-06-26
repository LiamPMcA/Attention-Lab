export type GameId = "calibration" | "capture" | "switch" | "recover";

export type TrialPhase = "idle" | "ready" | "stimulus" | "feedback" | "complete";

export type TrialOutcome = {
  reactionTime: number;
  accuracy: number;
  timestamp: number;
  falseStart?: boolean;
  distractorTap?: boolean;
  miss?: boolean;
};

export type ShapeKind =
  | "target"
  | "distractor-red-static"
  | "distractor-red-flash"
  | "distractor-fake"
  | "distractor-moving";

export type ShapeVariant = "circle" | "square" | "diamond" | "triangle";

export type ArenaShape = {
  id: string;
  kind: ShapeKind;
  variant: ShapeVariant;
  isTarget: boolean;
  x: number;
  y: number;
  size: number;
  rotation?: number;
  vx?: number;
  vy?: number;
  wobblePhase?: number;
  wobbleSpeed?: number;
  erraticTimer?: number;
};

export type CaptureTrialOutcome = TrialOutcome & {
  tappedShapeId?: string;
  hitTarget: boolean;
};

export type SessionScore = {
  id: string;
  gameId: GameId;
  timestamp: number;
  reactionTime: number;
  accuracy: number;
  trials: number;
};
