import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <section className="mb-12">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-teal-700">
          Duolingo for attention
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Train your attention, one short session at a time.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600">
          Three quick games measure how attention gets captured, how fast it
          switches, and how quickly it recovers. Think fitness tracker — not
          diagnosis.
        </p>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          { name: "Capture", detail: "What grabs your attention" },
          { name: "Switch", detail: "How fast attention moves" },
          { name: "Recover", detail: "How fast you bounce back" },
        ].map((game) => (
          <div
            key={game.name}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <h2 className="font-semibold text-zinc-900">{game.name}</h2>
            <p className="mt-1 text-sm text-zinc-600">{game.detail}</p>
          </div>
        ))}
      </section>

      <Link
        href="/lab"
        className="inline-flex items-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
      >
        Start lab →
      </Link>
    </div>
  );
}
