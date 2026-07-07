"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { recoverScore, summarizeRecoverSession } from "@/lib/recover/score";
import { saveSession } from "@/lib/storage";
import { useRecoverSession } from "@/lib/trial/useRecoverSession";
import type { RecoverTrialOutcome } from "@/lib/types";

function centerColor(phase: string, lastOutcome: RecoverTrialOutcome | null): string {
  if (phase === "ready" || phase === "pause") return "bg-zinc-300";
  if (phase === "stimulus") return "bg-green-500";
  if (phase === "feedback" && lastOutcome?.falseStart) return "bg-red-300";
  if (phase === "feedback") return "bg-green-400";
  return "bg-zinc-200";
}

function phaseMessage(
  phase: string,
  lastOutcome: RecoverTrialOutcome | null,
): string {
  if (phase === "ready" || phase === "pause") return "Wait for green…";
  if (phase === "stimulus") return "Tap now!";
  if (phase === "feedback" && lastOutcome?.falseStart) {
    return "Too early — wait for green";
  }
  if (phase === "feedback" && lastOutcome?.miss) return "Too slow — missed green";
  if (phase === "feedback" && lastOutcome && lastOutcome.reactionTime > 0) {
    return `Reaction time: ${lastOutcome.reactionTime}ms`;
  }
  if (phase === "complete") return "Session complete";
  return "";
}

function DistractionOverlay({
  kind,
  label,
}: {
  kind: "flash" | "text" | "burst";
  label?: string;
}) {
  if (kind === "flash") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-red-500/95">
        <span className="text-4xl font-bold text-white">!</span>
      </div>
    );
  }

  if (kind === "text") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-amber-400/95">
        <span className="px-4 text-center text-3xl font-bold text-zinc-900">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-fuchsia-600/95">
      <span className="absolute left-[12%] top-[18%] h-12 w-12 rounded-full bg-yellow-300" />
      <span className="absolute right-[18%] top-[28%] h-10 w-10 rotate-45 bg-white" />
      <span className="absolute bottom-[22%] left-[32%] h-14 w-14 rounded-sm bg-orange-400" />
      <span className="absolute bottom-[30%] right-[28%] h-8 w-16 rounded-full bg-lime-300" />
      <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
        {label}
      </span>
    </div>
  );
}

export default function RecoverGame() {
  const savedRef = useRef(false);
  const {
    phase,
    probeIndex,
    totalProbes,
    outcomes,
    lastOutcome,
    distraction,
    startSession,
    handleTap,
    resetSession,
  } = useRecoverSession();

  useEffect(() => {
    if (phase !== "complete" || savedRef.current) return;
    saveSession(summarizeRecoverSession(outcomes));
    savedRef.current = true;
  }, [phase, outcomes]);

  const sessionSummary =
    phase === "complete" ? summarizeRecoverSession(outcomes) : null;
  const score = sessionSummary ? recoverScore(sessionSummary) : null;

  const handleRestart = () => {
    savedRef.current = false;
    resetSession();
  };

  const message = phaseMessage(phase, lastOutcome);
  const showCenter =
    phase === "ready" || phase === "pause" || phase === "stimulus" || phase === "feedback";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
        Recover
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Tap when green</h1>
      <p className="mb-8 text-zinc-600">
        Wait for the center circle to turn green and tap fast. Distractions can
        appear at any time — stay on task and recover on the next green flash.
      </p>

      {phase === "idle" && (
        <button
          type="button"
          onClick={startSession}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Start recover
        </button>
      )}

      {phase !== "idle" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Probe {Math.min(probeIndex + 1, totalProbes)} of {totalProbes}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTap}
            disabled={phase === "feedback" || phase === "complete"}
            className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white transition-colors disabled:cursor-default"
            style={{ touchAction: "manipulation" }}
          >
            {distraction && phase === "distraction" && (
              <DistractionOverlay
                kind={distraction.kind}
                label={distraction.label}
              />
            )}

            {showCenter && (
              <>
                <span
                  className={`relative z-10 mb-4 h-28 w-28 rounded-full transition-colors ${centerColor(phase, lastOutcome)}`}
                />
                {message && (
                  <span className="relative z-10 text-lg font-medium text-zinc-800">
                    {message}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      )}

      {sessionSummary && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recover session saved</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-zinc-600">Recovery cost</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.reactionTime}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Baseline RT</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.baselineRt}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Recovery RT</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.recoveryRt}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Recover score</dt>
              <dd className="text-2xl font-bold text-zinc-900">{score ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-zinc-600">
            Recovery cost is how much slower you were after distractions compared
            to baseline. Lower is better.
          </p>
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
