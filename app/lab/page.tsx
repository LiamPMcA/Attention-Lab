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

export default function LabPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <PillLabel>Today&apos;s lab</PillLabel>
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-warm-dark sm:text-4xl">
          Pick a game and begin
        </h1>
        <p className="mx-auto max-w-2xl text-warm-muted">
          Three short games that measure capture, recovery, and switching. Start
          with whichever you like.
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.href} {...game} />
        ))}
      </div>

      <Link
        href="/results"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        View attention profile →
      </Link>
    </div>
  );
}
