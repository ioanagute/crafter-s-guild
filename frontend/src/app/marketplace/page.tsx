import Image from "next/image";
import ControlBar from "@/components/ControlBar";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import PageHero from "@/components/PageHero";
import { fetchAPI } from "@/lib/api";
import { MarketItemSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getItems() {
  return fetchAPI("/market/items") as Promise<MarketItemSummary[]>;
}

export default async function MarketplacePage() {
  const items = await getItems();

  return (
    <div className="page-shell">
      <PageHero
        title="The Dark Bazaar"
        subtitle="Browse listings, compare prices, and inspect wares recently entered by guild members."
        eyebrow="Guild Trade"
        badge={<span className="hero-kicker">Merchant Seal</span>}
        compact
      />

      <PageHeader
        title="Curated Listings"
        subtitle="The latest wares available from trusted guild members."
        eyebrow="Guild Bazaar"
      />

      <ControlBar
        summary={
          <div className="control-bar__stack">
            <span className="control-bar__eyebrow">Bazaar Count</span>
            <strong>{items.length} open listing{items.length === 1 ? "" : "s"}</strong>
          </div>
        }
        filters={
          <div className="filter-chip-row">
            <span className="filter-chip filter-chip--active">All Wares</span>
            <span className="filter-chip">Handmade</span>
            <span className="filter-chip">Commission</span>
            <span className="filter-chip">Recent</span>
          </div>
        }
      />

      <div className="marketplace-grid">
        {items.map((item, index) => {
          const displayImage = Boolean(item.image && !item.image.startsWith('/img/'));

          return (
          <div
            key={item.id}
            className="card market-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {displayImage ? (
              <div className="market-card__img-wrap market-card__hero">
                <Image src={item.image!} alt={item.title} fill className="market-card__img" />
                <div className="market-card__price-badge">
                  <span className="badge badge--gold">{item.price} coins</span>
                </div>
              </div>
            ) : null}
            <div className="market-card__body">
              {!displayImage ? (
                <div className="market-card__price-badge market-card__price-badge--inline">
                  <span className="badge badge--gold">{item.price} coins</span>
                </div>
              ) : null}
              <div className="market-card__category">Guild Listing</div>
              <h3 className="market-card__title">{item.title}</h3>
              <p className="market-card__desc">{item.description.substring(0, 100)}...</p>
              <div className="market-card__footer">
                <div className="market-card__seller-wrap">
                  <div className="avatar avatar--sm market-card__avatar">
                    {item.seller?.avatar || "S"}
                  </div>
                  <span className="market-card__seller">{item.seller?.username}</span>
                </div>
                <button className="btn btn--small" disabled>Details Soon</button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No wares listed"
          description="No marketplace listings are available right now."
        />
      ) : null}
    </div>
  );
}
