"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CAPTURE_TRIAL_COUNT } from "@/lib/capture/levels";
import { spawnCaptureTrial } from "@/lib/capture/spawnTrial";
import {
  getDifficultySettings,
  type DifficultyLevel,
  type DifficultySettings,
} from "@/lib/difficulty";
import { now, randomDelay, reactionTime } from "@/lib/timing";
import type { ArenaShape, CaptureTrialOutcome, TrialPhase } from "@/lib/types";

type CaptureSessionConfig = {
  totalTrials?: number;
  readyMinMs?: number;
  readyMaxMs?: number;
  stimulusTimeoutMs?: number;
  feedbackMs?: number;
};

type CaptureSessionState = {
  phase: TrialPhase;
  trialIndex: number;
  outcomes: CaptureTrialOutcome[];
  lastOutcome: CaptureTrialOutcome | null;
  shapes: ArenaShape[];
};

export function useCaptureSession(config: CaptureSessionConfig = {}) {
  const totalTrials = config.totalTrials ?? CAPTURE_TRIAL_COUNT;
  const feedbackMs = config.feedbackMs ?? 900;

  const [state, setState] = useState<CaptureSessionState>({
    phase: "idle",
    trialIndex: 0,
    outcomes: [],
    lastOutcome: null,
    shapes: [],
  });

  const stimulusAt = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomesRef = useRef<CaptureTrialOutcome[]>([]);
  const resolvedRef = useRef(false);
  const difficultyRef = useRef<DifficultySettings>(getDifficultySettings(3));

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const beginReadyPhase = useCallback(
    (trialIndex: number) => {
      clearTimer();
      resolvedRef.current = false;
      stimulusAt.current = null;

      setState((current) => ({
        ...current,
        phase: "ready",
        trialIndex,
        lastOutcome: null,
        shapes: [],
      }));

      const delay = randomDelay(
        difficultyRef.current.captureReadyMinMs,
        difficultyRef.current.captureReadyMaxMs,
      );
      timeoutRef.current = setTimeout(() => {
        const shapes = spawnCaptureTrial(trialIndex, difficultyRef.current);
        stimulusAt.current = now();
        resolvedRef.current = false;

        setState((current) => ({
          ...current,
          phase: "stimulus",
          shapes,
        }));

        timeoutRef.current = setTimeout(() => {
          if (resolvedRef.current) return;
          resolvedRef.current = true;

          const outcome: CaptureTrialOutcome = {
            reactionTime: 0,
            accuracy: 0,
            timestamp: Date.now(),
            miss: true,
            hitTarget: false,
          };

          const completedOutcomes = [...outcomesRef.current, outcome];
          outcomesRef.current = completedOutcomes;

          setState((current) => ({
            ...current,
            phase: "feedback",
            outcomes: completedOutcomes,
            lastOutcome: outcome,
            shapes: [],
          }));

          clearTimer();
          timeoutRef.current = setTimeout(() => {
            if (completedOutcomes.length >= totalTrials) {
              setState((current) => ({
                ...current,
                phase: "complete",
                trialIndex: completedOutcomes.length,
              }));
              return;
            }
            beginReadyPhase(completedOutcomes.length);
          }, feedbackMs);
        }, difficultyRef.current.captureStimulusTimeoutMs);
      }, delay);
    },
    [clearTimer, feedbackMs, totalTrials],
  );

  const finishTrial = useCallback(
    (outcome: CaptureTrialOutcome) => {
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
        shapes: [],
      }));

      timeoutRef.current = setTimeout(() => {
        if (completedOutcomes.length >= totalTrials) {
          setState((current) => ({
            ...current,
            phase: "complete",
            trialIndex: completedOutcomes.length,
          }));
          return;
        }
        beginReadyPhase(completedOutcomes.length);
      }, feedbackMs);
    },
    [beginReadyPhase, clearTimer, feedbackMs, totalTrials],
  );

  const handleShapeTap = useCallback(
    (shapeId: string) => {
      if (state.phase !== "stimulus" || stimulusAt.current === null) return;

      const shape = state.shapes.find((item) => item.id === shapeId);
      if (!shape) return;

      if (shape.isTarget) {
        finishTrial({
          reactionTime: reactionTime(stimulusAt.current, now()),
          accuracy: 1,
          timestamp: Date.now(),
          hitTarget: true,
          tappedShapeId: shapeId,
        });
        return;
      }

      finishTrial({
        reactionTime: 0,
        accuracy: 0,
        timestamp: Date.now(),
        hitTarget: false,
        distractorTap: true,
        tappedShapeId: shapeId,
      });
    },
    [finishTrial, state.phase, state.shapes],
  );

  const startSession = useCallback((level: DifficultyLevel = 3) => {
    difficultyRef.current = getDifficultySettings(level);
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    setState({
      phase: "ready",
      trialIndex: 0,
      outcomes: [],
      lastOutcome: null,
      shapes: [],
    });
    beginReadyPhase(0);
  }, [beginReadyPhase, clearTimer]);

  const resetSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    setState({
      phase: "idle",
      trialIndex: 0,
      outcomes: [],
      lastOutcome: null,
      shapes: [],
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    totalTrials,
    startSession,
    handleShapeTap,
    resetSession,
  };
}
