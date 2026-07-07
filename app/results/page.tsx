import Link from "next/link";
import PillLabel from "@/components/PillLabel";
import ResultsProfile from "@/components/ResultsProfile";

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <PillLabel>Your progress</PillLabel>
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-warm-dark sm:text-4xl">
          Attention Profile
        </h1>
        <p className="mx-auto max-w-2xl text-warm-muted">
          Your scores appear here after you complete games. Compare your own
          trend over time — not other people.
        </p>
      </div>

      <ResultsProfile />

      <Link
        href="/lab"
        className="mt-8 inline-block text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← Back to lab
      </Link>
    </div>
  );
}
