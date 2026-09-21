# Napi Meal Planning

This is Nadim & Rupi's personal meal planning website, live at **https://napi-menu.vercel.app**

## Tech Stack
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Vercel** for hosting (auto-deploys on every push to `main`)

## Project Structure
- `src/data/menu.json` — **THE MENU DATA**. All dishes, emojis, descriptions, recipe links, and protein info live here. This is the main file to edit when adding/removing/changing meals.
- `src/app/page.tsx` — Menu page (homepage). Shows all dishes in collapsible Breakfast / Lunch-Dinner / Snacks sections. Clicking a dish opens a recipe popup.
- `src/app/plan/page.tsx` — Weekly meal planner. Table with Breakfast / Lunch / Dinner columns for each day of the week.
- `src/components/nav.tsx` — Navigation bar.
- `src/app/globals.css` — Global styles (colours, background, fonts).
- `src/app/layout.tsx` — Root layout with fonts (Special Elite typewriter, Lato body, Caveat handwritten).
- `public/napi-hero.jpg` — Photo of Nadim & Rupi shown on the homepage.
- `public/bg-pattern.svg` — Hand-drawn food illustration background pattern.

## Design Style
Nonna's cookbook / handmade scrapbook aesthetic:
- **Special Elite** font for headings (typewriter style)
- **Lato** for body text (clean, Gill Sans feel)
- **Caveat** for handwritten accent text
- Kraft paper background with subtle hand-drawn food illustrations
- Red pen wavy underlines on section headers
- Slight card tilt for scrapbook feel
- Warm colour palette: kraft (#e8dcc8), ink (#1a1206), red-pen (#c0392b), muted (#6b5d4d)

## Common Tasks

### Adding a new dish
Edit `src/data/menu.json`. Add a new item to the appropriate category's `items` array:
```json
{
  "name": "Dish Name",
  "emoji": "🍛",
  "description": "A short description of the dish",
  "recipeUrl": "https://link-to-recipe-if-any",
  "image": "",
  "tags": []
}
```
For Dishoom recipes, add `"recipeSource": "Dishoom"` instead of a URL.
For snacks with protein info, add `"protein": "20g"`.

### Changing the design
- Colours: edit CSS variables in `src/app/globals.css`
- Fonts: change imports in `src/app/layout.tsx`
- Layout: edit `src/app/page.tsx` (menu) or `src/app/plan/page.tsx` (planner)

### After making changes
Always commit and push to make changes live:
```
git add -A && git commit -m "describe your change" && git push
```
The site auto-deploys in ~30 seconds after pushing.

## Collaborators
- **Nadim** (nadim-nasser) — owner
- **Rupi** (rupi-builds) — collaborator with push access
