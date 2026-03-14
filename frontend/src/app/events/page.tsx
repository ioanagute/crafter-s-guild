import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import PageHero from "@/components/PageHero";
import { fetchAPI } from "@/lib/api";
import { EventSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getEvents() {
  return fetchAPI("/events") as Promise<EventSummary[]>;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="page-shell">
      <PageHero
        title="Gatherings and Challenges"
        subtitle="Track upcoming guild events, workshops, and realm-wide challenges."
        eyebrow="Guild Calendar"
        badge={<span className="hero-kicker">Gathering Seal</span>}
        compact
      />

      <PageHeader
        title="Upcoming Gatherings"
        subtitle="Dates, attendance, and locations from the guild calendar."
        eyebrow="Guild Muster"
      />

      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="card event-card">
            <div className="event-card__date">
              <span className="event-card__day">{new Date(event.date).getDate()}</span>
              <span className="event-card__month">
                {new Date(event.date).toLocaleString([], { month: "short" })}
              </span>
            </div>
            <div className="event-card__body">
              <div className="event-card__type event-card__type--showcase">
                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <h3 className="event-card__title">{event.title}</h3>
              <p className="event-card__meta">
                <span>{event.location}</span>
                <span>{event._count?.rsvps || 0} attending</span>
              </p>
              <p>{event.description}</p>
            </div>
            <div className="event-card__actions">
              <button className="btn btn--primary" disabled>Join Muster Soon</button>
              <button className="btn" disabled>View Details Soon</button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No gatherings scheduled"
          description="The guild calendar is empty for the moment."
        />
      ) : null}
    </div>
  );
}
