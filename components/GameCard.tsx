import Link from "next/link";

type GameCardProps = {
  title: string;
  description: string;
  href: string;
  metric: string;
};

export default function GameCard({ title, description, href, metric }: GameCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          Placeholder
        </span>
      </div>
      <p className="mb-4 flex-1 text-sm leading-6 text-zinc-600">{description}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
        Measures: {metric}
      </p>
      <span className="mt-4 text-sm font-medium text-teal-600 group-hover:text-teal-700">
        Open game →
      </span>
    </Link>
  );
}
