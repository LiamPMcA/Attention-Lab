export type CaptureLevel = {
  staticRed: number;
  flashingRed: number;
  moving: number;
  fakeTargets: number;
};

export function getCaptureLevel(trialIndex: number): CaptureLevel {
  if (trialIndex < 3) {
    return { staticRed: 0, flashingRed: 0, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex < 6) {
    return { staticRed: 2, flashingRed: 0, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex < 9) {
    return { staticRed: 1, flashingRed: 2, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex < 12) {
    return { staticRed: 1, flashingRed: 1, moving: 2, fakeTargets: 0 };
  }
  return { staticRed: 1, flashingRed: 1, moving: 1, fakeTargets: 2 };
}

export const CAPTURE_TRIAL_COUNT = 15;
