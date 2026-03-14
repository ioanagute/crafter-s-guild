interface EmptyStateProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export default function EmptyState({ title, description, eyebrow = "Guild Notice" }: EmptyStateProps) {
  return (
    <div className="empty-state card panel panel--ornate">
      <div className="empty-state__sigil" aria-hidden="true">✦</div>
      <div className="empty-state__eyebrow">{eyebrow}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
    </div>
  );
}
