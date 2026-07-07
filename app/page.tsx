import Link from "next/link";
import PillLabel from "@/components/PillLabel";

export default function Home() {
  return (
    <div>
      <section className="px-6 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <PillLabel>Attention fitness</PillLabel>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-warm-dark sm:text-6xl">
            Train your attention, one short session at a time.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-warm-muted sm:text-xl">
            Three quick games measure how attention gets captured, how fast it
            switches, and how quickly it recovers. Think fitness tracker — not
            diagnosis.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          {[
            { name: "Capture", detail: "What grabs your attention" },
            { name: "Switch", detail: "How fast attention moves" },
            { name: "Recover", detail: "How fast you bounce back" },
          ].map((game) => (
            <div key={game.name} className="soft-card p-6">
              <h2 className="text-lg font-semibold text-warm-dark">{game.name}</h2>
              <p className="mt-2 text-sm leading-6 text-warm-muted">{game.detail}</p>
            </div>
          ))}
        </div>

        <Link
          href="/lab"
          className="inline-flex items-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Start lab →
        </Link>
      </section>
    </div>
  );
}
