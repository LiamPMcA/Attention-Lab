"use client";

import { useState } from "react";
import SessionRunDetail from "@/components/SessionRunDetail";
import { getDifficultyLabel } from "@/lib/difficulty";
import type { SessionScore } from "@/lib/types";

type SessionHistoryListProps = {
  title: string;
  sessions: SessionScore[];
  formatScore: (session: SessionScore) => string;
  emptyMessage: string;
};

export default function SessionHistoryList({
  title,
  sessions,
  formatScore,
  emptyMessage,
}: SessionHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="soft-card p-6">
      <h2 className="mb-1 text-lg font-semibold text-warm-dark">{title}</h2>
      <p className="mb-4 text-xs text-warm-muted">Tap a run to see the full summary.</p>

      {sessions.length === 0 ? (
        <p className="text-sm text-warm-muted">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {sessions.slice(0, 5).map((session) => {
            const isExpanded = expandedId === session.id;

            return (
              <li
                key={session.id}
                className="border-b border-warm-pill/50 pb-3 last:border-none last:pb-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : session.id)
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-3 text-left text-sm transition-colors hover:text-warm-dark"
                >
                  <span className="min-w-0 text-warm-muted">
                    <span className="block truncate">
                      {new Date(session.timestamp).toLocaleString()}
                    </span>
                    <span className="text-xs text-warm-tan">
                      {getDifficultyLabel(session.difficulty)}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-medium text-warm-dark">
                    {formatScore(session)} pts
                    <span
                      className={`text-xs text-warm-tan transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </span>
                </button>

                {isExpanded && <SessionRunDetail session={session} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
