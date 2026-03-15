import { getRouteBadgeTheme, RouteTone } from "@/lib/navigation";

interface RouteBadgeProps {
  tone: RouteTone;
  label: string;
  compact?: boolean;
}

export default function RouteBadge({ tone, label, compact = false }: RouteBadgeProps) {
  const theme = getRouteBadgeTheme(tone);

  return (
    <span
      className={`route-badge route-badge--${tone} ${compact ? "route-badge--compact" : ""}`}
      data-tincture={theme.tincture}
      aria-hidden="true"
      title={label}
    >
      <span className="route-badge__crest">
        <span className="route-badge__field" />
        <span className="route-badge__glyph-frame">
          <svg viewBox="0 0 24 24" className="route-badge__glyph" focusable="false" preserveAspectRatio="xMidYMid meet">
            <path d={theme.glyph} />
          </svg>
        </span>
      </span>
    </span>
  );
}
