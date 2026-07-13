"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DifficultySlider from "@/components/DifficultySlider";
import SessionDifficultyBadge from "@/components/SessionDifficultyBadge";
import type { DifficultyLevel } from "@/lib/difficulty";
import { ruleLabel } from "@/lib/switch/schedule";
import { switchScore, summarizeSwitchSession } from "@/lib/switch/score";
import { saveSession } from "@/lib/storage";
import { useSwitchSession } from "@/lib/trial/useSwitchSession";

function feedbackMessage(
  lastOutcome: ReturnType<typeof useSwitchSession>["lastOutcome"],
): string {
  if (!lastOutcome) return "";
  if (lastOutcome.miss) return "Too slow — missed trial";
  if (!lastOutcome.correct) return "Wrong — check the current rule";
  if (lastOutcome.isSwitchTrial) {
    return `Switch trial — ${lastOutcome.reactionTime}ms`;
  }
  return `Correct — ${lastOutcome.reactionTime}ms`;
}

export default function SwitchGame() {
  const savedRef = useRef(false);
  const sessionDifficultyRef = useRef<DifficultyLevel>(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const {
    phase,
    trialIndex,
    totalTrials,
    rule,
    isSwitchTrial,
    stimulus,
    outcomes,
    lastOutcome,
    startSession,
    handleResponse,
    resetSession,
  } = useSwitchSession();

  useEffect(() => {
    if (phase !== "complete" || savedRef.current) return;
    saveSession(
      summarizeSwitchSession(outcomes, sessionDifficultyRef.current),
    );
    savedRef.current = true;
  }, [phase, outcomes]);

  const sessionSummary =
    phase === "complete"
      ? summarizeSwitchSession(outcomes, sessionDifficultyRef.current)
      : null;
  const score = sessionSummary ? switchScore(sessionSummary) : null;

  const handleStart = () => {
    sessionDifficultyRef.current = difficulty;
    startSession(difficulty);
  };

  const handleRestart = () => {
    savedRef.current = false;
    resetSession();
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
        Switch
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Match the rule</h1>
      <p className="mb-8 text-zinc-600">
        The rule changes between odd numbers and vowels. Tap{" "}
        <strong>Match</strong> if the letter or number fits the rule, or{" "}
        <strong>Skip</strong> if it doesn&apos;t.
      </p>

      {phase === "idle" && (
        <>
          <DifficultySlider value={difficulty} onChange={setDifficulty} />
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Start switch
            </button>
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Back home
          </Link>
        </div>
        </>
      )}

      {phase !== "idle" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Trial {Math.min(trialIndex + 1, totalTrials)} of {totalTrials}
            </span>
            {isSwitchTrial && phase !== "complete" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Rule switch
              </span>
            )}
          </div>

          <div
            className={`rounded-xl border p-4 text-center transition-colors ${
              isSwitchTrial && (phase === "ready" || phase === "stimulus")
                ? "border-amber-300 bg-amber-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <p className="text-sm font-medium text-zinc-600">Current rule</p>
            <p className="text-lg font-semibold text-zinc-900">{ruleLabel(rule)}</p>
          </div>

          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white">
            {phase === "ready" && (
              <p className="text-zinc-500">Get ready…</p>
            )}
            {phase === "stimulus" && stimulus && (
              <span className="text-7xl font-bold tracking-tight text-zinc-900">
                {stimulus.value}
              </span>
            )}
            {phase === "feedback" && (
              <p className="text-lg font-medium text-zinc-800">
                {feedbackMessage(lastOutcome)}
              </p>
            )}
            {phase === "complete" && (
              <p className="text-lg font-medium text-zinc-800">Session complete</p>
            )}
          </div>

          {phase === "stimulus" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleResponse(true)}
                className="rounded-xl bg-accent py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Match
              </button>
              <button
                type="button"
                onClick={() => handleResponse(false)}
                className="rounded-xl border-2 border-zinc-300 bg-white py-4 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                Skip
              </button>
            </div>
          )}
        </div>
      )}

      {sessionSummary && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold">Switch session saved</h2>
          <SessionDifficultyBadge difficulty={sessionSummary.difficulty} />
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-zinc-600">Switch cost</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.reactionTime}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Repeat RT</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.repeatRt}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Switch RT</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {sessionSummary.switchRt}ms
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Switch score</dt>
              <dd className="text-2xl font-bold text-zinc-900">{score ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-zinc-600">
            Switch cost is how much slower you were right after the rule changed.
            Lower is better.
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

      {phase !== "idle" && (
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Back home
        </Link>
      )}
      </div>
    </div>
  );
}
