"use client";

import { useEffect, useState } from "react";
import { getLatestSession, getSessionsByGame } from "@/lib/storage";
import type { SessionScore } from "@/lib/types";

function formatScore(session: SessionScore | null, suffix = "ms") {
  if (!session || session.reactionTime === 0) return "—";
  return `${session.reactionTime}${suffix}`;
}

function formatAccuracy(session: SessionScore | null) {
  if (!session) return "—";
  return `${Math.round(session.accuracy * 100)}%`;
}

export default function ResultsProfile() {
  const [calibration, setCalibration] = useState<SessionScore | null>(null);
  const [history, setHistory] = useState<SessionScore[]>([]);

  useEffect(() => {
    setCalibration(getLatestSession("calibration"));
    setHistory(getSessionsByGame("calibration"));
  }, []);

  return (
    <>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Calibration</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {formatScore(calibration)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Avg reaction time</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Attention Capture</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">—</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Switching</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">—</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Recovery</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">—</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent calibration runs</h2>
        {history.length === 0 ? (
          <p className="text-sm text-zinc-600">
            No sessions yet. Run the calibration game to save your first score.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.slice(0, 7).map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-none last:pb-0"
              >
                <span className="text-zinc-600">
                  {new Date(session.timestamp).toLocaleString()}
                </span>
                <span className="font-medium text-zinc-900">
                  {session.reactionTime}ms · {formatAccuracy(session)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
