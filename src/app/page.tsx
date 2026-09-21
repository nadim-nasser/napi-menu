"use client";

import { useState } from "react";
import menuData from "@/data/menu.json";

type MenuItem = {
  name: string;
  emoji: string;
  description: string;
  recipeUrl: string;
  recipeSource?: string;
  image?: string;
  video?: string;
  protein?: string;
  servings?: string;
  ingredients?: string[];
  steps?: string[];
  notes?: string[];
  tags: string[];
};

type Category = {
  name: string;
  emoji: string;
  items: MenuItem[];
};

function RecipeModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border/60 shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{ borderRadius: "2px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.video ? (
          <video
            src={item.video}
            poster={item.image || undefined}
            controls
            playsInline
            preload="none"
            className="w-full max-h-[60vh] bg-ink object-contain"
          />
        ) : (
          item.image && (
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )
        )}
        <div className="p-5">
          <h2 className="font-[family-name:var(--font-handwritten)] text-2xl text-ink mb-1">
            {item.emoji} {item.name}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-muted leading-relaxed mb-3">
            {item.description}
          </p>
          {item.protein && (
            <p className="font-[family-name:var(--font-typewriter)] text-xs text-red-pen mb-3">
              💪 {item.protein} protein
            </p>
          )}
          {item.recipeSource && (
            <p className="font-[family-name:var(--font-body)] text-xs text-muted mb-3">
              📕 From: {item.recipeSource}
            </p>
          )}

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-4">
              <h3 className="font-[family-name:var(--font-typewriter)] text-sm text-ink mb-2">
                Ingredients
                {item.servings && (
                  <span className="font-[family-name:var(--font-body)] text-xs text-muted ml-2">
                    (serves {item.servings})
                  </span>
                )}
              </h3>
              <ul className="list-disc pl-5 space-y-1 font-[family-name:var(--font-body)] text-sm text-ink/90 leading-relaxed">
                {item.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          {item.steps && item.steps.length > 0 && (
            <div className="mt-4">
              <h3 className="font-[family-name:var(--font-typewriter)] text-sm text-ink mb-2">
                Method
              </h3>
              <ol className="list-decimal pl-5 space-y-2 font-[family-name:var(--font-body)] text-sm text-ink/90 leading-relaxed">
                {item.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          {item.notes && item.notes.length > 0 && (
            <div className="mt-4 border-l-2 border-red-pen/30 pl-3">
              <h3 className="font-[family-name:var(--font-typewriter)] text-sm text-ink mb-1.5">
                Good to know
              </h3>
              <ul className="space-y-1.5 font-[family-name:var(--font-handwritten)] text-base text-muted leading-snug">
                {item.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {item.recipeUrl && (
              <a
                href={item.recipeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center font-[family-name:var(--font-typewriter)] text-sm text-white bg-red-pen/90 px-4 py-2.5 hover:bg-red-pen transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {item.steps ? "🔗 Original Recipe" : "🔗 Open Recipe"}
              </a>
            )}
            <button
              onClick={onClose}
              className="flex-1 text-center font-[family-name:var(--font-typewriter)] text-sm text-ink border border-border px-4 py-2.5 hover:bg-border/30 transition-colors"
              style={{ borderRadius: "2px" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  item,
  index,
  onSelect,
}: {
  item: MenuItem;
  index: number;
  onSelect: () => void;
}) {
  const tiltClass = index % 2 === 0 ? "rotate-[-0.3deg]" : "rotate-[0.3deg]";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-card/80 border border-border/60 shadow-sm overflow-hidden hover:rotate-0 hover:scale-[1.01] hover:shadow-md transition-all cursor-pointer ${tiltClass}`}
      style={{ borderRadius: "2px" }}
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-typewriter)] text-ink text-sm leading-snug">
              {item.emoji} {item.name}
            </h3>
            <p className="font-[family-name:var(--font-body)] text-xs text-muted mt-1 leading-relaxed">
              {item.description}
            </p>
            {item.protein && (
              <span className="font-[family-name:var(--font-typewriter)] text-xs text-red-pen mt-1 inline-block">
                💪 {item.protein}
              </span>
            )}
            {item.video && (
              <span className="font-[family-name:var(--font-typewriter)] text-xs text-red-pen mt-1 inline-block">
                ▶ Video
              </span>
            )}
          </div>
          {(item.recipeUrl || item.recipeSource) && (
            <span className="shrink-0 mt-0.5">
              {item.recipeUrl ? (
                <span className="inline-flex items-center font-[family-name:var(--font-typewriter)] text-xs text-red-pen">
                  🔗
                </span>
              ) : (
                <span className="inline-flex items-center font-[family-name:var(--font-typewriter)] text-xs text-muted">
                  📕
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function CollapsibleSection({
  emoji,
  title,
  count,
  children,
}: {
  emoji: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 mb-4 group cursor-pointer"
      >
        <span className="h-px flex-1 border-t border-dashed border-red-pen/30" />
        <span className="font-[family-name:var(--font-typewriter)] text-base text-ink whitespace-nowrap tracking-wide flex items-center gap-2">
          {emoji}{" "}
          <span className="red-underline">{title}</span>
          <span className="font-[family-name:var(--font-body)] text-xs text-muted font-normal ml-1">
            ({count})
          </span>
          <span
            className={`text-red-pen/50 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </span>
        <span className="h-px flex-1 border-t border-dashed border-red-pen/30" />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categories = menuData.categories as Category[];
  const breakfast = categories.find((c) => c.name === "Breakfast")!;
  const dinner = categories.find((c) => c.name === "Lunch / Dinner")!;
  const snacks = categories.find((c) => c.name === "Snacks")!;

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 tape-effect">
          <img
            src="/napi-hero.jpg"
            alt="Nadim & Rupi"
            className="w-full h-full object-cover object-top border-4 border-white/80 shadow-md"
            style={{ borderRadius: "2px", transform: "rotate(-2deg)" }}
          />
        </div>
        <p className="font-[family-name:var(--font-handwritten)] text-4xl md:text-5xl text-ink leading-tight">
          Welcome to our kitchen 👨🏽‍🍳👩🏽‍🍳
        </p>
        <div className="flex justify-center mt-4">
          <svg width="120" height="8" viewBox="0 0 120 8" fill="none">
            <path d="M0 4 Q30 0 60 4 Q90 8 120 4" stroke="#c0392b" strokeWidth="1" fill="none" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Two-column: Breakfast | Lunch/Dinner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <CollapsibleSection
          emoji={breakfast.emoji}
          title={breakfast.name}
          count={breakfast.items.length}
        >
          <div className="space-y-2.5">
            {breakfast.items.map((item, i) => (
              <MenuCard
                key={item.name}
                item={item}
                index={i}
                onSelect={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          emoji={dinner.emoji}
          title={dinner.name}
          count={dinner.items.length}
        >
          <div className="space-y-2.5">
            {dinner.items.map((item, i) => (
              <MenuCard
                key={item.name}
                item={item}
                index={i}
                onSelect={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Snacks */}
      <CollapsibleSection
        emoji={snacks.emoji}
        title={snacks.name}
        count={snacks.items.length}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {snacks.items.map((item, i) => (
            <MenuCard
              key={item.name}
              item={item}
              index={i}
              onSelect={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Footer */}
      <div className="flex justify-center mt-12">
        <p className="font-[family-name:var(--font-handwritten)] text-lg text-muted/60">
          — made with ❤️ by nadim & rupi —
        </p>
      </div>

      {/* Recipe modal */}
      {selectedItem && (
        <RecipeModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
