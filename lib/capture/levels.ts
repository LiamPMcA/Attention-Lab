export type CaptureLevel = {
  staticRed: number;
  flashingRed: number;
  moving: number;
  fakeTargets: number;
};

export function getCaptureLevel(trialIndex: number): CaptureLevel {
  if (trialIndex === 0) {
    return { staticRed: 0, flashingRed: 0, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex === 1) {
    return { staticRed: 1, flashingRed: 0, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex === 2) {
    return { staticRed: 2, flashingRed: 0, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex === 3) {
    return { staticRed: 1, flashingRed: 1, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex === 4) {
    return { staticRed: 1, flashingRed: 2, moving: 0, fakeTargets: 0 };
  }
  if (trialIndex === 5) {
    return { staticRed: 1, flashingRed: 1, moving: 1, fakeTargets: 0 };
  }
  if (trialIndex === 6) {
    return { staticRed: 1, flashingRed: 2, moving: 2, fakeTargets: 0 };
  }
  if (trialIndex === 7) {
    return { staticRed: 1, flashingRed: 2, moving: 2, fakeTargets: 1 };
  }
  if (trialIndex === 8) {
    return { staticRed: 2, flashingRed: 2, moving: 2, fakeTargets: 1 };
  }
  if (trialIndex === 9) {
    return { staticRed: 1, flashingRed: 2, moving: 3, fakeTargets: 2 };
  }
  return { staticRed: 2, flashingRed: 3, moving: 3, fakeTargets: 2 };
}

export const CAPTURE_TRIAL_COUNT = 15;
