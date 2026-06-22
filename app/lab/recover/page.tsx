import Link from "next/link";
import PlaceholderBadge from "@/components/PlaceholderBadge";

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <PlaceholderBadge />
      <h1 className="mt-4 mb-2 text-3xl font-bold tracking-tight">Recover</h1>
      <p className="mb-8 text-zinc-600">
        Stay focused on a central task, survive a distraction, then see how fast
        you respond on the next valid target.
      </p>
      <div className="mb-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
        Game area — coming in the next build step
      </div>
      <Link href="/lab" className="text-sm font-medium text-teal-600 hover:text-teal-700">
        ← Back to lab
      </Link>
    </div>
  );
}
