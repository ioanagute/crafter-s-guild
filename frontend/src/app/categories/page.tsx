import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { CategorySummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getCategories() {
  return fetchAPI('/forums/categories') as Promise<CategorySummary[]>;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <div className="section-header">
        <h2 className="section-header__title">Forum Categories</h2>
        <p className="section-header__subtitle">Explore the guild&apos;s main areas of discussion.</p>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => {
          // Themed icon mapping
          const icons: Record<string, string> = {
            'Candle Making': '🕯️',
            'Blacksmithing': '⚒️',
            'Leatherworking': '👞',
            'Alchemy': '⚗️',
            'Woodworking': '🪵',
            'Weaving': '🧵',
            'Pottery': '🏺',
          };
          const icon = icons[category.name] || category.icon || '📜';

          return (
            <Link 
              key={category.id} 
              href={`/threads?category=${category.id}`} 
              className="card category-card animate-fade-in-up border-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="category-card__icon">{icon}</span>
              <h3 className="category-card__name text-gradient">{category.name}</h3>
              <p className="category-card__desc">{category.description}</p>
              <div className="category-card__stats">
                <span>Threads: <span className="category-card__stat-value">{category._count?.threads || 0}</span></span>
              </div>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No categories are available yet.</p>
        </div>
      )}
    </>
  );
}
