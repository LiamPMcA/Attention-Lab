"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { now, randomDelay, reactionTime } from "@/lib/timing";
import type { TrialOutcome, TrialPhase } from "@/lib/types";

type TrialLoopConfig = {
  totalTrials: number;
  readyMinMs: number;
  readyMaxMs: number;
  feedbackMs: number;
};

type TrialLoopState = {
  phase: TrialPhase;
  trialIndex: number;
  outcomes: TrialOutcome[];
  lastOutcome: TrialOutcome | null;
};

export function useTrialLoop(config: TrialLoopConfig) {
  const [state, setState] = useState<TrialLoopState>({
    phase: "idle",
    trialIndex: 0,
    outcomes: [],
    lastOutcome: null,
  });

  const stimulusAt = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomesRef = useRef<TrialOutcome[]>([]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const beginReadyPhase = useCallback(() => {
    clearTimer();
    stimulusAt.current = null;
    setState((current) => ({ ...current, phase: "ready", lastOutcome: null }));

    const delay = randomDelay(config.readyMinMs, config.readyMaxMs);
    timeoutRef.current = setTimeout(() => {
      stimulusAt.current = now();
      setState((current) => ({ ...current, phase: "stimulus" }));
    }, delay);
  }, [clearTimer, config.readyMaxMs, config.readyMinMs]);

  const finishFeedback = useCallback(
    (completedOutcomes: TrialOutcome[]) => {
      if (completedOutcomes.length >= config.totalTrials) {
        setState((current) => ({
          ...current,
          phase: "complete",
          trialIndex: completedOutcomes.length,
        }));
        return;
      }

      setState((current) => ({
        ...current,
        trialIndex: completedOutcomes.length,
      }));
      beginReadyPhase();
    },
    [beginReadyPhase, config.totalTrials],
  );

  const recordOutcome = useCallback(
    (outcome: TrialOutcome) => {
      const completedOutcomes = [...outcomesRef.current, outcome];
      outcomesRef.current = completedOutcomes;

      setState((current) => ({
        ...current,
        phase: "feedback",
        outcomes: completedOutcomes,
        lastOutcome: outcome,
      }));

      clearTimer();
      timeoutRef.current = setTimeout(() => {
        finishFeedback(completedOutcomes);
      }, config.feedbackMs);
    },
    [clearTimer, config.feedbackMs, finishFeedback],
  );

  const startSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    setState({
      phase: "ready",
      trialIndex: 0,
      outcomes: [],
      lastOutcome: null,
    });
    beginReadyPhase();
  }, [beginReadyPhase, clearTimer]);

  const handleTap = useCallback(() => {
    if (state.phase === "ready") {
      recordOutcome({
        reactionTime: 0,
        accuracy: 0,
        timestamp: Date.now(),
        falseStart: true,
      });
      return;
    }

    if (state.phase === "stimulus" && stimulusAt.current !== null) {
      recordOutcome({
        reactionTime: reactionTime(stimulusAt.current, now()),
        accuracy: 1,
        timestamp: Date.now(),
      });
    }
  }, [recordOutcome, state.phase]);

  const resetSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    setState({
      phase: "idle",
      trialIndex: 0,
      outcomes: [],
      lastOutcome: null,
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    startSession,
    handleTap,
    resetSession,
  };
}
