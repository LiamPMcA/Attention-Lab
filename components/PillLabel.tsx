type PillLabelProps = {
  children: React.ReactNode;
};

export default function PillLabel({ children }: PillLabelProps) {
  return (
    <span className="inline-flex rounded-full bg-warm-pill px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-warm-muted">
      {children}
    </span>
  );
}
