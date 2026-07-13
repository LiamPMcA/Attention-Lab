import { captureScore } from "@/lib/capture/score";
import { getDifficultyLabel } from "@/lib/difficulty";
import { recoverScore } from "@/lib/recover/score";
import { switchScore } from "@/lib/switch/score";
import type { SessionScore } from "@/lib/types";

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div>
      <dt className="text-warm-muted">{label}</dt>
      <dd className="text-xl font-bold text-warm-dark">{value}</dd>
    </div>
  );
}

function formatAccuracy(session: SessionScore) {
  return `${Math.round(session.accuracy * 100)}%`;
}

function CaptureRunDetail({ session }: { session: SessionScore }) {
  const score = captureScore(session);

  return (
    <>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <Stat label="Difficulty" value={getDifficultyLabel(session.difficulty)} />
        <Stat label="Capture score" value={score !== null ? String(score) : "—"} />
        <Stat
          label="Avg reaction time"
          value={
            session.reactionTime > 0 ? `${session.reactionTime}ms` : "—"
          }
        />
        <Stat label="Accuracy" value={formatAccuracy(session)} />
        <Stat label="Trials" value={String(session.trials)} />
      </dl>
    </>
  );
}

function RecoverRunDetail({ session }: { session: SessionScore }) {
  const score = recoverScore(session);

  return (
    <>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <Stat label="Difficulty" value={getDifficultyLabel(session.difficulty)} />
        <Stat label="Recovery cost" value={`${session.reactionTime}ms`} />
        <Stat
          label="Baseline RT"
          value={session.baselineRt ? `${session.baselineRt}ms` : "—"}
        />
        <Stat
          label="Recovery RT"
          value={session.recoveryRt ? `${session.recoveryRt}ms` : "—"}
        />
        <Stat label="Recover score" value={score !== null ? String(score) : "—"} />
        <Stat label="Accuracy" value={formatAccuracy(session)} />
        <Stat label="Trials" value={String(session.trials)} />
      </dl>
      <p className="mt-3 text-xs leading-5 text-warm-muted">
        Recovery cost is how much slower you were after distractions compared to
        baseline. Lower is better.
      </p>
    </>
  );
}

function SwitchRunDetail({ session }: { session: SessionScore }) {
  const score = switchScore(session);

  return (
    <>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <Stat label="Difficulty" value={getDifficultyLabel(session.difficulty)} />
        <Stat label="Switch cost" value={`${session.reactionTime}ms`} />
        <Stat
          label="Repeat RT"
          value={session.repeatRt ? `${session.repeatRt}ms` : "—"}
        />
        <Stat
          label="Switch RT"
          value={session.switchRt ? `${session.switchRt}ms` : "—"}
        />
        <Stat label="Switch score" value={score !== null ? String(score) : "—"} />
        <Stat label="Accuracy" value={formatAccuracy(session)} />
        <Stat label="Trials" value={String(session.trials)} />
      </dl>
      <p className="mt-3 text-xs leading-5 text-warm-muted">
        Switch cost is how much slower you were right after the rule changed.
        Lower is better.
      </p>
    </>
  );
}

export default function SessionRunDetail({ session }: { session: SessionScore }) {
  return (
    <div className="mt-3 rounded-xl border border-warm-pill/60 bg-cream-card/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-accent">
        Run summary
      </p>
      {session.gameId === "capture" && <CaptureRunDetail session={session} />}
      {session.gameId === "recover" && <RecoverRunDetail session={session} />}
      {session.gameId === "switch" && <SwitchRunDetail session={session} />}
    </div>
  );
}
