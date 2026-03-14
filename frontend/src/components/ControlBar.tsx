import { ReactNode } from "react";

interface ControlBarProps {
  summary?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
}

export default function ControlBar({ summary, filters, actions }: ControlBarProps) {
  return (
    <section className="control-bar card panel panel--inset">
      {summary ? <div className="control-bar__summary">{summary}</div> : null}
      {filters ? <div className="control-bar__filters">{filters}</div> : null}
      {actions ? <div className="control-bar__actions">{actions}</div> : null}
    </section>
  );
}
