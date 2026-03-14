import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getThreads(categoryId?: string) {
    if (categoryId) {
        return await fetchAPI(`/forums/categories/${categoryId}/threads`);
    }
    // Backend doesn't have a direct "get all threads" but we can use categories/threads or just categories
    // For now I'll assume standard list or use a specific endpoint if I find one.
    // Actually the backend controller only has getThreadsByCategory.
    // I'll fetch categories first and then threads if no category is specified.
    // Or I'll just show "Select a category" if none.
    return [];
}

async function getCategories() {
    return await fetchAPI('/forums/categories');
}

export default async function ThreadsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const categories = await getCategories();
    const threads = await getThreads(category);

    return (
        <>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                <div>
                    <h2 className="section-header__title">✦ {category ? categories.find((c:any) => c.id == category)?.name : 'All Threads'}</h2>
                    <p className="section-header__subtitle">Discussions, tutorials, and showcases</p>
                </div>
                <Link href="/threads/new" className="btn btn--primary">✦ New Thread</Link>
            </div>

            {/* Category Filter Bar */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <Link 
                    href="/threads" 
                    className={`badge ${!category ? 'badge--gold' : ''}`}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    All
                </Link>
                {categories.map((cat: any) => (
                    <Link 
                        key={cat.id} 
                        href={`/threads?category=${cat.id}`}
                        className={`badge ${category == cat.id ? 'badge--gold' : ''}`}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {cat.icon} {cat.name}
                    </Link>
                ))}
            </div>

            <div className="thread-list">
                {threads.map((thread: any) => (
                    <Link key={thread.id} href={`/threads/${thread.id}`} className="card thread-item animate-fade-in-up">
                        <div className="thread-item__pin">⚜️</div>
                        <div className="thread-item__body">
                            <h3 className="thread-item__title">{thread.title}</h3>
                            <div className="thread-item__meta">
                                <span>by <span className="user">{thread.author?.username}</span></span>
                                <span>in <span style={{ color: 'var(--accent-gold)' }}>{thread.category?.name}</span></span>
                                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="thread-item__stats">
                            <span>💬 {thread._count?.posts || 0}</span>
                        </div>
                        <div className="thread-item__activity">
                            Last post by <br /><span className="user">{thread.posts?.[0]?.author?.username || thread.author?.username}</span>
                        </div>
                    </Link>
                ))}

                {!category && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Select a category from above to browse the guild archives.</p>
                    </div>
                )}

                {category && threads.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No threads have been woven in this category yet. Be the first!</p>
                    </div>
                )}
            </div>
        </>
    );
}
