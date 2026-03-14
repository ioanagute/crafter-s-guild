import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import HeroButtons from "@/components/HeroButtons";
import PageHeader from "@/components/PageHeader";
import PageHero from "@/components/PageHero";
import StatCounter from "@/components/StatCounter";
import RouteBadge from "@/components/ui/RouteBadge";
import { fetchAPI } from "@/lib/api";
import { primaryRoutes } from "@/lib/navigation";
import { ThreadSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getLatestThreads() {
  try {
    return (await fetchAPI("/forums/latest-threads")) as ThreadSummary[];
  } catch (error) {
    console.error("Failed to fetch latest threads", error);
    return [];
  }
}

export default async function Home() {
  const latestThreads = await getLatestThreads();

  return (
    <div className="page-shell">
      <PageHero
        title="Crafter's Guild"
        subtitle="A shared hall for artisans to trade methods, raise forum threads, and browse commissions from across the realm."
        eyebrow="Guild Chronicle"
        badge={<span className="hero-kicker">Refined Guild Hall</span>}
        actions={<HeroButtons />}
      />

      <section className="quick-links-panel card panel panel--ornate observe-animate">
        <PageHeader
          title="Choose Your Path"
          subtitle="Move quickly between the halls most members visit first."
          eyebrow="Guild Routes"
        />
        <div className="quick-links-grid">
          {primaryRoutes.slice(1).map((route) => (
            <Link href={route.href} className="quick-link-card" key={route.id}>
              <span className="quick-link-card__mark">
                <RouteBadge tone={route.tone} label={route.label} />
              </span>
              <span className="quick-link-card__title">{route.label}</span>
              <span className="quick-link-card__desc">{route.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="observe-animate">
        <PageHeader
          title="Featured Threads"
          subtitle="Recent discussions from across the guild."
          eyebrow="Featured Records"
        />
        <div className="featured-grid">
          {latestThreads.map((thread) => (
            <Link key={thread.id} href={`/threads/${thread.id}`} className="card featured-card animate-fade-in-up">
              <div className="featured-card__category">{thread.category?.name}</div>
              <h3 className="featured-card__title">{thread.title}</h3>
              <p className="featured-card__excerpt">{thread.content.substring(0, 150)}...</p>
              <div className="featured-card__footer">
                <div className="featured-card__author">
                  <div className="avatar avatar--sm featured-card__avatar">
                    {thread.author?.avatar || thread.author?.username?.slice(0, 1) || "A"}
                  </div>
                  <span className="featured-card__author-name">{thread.author?.username}</span>
                </div>
                <span>{thread._count?.posts || 0} replies</span>
              </div>
            </Link>
          ))}
          {latestThreads.length === 0 ? (
            <EmptyState
              title="The halls are quiet"
              description="No fresh forum threads have been entered into the guild records yet."
            />
          ) : null}
        </div>
      </section>

      <div className="divider"><span className="divider__icon">Gatherings</span></div>

      <section className="observe-animate">
        <Link href="/events" className="spotlight-panel card spotlight-panel--event">
          <div className="spotlight-panel__badge">Current Challenge</div>
          <div className="spotlight-panel__body">
            <div>
              <h3 className="spotlight-panel__title">March 2026 Makers Challenge</h3>
              <p className="spotlight-panel__text">
                Review the next guild contests, workshops, and shared builds gathering across the calendar.
              </p>
            </div>
            <span className="btn btn--primary">View Gatherings</span>
          </div>
        </Link>
      </section>

      <div className="divider"><span className="divider__icon">Trade</span></div>

      <section className="observe-animate">
        <Link href="/marketplace" className="spotlight-panel card spotlight-panel--market">
          <div className="spotlight-panel__badge">Guild Trade</div>
          <div className="spotlight-panel__body">
            <div>
              <h3 className="spotlight-panel__title">Fresh wares in the Dark Bazaar</h3>
              <p className="spotlight-panel__text">
                Compare prices, inspect the newest commissions, and follow trusted sellers from the guild market.
              </p>
            </div>
            <span className="btn">Browse Listings</span>
          </div>
        </Link>
      </section>

      <div className="divider"><span className="divider__icon">Stats</span></div>

      <section className="observe-animate">
        <PageHeader
          title="Guild Statistics"
          subtitle="Crafter's Guild by the numbers in 2026."
          eyebrow="Guild Ledger"
        />
        <div className="profile-stats">
          <StatCounter target={1247} label="Members" />
          <StatCounter target={3891} label="Threads" />
          <StatCounter target={28456} label="Posts" />
          <StatCounter target={1204} label="Marketplace" />
        </div>
      </section>
    </div>
  );
}
