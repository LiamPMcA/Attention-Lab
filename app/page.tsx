import Link from "next/link";
import GameCard from "@/components/GameCard";
import PillLabel from "@/components/PillLabel";

const games = [
  {
    title: "Capture",
    description:
      "Tap the blue target while red, moving, and fake distractors try to pull you off course.",
    href: "/lab/capture",
    metric: "Attention Capture Score",
    badge: "Live",
  },
  {
    title: "Recover",
    description:
      "Tap when green, survive full-screen distractions, and measure how fast you bounce back.",
    href: "/lab/recover",
    metric: "Recovery Score",
    badge: "Live",
  },
  {
    title: "Switch",
    description:
      "Alternate between odd numbers and vowels — Match or Skip as the rule changes.",
    href: "/lab/switch",
    metric: "Switching Score",
    badge: "Live",
  },
];

export default function Home() {
  return (
    <div>
      <section className="px-6 pb-12 pt-20 text-center">
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

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/results"
            className="text-sm font-medium text-accent hover:text-accent-hover"
          >
            View attention profile →
          </Link>
        </div>
      </section>
    </div>
  );
}
