import Image from 'next/image';
import { fetchAPI } from '@/lib/api';
import { MarketItemSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getItems() {
  return fetchAPI('/market/items') as Promise<MarketItemSummary[]>;
}

export default async function MarketplacePage() {
  const items = await getItems();

  return (
    <>
      <section className="hero" style={{ minHeight: '260px', marginBottom: 'var(--space-2xl)' }}>
        <Image src="/img/marketplace-banner.png" alt="Marketplace banner" fill className="hero__image" style={{ filter: 'brightness(0.35)' }} />
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="hero__title">The Dark Bazaar</h1>
          <p className="hero__subtitle">Browse listings, compare prices, and discover recent items from guild members.</p>
        </div>
      </section>

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <div>
          <h2 className="section-header__title">Curated Listings</h2>
          <p className="section-header__subtitle">The latest marketplace items from the guild.</p>
        </div>
      </div>

      <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="card market-card animate-fade-in-up" 
            style={{ 
              padding: '0', 
              display: 'flex', 
              flexDirection: 'column',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
              <Image src={item.image || '/img/hero-banner.png'} alt={item.title} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 'var(--space-md)', right: 'var(--space-md)' }}>
                <span className="badge badge--gold" style={{ fontSize: '1rem', padding: 'var(--space-xs) var(--space-md)' }}>{item.price} coins</span>
              </div>
            </div>
            <div style={{ padding: 'var(--space-lg)', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: 'var(--space-xs)', fontSize: '1.2rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)', flex: '1' }}>
                {item.description.substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div className="avatar avatar--sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.seller?.avatar || 'S'}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold-dim)' }}>{item.seller?.username}</span>
                </div>
                <button className="btn btn--small" disabled>Details Coming Soon</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No marketplace items are available right now.</p>
        </div>
      )}
    </>
  );
}
