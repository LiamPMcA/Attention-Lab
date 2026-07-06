import Link from "next/link";
import GameCard from "@/components/GameCard";

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
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Today&apos;s lab</h1>
        <p className="text-zinc-600">
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
        className="text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        View attention profile →
      </Link>
    </div>
  );
}
