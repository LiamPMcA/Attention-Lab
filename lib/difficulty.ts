export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type DifficultyOption = {
  value: DifficultyLevel;
  label: string;
  description: string;
};

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: 1,
    label: "Relaxed",
    description: "Fewer distractors, slower ramp, more time to respond.",
  },
  {
    value: 2,
    label: "Easy",
    description: "A gentler challenge with extra breathing room.",
  },
  {
    value: 3,
    label: "Standard",
    description: "The default Attention Lab challenge.",
  },
  {
    value: 4,
    label: "Hard",
    description: "More distractions early and tighter timing.",
  },
  {
    value: 5,
    label: "Intense",
    description: "Maximum pressure from the first trials.",
  },
];

export type DifficultySettings = {
  level: DifficultyLevel;
  captureTrialOffset: number;
  captureRampMultiplier: number;
  captureStimulusTimeoutMs: number;
  captureReadyMinMs: number;
  captureReadyMaxMs: number;
  recoverDistractionIntensity: number;
  recoverReadyMinMs: number;
  recoverReadyMaxMs: number;
  recoverRecoveryReadyMinMs: number;
  recoverRecoveryReadyMaxMs: number;
  switchBlockSize: number;
  switchStimulusTimeoutMs: number;
  switchReadyMinMs: number;
  switchReadyMaxMs: number;
};

export function getDifficultySettings(level: DifficultyLevel): DifficultySettings {
  const t = (level - 1) / 4;

  return {
    level,
    captureTrialOffset: Math.round((level - 3) * 1.5),
    captureRampMultiplier: 0.75 + t * 0.5,
    captureStimulusTimeoutMs: Math.round(3200 - t * 1100),
    captureReadyMinMs: Math.round(520 - t * 170),
    captureReadyMaxMs: Math.round(1050 - t * 350),
    recoverDistractionIntensity: 0.75 + t * 0.55,
    recoverReadyMinMs: Math.round(620 - t * 180),
    recoverReadyMaxMs: Math.round(1350 - t * 450),
    recoverRecoveryReadyMinMs: Math.round(340 - t * 140),
    recoverRecoveryReadyMaxMs: Math.round(2400 - t * 1100),
    switchBlockSize: Math.max(2, Math.round(6 - t * 4)),
    switchStimulusTimeoutMs: Math.round(3400 - t * 1100),
    switchReadyMinMs: Math.round(520 - t * 170),
    switchReadyMaxMs: Math.round(980 - t * 320),
  };
}

export function getDifficultyLabel(level?: number): string {
  if (!level || level < 1 || level > 5) return "Standard";
  return DIFFICULTY_OPTIONS[level - 1].label;
}

export function getEffectiveCaptureTrialIndex(
  trialIndex: number,
  settings: DifficultySettings,
): number {
  const ramped = Math.floor(trialIndex * settings.captureRampMultiplier);
  return Math.min(9, Math.max(0, ramped + settings.captureTrialOffset));
}
