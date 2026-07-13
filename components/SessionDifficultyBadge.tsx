import { getDifficultyLabel } from "@/lib/difficulty";

export default function SessionDifficultyBadge({
  difficulty,
}: {
  difficulty?: number;
}) {
  return (
    <p className="mb-4 text-sm text-zinc-600">
      Played on{" "}
      <span className="font-semibold text-zinc-900">
        {getDifficultyLabel(difficulty)}
      </span>
    </p>
  );
}
