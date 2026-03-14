import Image from 'next/image';
import Link from 'next/link';
import StatCounter from '@/components/StatCounter';
import { fetchAPI } from '@/lib/api';
import { ThreadSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getLatestThreads() {
  try {
    return await fetchAPI('/forums/latest-threads') as ThreadSummary[];
  } catch (error) {
    console.error('Failed to fetch latest threads', error);
    return [];
  }
}

export default async function Home() {
  const latestThreads = await getLatestThreads();

  return (
    <>
      <section className="hero observe-animate">
        <Image src="/img/hero-banner.png" alt="Guild workshop" fill className="hero__image" priority />
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="hero__title">Crafter&apos;s Guild</h1>
          <p className="hero__subtitle">
            A shared home for makers to trade techniques, post forum threads, and browse marketplace
            listings from across the guild.
          </p>
          <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <Link href="/auth" className="btn btn--primary">Join the Guild</Link>
            <Link href="/threads" className="btn">Browse Threads</Link>
          </div>
        </div>
      </section>

      <section className="observe-animate" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="tags-cloud">
          <Link className="tag tag--hot" href="/threads">#GuildUpdates</Link>
          <Link className="tag" href="/threads">#BlackFlame</Link>
          <Link className="tag" href="/threads">#VictorianMourning</Link>
          <Link className="tag" href="/threads">#DamascusSteel</Link>
          <Link className="tag" href="/threads">#SkullKnit</Link>
          <Link className="tag" href="/threads">#RavenFeather</Link>
          <Link className="tag tag--hot" href="/events">#MonthlyChallenge</Link>
          <Link className="tag" href="/marketplace">#NewListings</Link>
        </div>
      </section>

      <section className="observe-animate">
        <div className="section-header">
          <h2 className="section-header__title">Featured Threads</h2>
          <p className="section-header__subtitle">Recent discussions from across the guild</p>
        </div>

        <div className="featured-grid">
          {latestThreads.map((thread) => (
            <Link key={thread.id} href={`/threads/${thread.id}`} className="card featured-card animate-fade-in-up">
              <div className="featured-card__category">{thread.category?.icon} {thread.category?.name}</div>
              <h3 className="featured-card__title">{thread.title}</h3>
              <p className="featured-card__excerpt">{thread.content.substring(0, 150)}...</p>
              <div className="featured-card__footer">
                <div className="featured-card__author">
                  <div className="avatar avatar--sm">
                    {thread.author?.avatar ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          background: 'var(--bg-dark)',
                        }}
                      >
                        {thread.author.avatar}
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6b3a7d,#8b2a3a)' }}></div>
                    )}
                  </div>
                  <span className="featured-card__author-name">{thread.author?.username}</span>
                </div>
                <span>{thread._count?.posts || 0} replies</span>
              </div>
            </Link>
          ))}

          {latestThreads.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>The guild halls are quiet for now.</p>
          )}
        </div>
      </section>

      <div className="divider"><span className="divider__icon">Events</span></div>

      <section className="observe-animate">
        <Link
          href="/events"
          className="card"
          style={{
            display: 'block',
            background: 'linear-gradient(135deg,rgba(107,58,125,0.12),rgba(10,10,15,0.9))',
            borderColor: 'rgba(107,58,125,0.35)',
            padding: 'var(--space-xl)',
            textDecoration: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.5rem' }}>Now</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-purple-bright)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                Current Event
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--accent-gold)' }}>
                March 2026 Makers Challenge
              </div>
              <p style={{ margin: 'var(--space-xs) 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Browse upcoming guild events and see what the community is planning next.
              </p>
            </div>
            <span className="btn btn--primary">View Events</span>
          </div>
        </Link>
      </section>

      <div className="divider"><span className="divider__icon">Activity</span></div>

      <section className="observe-animate">
        <div className="section-header">
          <h2 className="section-header__title">Recent Activity</h2>
          <p className="section-header__subtitle">The latest updates from the guild halls</p>
        </div>

        <div className="card activity-list">
          <div className="activity-item animate-fade-in-up">
            <span className="activity-item__icon">New</span>
            <div>
              <p className="activity-item__text">
                <strong>System</strong> welcomes new artisans to the guild.
              </p>
              <span className="activity-item__time">Just now</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"><span className="divider__icon">Stats</span></div>

      <section className="observe-animate">
        <div className="section-header">
          <h2 className="section-header__title">Guild Statistics</h2>
          <p className="section-header__subtitle">Crafter&apos;s Guild by the numbers in 2026</p>
        </div>
        <div className="profile-stats">
          <StatCounter target={1247} label="Members" />
          <StatCounter target={3891} label="Threads" />
          <StatCounter target={28456} label="Posts" />
          <StatCounter target={1204} label="Marketplace" />
        </div>
      </section>
    </>
  );
}
