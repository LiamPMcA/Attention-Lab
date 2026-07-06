"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDistraction, type Distraction } from "@/lib/recover/distractions";
import {
  getProbeType,
  RECOVER_PROBE_COUNT,
} from "@/lib/recover/schedule";
import { now, randomDelay, reactionTime } from "@/lib/timing";
import type {
  RecoverPhase,
  RecoverProbeType,
  RecoverTrialOutcome,
} from "@/lib/types";

type RecoverSessionState = {
  phase: RecoverPhase;
  probeIndex: number;
  probeType: RecoverProbeType;
  outcomes: RecoverTrialOutcome[];
  lastOutcome: RecoverTrialOutcome | null;
  distraction: Distraction | null;
  distractionFalseTap: boolean;
};

const FEEDBACK_MS = 900;
const STIMULUS_TIMEOUT_MS = 2500;

export function useRecoverSession() {
  const [state, setState] = useState<RecoverSessionState>({
    phase: "idle",
    probeIndex: 0,
    probeType: "baseline",
    outcomes: [],
    lastOutcome: null,
    distraction: null,
    distractionFalseTap: false,
  });

  const stimulusAt = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomesRef = useRef<RecoverTrialOutcome[]>([]);
  const resolvedRef = useRef(false);
  const distractionFalseTapRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleFeedbackAdvance = useCallback(
    (completedOutcomes: RecoverTrialOutcome[]) => {
      timeoutRef.current = setTimeout(() => {
        resolvedRef.current = false;
        if (completedOutcomes.length >= RECOVER_PROBE_COUNT) {
          setState((current) => ({
            ...current,
            phase: "complete",
            probeIndex: completedOutcomes.length,
            distraction: null,
          }));
          return;
        }
        beginProbeRef.current(completedOutcomes.length);
      }, FEEDBACK_MS);
    },
    [],
  );

  const recordOutcome = useCallback(
    (outcome: RecoverTrialOutcome) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      clearTimer();

      const completedOutcomes = [...outcomesRef.current, outcome];
      outcomesRef.current = completedOutcomes;

      setState((current) => ({
        ...current,
        phase: "feedback",
        outcomes: completedOutcomes,
        lastOutcome: outcome,
        distraction: null,
      }));

      scheduleFeedbackAdvance(completedOutcomes);
    },
    [clearTimer, scheduleFeedbackAdvance],
  );

  const beginStimulusRef = useRef<(probeIndex: number, probeType: RecoverProbeType) => void>(
    () => {},
  );

  const beginStimulus = useCallback(
    (probeIndex: number, probeType: RecoverProbeType) => {
      stimulusAt.current = now();
      resolvedRef.current = false;

      setState((current) => ({
        ...current,
        phase: "stimulus",
        probeIndex,
        probeType,
        distraction: null,
      }));

      clearTimer();
      timeoutRef.current = setTimeout(() => {
        if (resolvedRef.current) return;
        recordOutcome({
          reactionTime: 0,
          accuracy: 0,
          timestamp: Date.now(),
          miss: true,
          probeType,
          distractionFalseTap: distractionFalseTapRef.current,
        });
      }, STIMULUS_TIMEOUT_MS);
    },
    [clearTimer, recordOutcome],
  );

  beginStimulusRef.current = beginStimulus;

  const beginDistraction = useCallback(
    (probeIndex: number, probeType: RecoverProbeType) => {
      const distraction = getDistraction(probeIndex);
      distractionFalseTapRef.current = false;

      setState((current) => ({
        ...current,
        phase: "distraction",
        probeIndex,
        probeType,
        distraction,
        distractionFalseTap: false,
      }));

      clearTimer();
      timeoutRef.current = setTimeout(() => {
        setState((current) => ({
          ...current,
          phase: "pause",
        }));

        timeoutRef.current = setTimeout(() => {
          beginStimulusRef.current(probeIndex, probeType);
        }, distraction.pauseMs);
      }, distraction.durationMs);
    },
    [clearTimer],
  );

  const beginProbeRef = useRef<(probeIndex: number) => void>(() => {});

  const beginProbe = useCallback(
    (probeIndex: number) => {
      clearTimer();
      resolvedRef.current = false;
      distractionFalseTapRef.current = false;
      stimulusAt.current = null;

      const probeType = getProbeType(probeIndex);

      setState((current) => ({
        ...current,
        phase: "ready",
        probeIndex,
        probeType,
        lastOutcome: null,
        distraction: null,
        distractionFalseTap: false,
      }));

      const delay = randomDelay(500, 1200);
      timeoutRef.current = setTimeout(() => {
        if (probeType === "recovery") {
          beginDistraction(probeIndex, probeType);
          return;
        }
        beginStimulusRef.current(probeIndex, probeType);
      }, delay);
    },
    [beginDistraction, clearTimer],
  );

  beginProbeRef.current = beginProbe;

  const startSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    distractionFalseTapRef.current = false;
    beginProbe(0);
  }, [beginProbe, clearTimer]);

  const handleTap = useCallback(() => {
    if (state.phase === "distraction") {
      distractionFalseTapRef.current = true;
      setState((current) => ({ ...current, distractionFalseTap: true }));
      return;
    }

    if (state.phase === "ready" || state.phase === "pause") {
      recordOutcome({
        reactionTime: 0,
        accuracy: 0,
        timestamp: Date.now(),
        falseStart: true,
        probeType: state.probeType,
        distractionFalseTap: distractionFalseTapRef.current,
      });
      return;
    }

    if (state.phase === "stimulus" && stimulusAt.current !== null) {
      recordOutcome({
        reactionTime: reactionTime(stimulusAt.current, now()),
        accuracy: distractionFalseTapRef.current ? 0 : 1,
        timestamp: Date.now(),
        probeType: state.probeType,
        distractionFalseTap: distractionFalseTapRef.current,
      });
    }
  }, [recordOutcome, state.phase, state.probeType]);

  const resetSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    distractionFalseTapRef.current = false;
    setState({
      phase: "idle",
      probeIndex: 0,
      probeType: "baseline",
      outcomes: [],
      lastOutcome: null,
      distraction: null,
      distractionFalseTap: false,
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    totalProbes: RECOVER_PROBE_COUNT,
    startSession,
    handleTap,
    resetSession,
  };
}
