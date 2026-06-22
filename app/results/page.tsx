import Link from "next/link";
import PlaceholderBadge from "@/components/PlaceholderBadge";

const scores = [
  { name: "Attention Capture", value: "—" },
  { name: "Switching", value: "—" },
  { name: "Recovery", value: "—" },
];

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <PlaceholderBadge />
        <h1 className="mt-4 mb-2 text-3xl font-bold tracking-tight">
          Attention Profile
        </h1>
        <p className="text-zinc-600">
          Your scores will appear here after you complete games. Compare your own
          trend over time — not other people.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {scores.map((score) => (
          <div
            key={score.name}
            className="rounded-xl border border-zinc-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-zinc-600">{score.name}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{score.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
        Session history and sparklines — coming soon
      </div>

      <Link
        href="/lab"
        className="mt-8 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        ← Back to lab
      </Link>
    </div>
  );
}
