import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import RouteBadge from "@/components/ui/RouteBadge";
import { fetchAPI } from "@/lib/api";
import { CategorySummary } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCategories() {
  return fetchAPI("/forums/categories") as Promise<CategorySummary[]>;
}

const categoryTones: Record<string, "halls" | "bazaar" | "events" | "forum" | "home"> = {
  "Candle Making": "halls",
  Blacksmithing: "forum",
  Leatherworking: "bazaar",
  Alchemy: "events",
  Woodworking: "home",
  Weaving: "halls",
  Pottery: "forum",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="page-shell">
      <PageHeader
        title="Craft Halls"
        subtitle="Each hall holds the guild's ongoing lessons, critiques, and workshop records."
        eyebrow="Forum Halls"
      />

      <section className="intro-panel card">
        <p>
          Step through the hall that matches your craft. Each chamber gathers its own threads, methods, and
          notable projects so members can find the right discussion without crossing the whole keep.
        </p>
      </section>

      <div className="categories-grid">
        {categories.map((category, index) => {
          const tone = categoryTones[category.name] || "halls";

          return (
            <Link
              key={category.id}
              href={`/threads?category=${category.id}`}
              className="card category-card animate-fade-in-up border-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="category-card__icon category-card__icon--mark">
                <RouteBadge tone={tone} label={category.name} />
              </span>
              <h3 className="category-card__name text-gradient">{category.name}</h3>
              <p className="category-card__desc">{category.description}</p>
              <div className="category-card__stats">
                <span>
                  Threads: <span className="category-card__stat-value">{category._count?.threads || 0}</span>
                </span>
              </div>
              <span className="category-card__cta">Enter Hall</span>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No halls prepared"
          description="The guild has not opened any craft halls yet."
        />
      ) : null}
    </div>
  );
}
