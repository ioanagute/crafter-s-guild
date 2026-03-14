import Link from "next/link";
import ControlBar from "@/components/ControlBar";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RouteBadge from "@/components/ui/RouteBadge";
import { fetchAPI } from "@/lib/api";
import { CategorySummary, ThreadSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getThreads(categoryId?: string) {
  if (categoryId) {
    return fetchAPI(`/forums/threads?categoryId=${categoryId}`) as Promise<ThreadSummary[]>;
  }

  return fetchAPI("/forums/threads") as Promise<ThreadSummary[]>;
}

async function getCategories() {
  return fetchAPI("/forums/categories") as Promise<CategorySummary[]>;
}

export default async function ThreadsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const threads = await getThreads(category);
  const activeCategory = category ? categories.find((item) => item.id === Number(category)) : null;

  return (
    <div className="page-shell">
      <PageHeader
        title={activeCategory?.name || "Forum Records"}
        subtitle="Browse lessons, showcases, and guild debates from every craft hall."
        eyebrow="Guild Archive"
        actions={<button className="btn btn--primary" disabled>Raise Thread Soon</button>}
      />

      <ControlBar
        summary={
          <div className="control-bar__stack">
            <span className="control-bar__eyebrow">Viewing</span>
            <strong>{threads.length} recorded thread{threads.length === 1 ? "" : "s"}</strong>
          </div>
        }
        filters={
          <div className="filter-chip-row">
            <Link href="/threads" className={`filter-chip ${!category ? "filter-chip--active" : ""}`}>
              All Records
            </Link>
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/threads?category=${item.id}`}
                className={`filter-chip ${category == String(item.id) ? "filter-chip--active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        }
      />

      <section className="callout-banner card">
        <div>
          <span className="callout-banner__eyebrow">Guild Guidance</span>
          <h3 className="callout-banner__title">Follow the craft hall before opening a record</h3>
          <p className="callout-banner__text">
            Filter by hall to keep related tutorials, critiques, and references gathered in one place.
          </p>
        </div>
      </section>

      <div className="thread-list">
        {threads.map((thread, index) => (
          <Link
            key={thread.id}
            href={`/threads/${thread.id}`}
            className="card thread-item animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="thread-item__pin">
              <RouteBadge tone="forum" label="Forum record" compact />
            </div>
            <div className="thread-item__body">
              <h3 className="thread-item__title">{thread.title}</h3>
              <div className="thread-item__meta">
                <span>by <span className="user">{thread.author?.username}</span></span>
                <span>in <span className="thread-item__hall">{thread.category?.name}</span></span>
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="thread-item__stats">
              <span>{thread._count?.posts || 0} replies</span>
            </div>
            <div className="thread-item__activity">
              Last post by <br />
              <span className="user">{thread.posts?.[0]?.author?.username || thread.author?.username}</span>
            </div>
          </Link>
        ))}

        {threads.length === 0 ? (
          <EmptyState
            title="No records for this view"
            description="Try another hall or return later when more members have posted."
          />
        ) : null}
      </div>
    </div>
  );
}
