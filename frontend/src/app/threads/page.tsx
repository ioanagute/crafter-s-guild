import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { CategorySummary, ThreadSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getThreads(categoryId?: string) {
  if (categoryId) {
    return fetchAPI(`/forums/threads?categoryId=${categoryId}`) as Promise<ThreadSummary[]>;
  }

  return fetchAPI('/forums/threads') as Promise<ThreadSummary[]>;
}

async function getCategories() {
  return fetchAPI('/forums/categories') as Promise<CategorySummary[]>;
}

export default async function ThreadsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const threads = await getThreads(category);

  return (
    <>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div>
          <h2 className="section-header__title">{category ? categories.find((item) => item.id === Number(category))?.name : 'All Threads'}</h2>
          <p className="section-header__subtitle">Discussions, tutorials, and showcases from the guild.</p>
        </div>
        <button className="btn btn--primary" disabled>New Thread Coming Soon</button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <Link href="/threads" className={`badge ${!category ? 'badge--gold' : ''}`} style={{ whiteSpace: 'nowrap' }}>
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/threads?category=${item.id}`}
            className={`badge ${category == String(item.id) ? 'badge--gold' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </div>

      <div className="thread-list">
        {threads.map((thread, index) => (
          <Link 
            key={thread.id} 
            href={`/threads/${thread.id}`} 
            className="card thread-item animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="thread-item__pin">Thread</div>
            <div className="thread-item__body">
              <h3 className="thread-item__title">{thread.title}</h3>
              <div className="thread-item__meta">
                <span>by <span className="user">{thread.author?.username}</span></span>
                <span>in <span style={{ color: 'var(--accent-gold)' }}>{thread.category?.name}</span></span>
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

        {threads.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No threads are available for this view yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
