"use client";

import { useEffect, useState } from "react";
import { captureScore } from "@/lib/capture/score";
import { recoverScore } from "@/lib/recover/score";
import { switchScore } from "@/lib/switch/score";
import { getLatestSession, getSessionsByGame } from "@/lib/storage";
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

  useEffect(() => {
    setCapture(getLatestSession("capture"));
    setRecover(getLatestSession("recover"));
    setSwitchSession(getLatestSession("switch"));
    setCaptureHistory(getSessionsByGame("capture"));
    setRecoverHistory(getSessionsByGame("recover"));
    setSwitchHistory(getSessionsByGame("switch"));
  }, []);

  return (
    <>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Attention Capture</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {formatCaptureScore(capture)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {formatAccuracy(capture)} accuracy · {formatReactionTime(capture)} avg
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Recovery</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {formatRecoverScore(recover)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {recover?.reactionTime ?? "—"} cost · {formatAccuracy(recover)} accuracy
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Switching</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {formatSwitchScore(switchSession)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {switchSession?.reactionTime ?? "—"} cost · {formatAccuracy(switchSession)}{" "}
            accuracy
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent capture runs</h2>
          {captureHistory.length === 0 ? (
            <p className="text-sm text-zinc-600">No capture sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {captureHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-zinc-600">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-zinc-900">
                    {formatCaptureScore(session)} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent recover runs</h2>
          {recoverHistory.length === 0 ? (
            <p className="text-sm text-zinc-600">No recover sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recoverHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-zinc-600">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-zinc-900">
                    {formatRecoverScore(session)} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent switch runs</h2>
          {switchHistory.length === 0 ? (
            <p className="text-sm text-zinc-600">No switch sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {switchHistory.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-none last:pb-0"
                >
                  <span className="text-zinc-600">
                    {new Date(session.timestamp).toLocaleString()}
                  </span>
                  <span className="font-medium text-zinc-900">
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
