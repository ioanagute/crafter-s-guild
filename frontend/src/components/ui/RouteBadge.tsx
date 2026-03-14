import { getRouteGlyph, RouteTone } from "@/lib/navigation";

interface RouteBadgeProps {
  tone: RouteTone;
  label: string;
  compact?: boolean;
}

export default function RouteBadge({ tone, label, compact = false }: RouteBadgeProps) {
  return (
    <span className={`route-badge route-badge--${tone} ${compact ? "route-badge--compact" : ""}`} aria-hidden="true" title={label}>
      <span className="route-badge__crest">
        <svg viewBox="0 0 24 24" className="route-badge__glyph" focusable="false">
          <path d={getRouteGlyph(tone)} />
        </svg>
      </span>
    </span>
  );
}
