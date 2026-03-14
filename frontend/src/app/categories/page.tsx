import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getCategories() {
    return await fetchAPI('/forums/categories');
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <>
            <div className="section-header">
                <h2 className="section-header__title">✦ Forum Categories</h2>
                <p className="section-header__subtitle">Explore the diverse halls of craftsmanship</p>
            </div>

            <div className="categories-grid">
                {categories.map((cat: any) => (
                    <Link key={cat.id} href={`/threads?category=${cat.id}`} className="card category-card animate-fade-in-up">
                        <span className="category-card__icon">{cat.icon || '📜'}</span>
                        <h3 className="category-card__name">{cat.name}</h3>
                        <p className="category-card__desc">{cat.description}</p>
                        <div className="category-card__stats">
                            <span>Threads: <span className="category-card__stat-value">{cat._count?.threads || 0}</span></span>
                        </div>
                    </Link>
                ))}
            </div>
            
            {categories.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No categories have been forged yet. The grand librarian is busy...</p>
                </div>
            )}
        </>
    );
}
