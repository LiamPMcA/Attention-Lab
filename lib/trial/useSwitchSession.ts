"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateStimulus, type SwitchStimulus } from "@/lib/switch/stimuli";
import {
  getRuleForTrial,
  SWITCH_TRIAL_COUNT,
} from "@/lib/switch/schedule";
import {
  getDifficultySettings,
  type DifficultyLevel,
  type DifficultySettings,
} from "@/lib/difficulty";
import { now, randomDelay, reactionTime } from "@/lib/timing";
import type {
  SwitchRule,
  SwitchTrialOutcome,
  TrialPhase,
} from "@/lib/types";

type SwitchSessionState = {
  phase: TrialPhase;
  trialIndex: number;
  rule: SwitchRule;
  isSwitchTrial: boolean;
  stimulus: SwitchStimulus | null;
  outcomes: SwitchTrialOutcome[];
  lastOutcome: SwitchTrialOutcome | null;
};

const FEEDBACK_MS = 800;

export function useSwitchSession() {
  const [state, setState] = useState<SwitchSessionState>({
    phase: "idle",
    trialIndex: 0,
    rule: "odd",
    isSwitchTrial: false,
    stimulus: null,
    outcomes: [],
    lastOutcome: null,
  });

  const stimulusAt = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomesRef = useRef<SwitchTrialOutcome[]>([]);
  const resolvedRef = useRef(false);
  const beginTrialRef = useRef<(trialIndex: number) => void>(() => {});
  const difficultyRef = useRef<DifficultySettings>(getDifficultySettings(3));

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (completedOutcomes: SwitchTrialOutcome[]) => {
      timeoutRef.current = setTimeout(() => {
        resolvedRef.current = false;
        if (completedOutcomes.length >= SWITCH_TRIAL_COUNT) {
          setState((current) => ({
            ...current,
            phase: "complete",
            trialIndex: completedOutcomes.length,
            stimulus: null,
          }));
          return;
        }
        beginTrialRef.current(completedOutcomes.length);
      }, FEEDBACK_MS);
    },
    [],
  );

  const recordOutcome = useCallback(
    (outcome: SwitchTrialOutcome) => {
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
        stimulus: null,
      }));

      scheduleNext(completedOutcomes);
    },
    [clearTimer, scheduleNext],
  );

  const beginStimulus = useCallback(
    (trialIndex: number, rule: SwitchRule, isSwitchTrial: boolean) => {
      const stimulus = generateStimulus(rule);
      stimulusAt.current = now();
      resolvedRef.current = false;

      setState((current) => ({
        ...current,
        phase: "stimulus",
        trialIndex,
        rule,
        isSwitchTrial,
        stimulus,
        lastOutcome: null,
      }));

      clearTimer();
      timeoutRef.current = setTimeout(() => {
        if (resolvedRef.current) return;
        recordOutcome({
          reactionTime: 0,
          accuracy: 0,
          timestamp: Date.now(),
          miss: true,
          rule,
          isSwitchTrial,
          stimulus: stimulus.value,
          respondedMatch: false,
          correct: false,
        });
      }, difficultyRef.current.switchStimulusTimeoutMs);
    },
    [clearTimer, recordOutcome],
  );

  const beginTrial = useCallback(
    (trialIndex: number) => {
      clearTimer();
      resolvedRef.current = false;
      stimulusAt.current = null;

      const { rule, isSwitchTrial } = getRuleForTrial(
        trialIndex,
        difficultyRef.current.switchBlockSize,
      );

      setState((current) => ({
        ...current,
        phase: "ready",
        trialIndex,
        rule,
        isSwitchTrial,
        stimulus: null,
        lastOutcome: null,
      }));

      const delay = randomDelay(
        difficultyRef.current.switchReadyMinMs,
        difficultyRef.current.switchReadyMaxMs,
      );
      timeoutRef.current = setTimeout(() => {
        beginStimulus(trialIndex, rule, isSwitchTrial);
      }, delay);
    },
    [beginStimulus, clearTimer],
  );

  beginTrialRef.current = beginTrial;

  const startSession = useCallback((level: DifficultyLevel = 3) => {
    difficultyRef.current = getDifficultySettings(level);
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    beginTrial(0);
  }, [beginTrial, clearTimer]);

  const handleResponse = useCallback(
    (respondedMatch: boolean) => {
      if (state.phase !== "stimulus" || !state.stimulus || stimulusAt.current === null) {
        return;
      }

      const correct = respondedMatch === state.stimulus.matches;

      recordOutcome({
        reactionTime: reactionTime(stimulusAt.current, now()),
        accuracy: correct ? 1 : 0,
        timestamp: Date.now(),
        rule: state.rule,
        isSwitchTrial: state.isSwitchTrial,
        stimulus: state.stimulus.value,
        respondedMatch,
        correct,
      });
    },
    [recordOutcome, state],
  );

  const resetSession = useCallback(() => {
    clearTimer();
    outcomesRef.current = [];
    resolvedRef.current = false;
    setState({
      phase: "idle",
      trialIndex: 0,
      rule: "odd",
      isSwitchTrial: false,
      stimulus: null,
      outcomes: [],
      lastOutcome: null,
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    totalTrials: SWITCH_TRIAL_COUNT,
    startSession,
    handleResponse,
    resetSession,
  };
}
