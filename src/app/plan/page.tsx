"use client";

import { useState, useEffect, useRef } from "react";
import menuData from "@/data/menu.json";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAL_TYPES = [
  { key: "breakfast", label: "🌅 Breakfast", category: "Breakfast" },
  { key: "lunch", label: "🥪 Lunch", category: "Lunch / Dinner" },
  { key: "dinner", label: "🍽️ Dinner", category: "Lunch / Dinner" },
];

const STORAGE_KEY = "napi-weekly-plan";

type MealEntry = { meal: string; emoji: string };
type DayPlan = Record<string, MealEntry[]>;
type WeeklyPlan = Record<string, DayPlan>;

function getWeekKey() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return start.toISOString().slice(0, 10);
}

function formatWeekLabel() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

type ItemWithEmoji = { name: string; emoji: string };

const itemsByCategory: Record<string, ItemWithEmoji[]> = {};
for (const cat of menuData.categories) {
  if (!itemsByCategory[cat.name]) itemsByCategory[cat.name] = [];
  for (const item of cat.items) {
    itemsByCategory[cat.name].push({
      name: item.name,
      emoji: "emoji" in item ? (item.emoji as string) : "🍽️",
    });
  }
}

function MealCell({
  day,
  mt,
  meals,
  isAdding,
  onStartAdd,
  onCancelAdd,
  onAdd,
  onRemove,
}: {
  day: string;
  mt: { key: string; label: string; category: string };
  meals: MealEntry[];
  isAdding: boolean;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onAdd: (meal: string, emoji: string) => void;
  onRemove: (index: number) => void;
}) {
  const items = itemsByCategory[mt.category] || [];

  return (
    <>
      {meals.map((entry, i) => (
        <div key={i} className="flex items-center justify-between mb-1">
          <span className="font-[family-name:var(--font-body)] text-xs text-ink">
            {entry.emoji} {entry.meal}
          </span>
          <button
            onClick={() => onRemove(i)}
            className="text-border hover:text-red-pen transition-colors text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}

      {isAdding ? (
        <div
          className="max-h-48 overflow-y-auto border border-border bg-background/60 p-1 mt-1"
          style={{ borderRadius: "2px" }}
        >
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => onAdd(item.name, item.emoji)}
              className="w-full text-left font-[family-name:var(--font-body)] text-xs px-2 py-1.5 hover:bg-border/30 transition-colors text-ink"
              style={{ borderRadius: "1px" }}
            >
              {item.emoji} {item.name}
            </button>
          ))}
          <button
            onClick={onCancelAdd}
            className="w-full text-left font-[family-name:var(--font-typewriter)] text-xs text-red-pen hover:text-ink px-2 py-1"
          >
            - hide
          </button>
        </div>
      ) : (
        <button
          onClick={onStartAdd}
          className="font-[family-name:var(--font-typewriter)] text-xs text-muted hover:text-red-pen transition-colors"
        >
          + add
        </button>
      )}
    </>
  );
}

export default function PlanPage() {
  const [plan, setPlan] = useState<WeeklyPlan>({});
  const [adding, setAdding] = useState<{ day: string; type: string } | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from API on mount
  useEffect(() => {
    fetch("/api/plan")
      .then((r) => r.json())
      .then((data) => {
        setPlan(data || {});
        setLoaded(true);
      })
      .catch(() => {
        // Fallback to localStorage
        const weekKey = getWeekKey();
        const stored = localStorage.getItem(`${STORAGE_KEY}-${weekKey}`);
        if (stored) setPlan(JSON.parse(stored));
        setLoaded(true);
      });
  }, []);

  // Poll for changes every 10 seconds
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      fetch("/api/plan")
        .then((r) => r.json())
        .then((data) => {
          if (data && JSON.stringify(data) !== JSON.stringify(plan)) {
            setPlan(data);
          }
        })
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [loaded, plan]);

  // Debounced save to API on change
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaving(true);
      fetch("/api/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      })
        .then(() => setSaving(false))
        .catch(() => setSaving(false));
    }, 500);
  }, [plan, loaded]);

  function addMeal(day: string, type: string, meal: string, emoji: string) {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: [...(prev[day]?.[type] || []), { meal, emoji }],
      },
    }));
    setAdding(null);
  }

  function removeMeal(day: string, type: string, index: number) {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: (prev[day]?.[type] || []).filter((_, i) => i !== index),
      },
    }));
  }

  if (!loaded) return null;

  const today = getTodayName();

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="font-[family-name:var(--font-body)] text-xs text-muted uppercase tracking-[0.3em] mb-2">
          meal plan for
        </p>
        <h1 className="font-[family-name:var(--font-handwritten)] text-5xl md:text-6xl text-ink">
          📅 This Week
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <svg width="40" height="6" viewBox="0 0 40 6" fill="none">
            <path d="M0 3 Q10 0 20 3 Q30 6 40 3" stroke="#c0392b" strokeWidth="1" fill="none" opacity="0.4"/>
          </svg>
          <p className="font-[family-name:var(--font-body)] text-sm text-muted">
            {formatWeekLabel()}
            {saving && <span className="ml-2 text-xs text-red-pen/60">saving...</span>}
          </p>
          <svg width="40" height="6" viewBox="0 0 40 6" fill="none">
            <path d="M0 3 Q10 6 20 3 Q30 0 40 3" stroke="#c0392b" strokeWidth="1" fill="none" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        {/* Table */}
        <div
          className="border border-ink/20 overflow-hidden"
          style={{ borderRadius: "2px" }}
        >
          {/* Header row */}
          <div className="grid grid-cols-[110px_1fr_1fr_1fr] bg-card/80 border-b-2 border-ink/20">
            <div className="px-3 py-2.5 border-r border-ink/15" />
            {MEAL_TYPES.map((mt, idx) => (
              <div
                key={mt.key}
                className={`px-3 py-2.5 text-center font-[family-name:var(--font-typewriter)] text-sm text-ink ${
                  idx < MEAL_TYPES.length - 1 ? "border-r border-ink/15" : ""
                }`}
              >
                <span className="red-underline">{mt.label}</span>
              </div>
            ))}
          </div>

          {/* Day rows */}
          {DAYS.map((day, dayIdx) => {
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`grid grid-cols-[110px_1fr_1fr_1fr] ${
                  isToday ? "bg-red-pen/[0.04]" : "bg-card/50"
                } ${dayIdx < DAYS.length - 1 ? "border-b border-ink/15" : ""}`}
              >
                {/* Day cell */}
                <div className="px-3 py-3 border-r border-ink/15 flex items-start justify-center">
                  <h3 className="font-[family-name:var(--font-typewriter)] text-sm text-ink text-center">
                    {isToday && "📌 "}
                    {day}
                  </h3>
                </div>

                {/* Meal cells */}
                {MEAL_TYPES.map((mt, idx) => (
                  <div
                    key={mt.key}
                    className={`px-3 py-2.5 ${
                      idx < MEAL_TYPES.length - 1 ? "border-r border-ink/15" : ""
                    }`}
                  >
                    <MealCell
                      day={day}
                      mt={mt}
                      meals={plan[day]?.[mt.key] || []}
                      isAdding={
                        adding?.day === day && adding?.type === mt.key
                      }
                      onStartAdd={() => setAdding({ day, type: mt.key })}
                      onCancelAdd={() => setAdding(null)}
                      onAdd={(meal, emoji) =>
                        addMeal(day, mt.key, meal, emoji)
                      }
                      onRemove={(index) => removeMeal(day, mt.key, index)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: cards per day, always open */}
      <div className="md:hidden space-y-2">
        {DAYS.map((day) => {
          const isToday = day === today;

          return (
            <div
              key={day}
              className={`border overflow-hidden ${
                isToday
                  ? "border-red-pen/30 shadow-md bg-red-pen/[0.04]"
                  : "border-ink/20 shadow-sm bg-card/80"
              }`}
              style={{ borderRadius: "2px" }}
            >
              <div className="px-4 py-2.5 border-b border-ink/15 bg-card/60 text-center">
                <h3 className="font-[family-name:var(--font-typewriter)] text-sm text-ink">
                  {isToday && "📌 "}
                  {day}
                </h3>
              </div>

              <div className="divide-y divide-ink/10">
                {MEAL_TYPES.map((mt) => (
                  <div key={mt.key} className="px-4 py-2.5">
                    <div className="font-[family-name:var(--font-typewriter)] text-xs text-muted mb-1.5">
                      {mt.label}
                    </div>
                    <MealCell
                      day={day}
                      mt={mt}
                      meals={plan[day]?.[mt.key] || []}
                      isAdding={
                        adding?.day === day && adding?.type === mt.key
                      }
                      onStartAdd={() => setAdding({ day, type: mt.key })}
                      onCancelAdd={() => setAdding(null)}
                      onAdd={(meal, emoji) =>
                        addMeal(day, mt.key, meal, emoji)
                      }
                      onRemove={(index) => removeMeal(day, mt.key, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-center mt-10">
        <p className="font-[family-name:var(--font-handwritten)] text-lg text-muted/60">
          — bon appétit 👨🏽‍🍳👩🏽‍🍳 —
        </p>
      </div>
    </div>
  );
}
