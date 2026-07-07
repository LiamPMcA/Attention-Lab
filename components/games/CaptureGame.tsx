"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { captureScore, summarizeCaptureSession } from "@/lib/capture/score";
import { saveSession } from "@/lib/storage";
import { useCaptureSession } from "@/lib/trial/useCaptureSession";
import CaptureArena from "@/components/games/CaptureArena";

function feedbackMessage(
  lastOutcome: ReturnType<typeof useCaptureSession>["lastOutcome"],
): string {
  if (!lastOutcome) return "";
  if (lastOutcome.hitTarget) {
    return `Correct — ${lastOutcome.reactionTime}ms`;
  }
  if (lastOutcome.distractorTap) {
    return "Wrong — that was a distractor";
  }
  if (lastOutcome.miss) {
    return "Too slow — target missed";
  }
  return "";
}

export default function CaptureGame() {
  const savedRef = useRef(false);
  const {
    phase,
    trialIndex,
    totalTrials,
    outcomes,
    lastOutcome,
    shapes,
    startSession,
    handleShapeTap,
    resetSession,
  } = useCaptureSession();

  useEffect(() => {
    if (phase !== "complete" || savedRef.current) return;
    saveSession(summarizeCaptureSession(outcomes));
    savedRef.current = true;
  }, [phase, outcomes]);

  const sessionSummary =
    phase === "complete" ? summarizeCaptureSession(outcomes) : null;
  const score = sessionSummary ? captureScore(sessionSummary) : null;

  const handleRestart = () => {
    savedRef.current = false;
    resetSession();
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
        Capture
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Tap the blue target</h1>
      <p className="mb-8 text-zinc-600">
        Only the solid blue circle is the target. Ignore red shapes in all forms,
        erratic movers, and fake blue decoys.
      </p>

      {phase === "idle" && (
        <button
          type="button"
          onClick={startSession}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Start capture
        </button>
      )}

      {phase !== "idle" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Trial {Math.min(trialIndex + 1, totalTrials)} of {totalTrials}
            </span>
            <span className="capitalize">{phase}</span>
          </div>

          <CaptureArena
            shapes={shapes}
            phase={phase}
            disabled={phase !== "stimulus"}
            onShapeTap={handleShapeTap}
          />

          {phase === "feedback" && lastOutcome && (
            <p className="text-center text-sm font-medium text-zinc-800">
              {feedbackMessage(lastOutcome)}
            </p>
          )}

          {phase === "stimulus" && (
            <p className="text-center text-sm text-zinc-500">
              Tap the solid blue target
            </p>
          )}
        </div>
      )}

      {sessionSummary && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Capture session saved</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-zinc-600">Capture score</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {score ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Avg reaction time</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.reactionTime > 0
                  ? `${sessionSummary.reactionTime}ms`
                  : "—"}
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
              className="text-sm font-medium text-accent hover:text-accent-hover"
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
