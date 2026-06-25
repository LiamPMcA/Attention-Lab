import Link from "next/link";
import ResultsProfile from "@/components/ResultsProfile";

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Attention Profile
        </h1>
        <p className="text-zinc-600">
          Your scores appear here after you complete games. Compare your own
          trend over time — not other people.
        </p>
      </div>

      <ResultsProfile />

      <Link
        href="/lab"
        className="mt-8 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        ← Back to lab
      </Link>
    </div>
  );
}
