import Link from "next/link";
import GameCard from "@/components/GameCard";

const games = [
  {
    title: "Calibration",
    description:
      "Tap when the circle turns green. Proves timing works on your device.",
    href: "/lab/calibrate",
    metric: "Device reaction time",
    badge: "Live",
  },
  {
    title: "Capture",
    description:
      "See what grabs your attention when distractors compete with your target.",
    href: "/lab/capture",
    metric: "Attention Capture Score",
  },
  {
    title: "Switch",
    description:
      "Practice moving attention from one rule to another as quickly as you can.",
    href: "/lab/switch",
    metric: "Switching Score",
  },
  {
    title: "Recover",
    description:
      "Measure how quickly attention returns after an unexpected distraction.",
    href: "/lab/recover",
    metric: "Recovery Score",
  },
];

export default function LabPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Today&apos;s lab</h1>
        <p className="text-zinc-600">
          Start with calibration, then try the game placeholders. Recover will be
          the first full game we build next.
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2">
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
