import Image from "next/image";
import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  badge?: ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  eyebrow,
  meta,
  actions,
  compact = false,
  badge,
}: PageHeroProps) {
  return (
    <section className={`page-hero ${compact ? "page-hero--compact" : ""}`}>
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="page-hero__image hero__image"
            priority={!compact}
          />
          <div className="hero__overlay" />
        </>
      ) : null}
      <div className="page-hero__content hero__content">
        {eyebrow || badge ? <div className="page-hero__heading-row">{eyebrow ? <div className="page-hero__eyebrow">{eyebrow}</div> : null}{badge}</div> : null}
        <h1 className="page-hero__title hero__title">{title}</h1>
        <p className="page-hero__subtitle hero__subtitle">{subtitle}</p>
        {meta ? <div className="page-hero__meta">{meta}</div> : null}
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </div>
    </section>
  );
}
