import Image from 'next/image';
import { fetchAPI } from '@/lib/api';
import { EventSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getEvents() {
  return fetchAPI('/events') as Promise<EventSummary[]>;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <section className="hero" style={{ minHeight: '260px', marginBottom: 'var(--space-2xl)' }}>
        <Image src="/img/events-banner.png" alt="Events banner" fill className="hero__image" style={{ filter: 'brightness(0.35)' }} />
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="hero__title">Gatherings and Challenges</h1>
          <p className="hero__subtitle">Track upcoming guild events, workshops, and community challenges.</p>
        </div>
      </section>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <div>
          <h2 className="section-header__title">Active Gatherings</h2>
          <p className="section-header__subtitle">Upcoming dates and attendance counts from the guild calendar.</p>
        </div>
      </div>

      <div className="thread-list">
        {events.map((event) => (
          <div key={event.id} className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div className="badge badge--purple" style={{ marginBottom: 'var(--space-sm)' }}>
                  {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>{event.title}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                  <span>{event.location}</span>
                  <span>|</span>
                  <span>{event._count?.rsvps || 0} attending</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', minWidth: '180px' }}>
                <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} disabled>Join Flow Coming Soon</button>
                <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled>Details Coming Soon</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No events are currently scheduled.</p>
        </div>
      )}
    </>
  );
}
