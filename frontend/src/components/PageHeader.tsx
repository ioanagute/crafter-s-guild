import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  align?: "start" | "center";
  eyebrow?: string;
  supportingBadge?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  align = "start",
  eyebrow,
  supportingBadge,
}: PageHeaderProps) {
  return (
    <header className={`page-header ${align === "center" ? "page-header--center" : ""}`}>
      <div className="page-header__copy">
        {eyebrow ? <div className="page-header__eyebrow">{eyebrow}</div> : null}
        <h2 className="page-header__title section-header__title">{title}</h2>
        <p className="page-header__subtitle section-header__subtitle">{subtitle}</p>
      </div>
      {supportingBadge || actions ? <div className="page-header__actions">{supportingBadge}{actions}</div> : null}
    </header>
  );
}
