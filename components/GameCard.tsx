import Link from "next/link";

type GameCardProps = {
  title: string;
  description: string;
  href: string;
  metric: string;
  badge?: string | null;
};

export default function GameCard({
  title,
  description,
  href,
  metric,
  badge = "Placeholder",
}: GameCardProps) {
  return (
    <Link
      href={href}
      className="soft-card soft-card-hover group flex flex-col p-6 transition-shadow"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-warm-dark">{title}</h2>
        {badge && (
          <span className="rounded-full bg-warm-pill px-3 py-1 text-xs font-medium text-warm-muted">
            {badge}
          </span>
        )}
      </div>
      <p className="mb-4 flex-1 text-sm leading-6 text-warm-muted">{description}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-accent">
        Measures: {metric}
      </p>
      <span className="mt-4 text-sm font-medium text-accent group-hover:text-accent-hover">
        Open game →
      </span>
    </Link>
  );
}
