"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { saveSession, summarizeSession } from "@/lib/storage";
import { useTrialLoop } from "@/lib/trial/useTrialLoop";

const TRIAL_COUNT = 5;

export default function CalibrationGame() {
  const savedRef = useRef(false);
  const {
    phase,
    trialIndex,
    outcomes,
    lastOutcome,
    startSession,
    handleTap,
    resetSession,
  } = useTrialLoop({
    totalTrials: TRIAL_COUNT,
    readyMinMs: 800,
    readyMaxMs: 2000,
    feedbackMs: 900,
  });

  useEffect(() => {
    if (phase !== "complete" || savedRef.current) return;

    saveSession(summarizeSession("calibration", outcomes));
    savedRef.current = true;
  }, [phase, outcomes]);

  const handleRestart = () => {
    savedRef.current = false;
    resetSession();
  };

  const sessionSummary =
    phase === "complete" ? summarizeSession("calibration", outcomes) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-teal-700">
        Step 2 — calibration
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Tap when green</h1>
      <p className="mb-8 text-zinc-600">
        Wait for the circle to turn green, then tap as fast as you can. This
        checks that timing works on your device before the real games.
      </p>

      {phase === "idle" && (
        <button
          type="button"
          onClick={startSession}
          className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Start calibration
        </button>
      )}

      {phase !== "idle" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Trial {Math.min(trialIndex + 1, TRIAL_COUNT)} of {TRIAL_COUNT}
            </span>
            <span className="capitalize">{phase}</span>
          </div>

          <button
            type="button"
            onClick={handleTap}
            disabled={phase === "feedback" || phase === "complete"}
            className="flex h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white transition-colors disabled:cursor-default"
          >
            <span
              className={`mb-4 h-28 w-28 rounded-full transition-colors ${
                phase === "ready"
                  ? "bg-red-400"
                  : phase === "stimulus"
                    ? "bg-green-500"
                    : phase === "feedback" && lastOutcome?.falseStart
                      ? "bg-red-300"
                      : phase === "feedback"
                        ? "bg-green-400"
                        : "bg-zinc-200"
              }`}
            />
            <span className="text-lg font-medium text-zinc-800">
              {phase === "ready" && "Wait for green…"}
              {phase === "stimulus" && "Tap now!"}
              {phase === "feedback" &&
                (lastOutcome?.falseStart
                  ? "Too early — wait for green"
                  : `Reaction time: ${lastOutcome?.reactionTime}ms`)}
              {phase === "complete" && "Session complete"}
            </span>
          </button>
        </div>
      )}

      {sessionSummary && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Calibration saved</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-600">Avg reaction time</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.reactionTime}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Accuracy</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {Math.round(sessionSummary.accuracy * 100)}%
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Trials</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.trials}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/results"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View attention profile →
            </Link>
            <button
              type="button"
              onClick={handleRestart}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Run again
            </button>
          </div>
        </div>
      )}

      <Link
        href="/lab"
        className="mt-8 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Back to lab
      </Link>
    </div>
  );
}
