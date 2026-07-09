"use client";

import { useEffect, useState } from "react";
import { captureScore } from "@/lib/capture/score";
import { recoverScore } from "@/lib/recover/score";
import { switchScore } from "@/lib/switch/score";
import {
  isUsingCloudStorage,
  loadLatestSession,
  loadSessionsByGame,
} from "@/lib/storage";
import type { SessionScore } from "@/lib/types";

function formatReactionTime(session: SessionScore | null) {
  if (!session || session.reactionTime === 0) return "—";
  return `${session.reactionTime}ms`;
}

function formatAccuracy(session: SessionScore | null) {
  if (!session) return "—";
  return `${Math.round(session.accuracy * 100)}%`;
}

function formatCaptureScore(session: SessionScore | null) {
  if (!session) return "—";
  const score = captureScore(session);
  return score !== null ? String(score) : "—";
}

function formatRecoverScore(session: SessionScore | null) {
  if (!session) return "—";
  const score = recoverScore(session);
  return score !== null ? String(score) : "—";
}

function formatSwitchScore(session: SessionScore | null) {
  if (!session) return "—";
  const score = switchScore(session);
  return score !== null ? String(score) : "—";
}

export default function ResultsProfile() {
  const [capture, setCapture] = useState<SessionScore | null>(null);
  const [recover, setRecover] = useState<SessionScore | null>(null);
  const [switchSession, setSwitchSession] = useState<SessionScore | null>(null);
  const [captureHistory, setCaptureHistory] = useState<SessionScore[]>([]);
  const [recoverHistory, setRecoverHistory] = useState<SessionScore[]>([]);
  const [switchHistory, setSwitchHistory] = useState<SessionScore[]>([]);
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      const [
        captureSession,
        recoverSession,
        switchLatest,
        captureRuns,
        recoverRuns,
        switchRuns,
        usingCloud,
      ] = await Promise.all([
        loadLatestSession("capture"),
        loadLatestSession("recover"),
        loadLatestSession("switch"),
        loadSessionsByGame("capture"),
        loadSessionsByGame("recover"),
        loadSessionsByGame("switch"),
        isUsingCloudStorage(),
      ]);

      if (cancelled) return;

      setCapture(captureSession);
      setRecover(recoverSession);
      setSwitchSession(switchLatest);
      setCaptureHistory(captureRuns);
      setRecoverHistory(recoverRuns);
      setSwitchHistory(switchRuns);
      setSynced(usingCloud);
      setLoading(false);
    }

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-center text-sm text-warm-muted">Loading results…</p>;
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-warm-muted">
        {synced
          ? "Scores synced to your account."
          : "Scores saved on this device only. Log in to sync across devices."}
      </p>
      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        <div className="soft-card p-6 text-center">
          <p className="text-sm font-medium text-warm-muted">Attention Capture</p>
          <p className="mt-2 text-4xl font-bold text-accent">
            {formatCaptureScore(capture)}
          </p>
          <p className="mt-1 text-xs text-warm-tan">
            {formatAccuracy(capture)} accuracy · {formatReactionTime(capture)} avg
          </p>
        </div>
        <div className="soft-card p-6 text-center">
          <p className="text-sm font-medium text-warm-muted">Recovery</p>
          <p className="mt-2 text-4xl font-bold text-accent">
            {formatRecoverScore(recover)}
          </p>
          <p className="mt-1 text-xs text-warm-tan">
            {recover?.reactionTime ?? "—"} cost · {formatAccuracy(recover)} accuracy
          </p>
        </div>
        <div className="soft-card p-6 text-center">
          <p className="text-sm font-medium text-warm-muted">Switching</p>
          <p className="mt-2 text-4xl font-bold text-accent">
            {formatSwitchScore(switchSession)}
          </p>
          <p className="mt-1 text-xs text-warm-tan">
            {switchSession?.reactionTime ?? "—"} cost ·{" "}
            {formatAccuracy(switchSession)} accuracy
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="soft-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-warm-dark">
            Recent capture runs
          </h2>
          {captureHistory.length === 0 ? (
            <p className="text-sm text-warm-muted">No capture sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {captureHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-warm-pill/50 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-warm-muted">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-warm-dark">
                    {formatCaptureScore(session)} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="soft-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-warm-dark">
            Recent recover runs
          </h2>
          {recoverHistory.length === 0 ? (
            <p className="text-sm text-warm-muted">No recover sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recoverHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-warm-pill/50 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-warm-muted">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-warm-dark">
                    {formatRecoverScore(session)} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="soft-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-warm-dark">
            Recent switch runs
          </h2>
          {switchHistory.length === 0 ? (
            <p className="text-sm text-warm-muted">No switch sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {switchHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-warm-pill/50 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-warm-muted">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-warm-dark">
                    {formatSwitchScore(session)} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
