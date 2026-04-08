# FoodKeeper

> Track what's in your pantry, get alerts before food expires, and find recipes to use it all up — so less food hits the trash.

![FoodKeeper Dashboard](https://img.shields.io/badge/status-live-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)

**Live:** [pantry-pal-liart.vercel.app](https://pantry-pal-liart.vercel.app)

---

## The Problem

The average US household throws away roughly **$1,500 worth of food every year**. Most of it isn't spoiled when it's bought — it's forgotten. Items get pushed to the back of the fridge or pantry, expire silently, and end up in the trash. There's no easy way to see what you have, what's about to go bad, and what you can actually cook with it.

## What It Does

FoodKeeper lets you scan barcodes or manually add items to a digital pantry, then tracks expiration dates and sends color-coded alerts before anything goes to waste. When items are close to expiring, the app suggests recipes that use those ingredients first — turning "about to expire" into tonight's dinner instead of tomorrow's trash.

## Key Features

| Feature | What It Does |
|---------|-------------|
| Barcode Scanning | Scan products with your phone camera or enter barcodes manually — auto-fills item details via OpenFoodFacts API |
| Expiration Tracking | Color-coded alerts (green/yellow/orange/red) show exactly how many days each item has left |
| Pantry Management | Add, edit, and organize items by category with duplicate detection and quantity merging |
| Recipe Discovery | Find recipes based on what's in your pantry — see match percentages and missing ingredients via Spoonacular API |
| Shopping List | Add missing recipe ingredients to a categorized shopping list with single and bulk-add modes |
| Cost Insights | Track pantry value and see how much money is at risk from expiring items |

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 | Component model fits the multi-view pantry/recipe/shopping architecture; hooks enable clean state isolation per domain |
| Build | Vite 7 | Sub-second HMR during development and optimized production builds without Webpack configuration overhead |
| Styling | Tailwind CSS 4 | Utility-first approach enabled rapid prototyping of responsive layouts without writing custom CSS files |
| Barcode | html5-qrcode + OpenFoodFacts API | Free, open-source barcode scanning with no API key required for product lookups |
| Recipes | Spoonacular API | Ingredient-based recipe search with match scoring — the only free-tier API that returns "what you have vs. what you need" |
| Persistence | localStorage | Zero-backend approach keeps the app free to host and eliminates auth complexity for a solo MVP |
| Deployment | Vercel | One-click deploys from GitHub with automatic preview builds on every push |

## Architecture

```
User
 │
 ├── Scan Barcode ──→ html5-qrcode (camera) ──→ OpenFoodFacts API
 │                                                    │
 │                                              Product details
 │                                                    │
 ├── Add/Edit Item ──→ PantryItemForm ──→ usePantry hook ──→ localStorage
 │                                              │
 │                                    ┌─────────┴──────────┐
 │                                    │                    │
 ├── Home Dashboard ←── Expiration queries    Cost calculations
 │
 ├── Find Recipes ──→ useRecipes hook ──→ Spoonacular API
 │                          │
 │                    Match % calculation
 │                          │
 └── Shopping List ←── Missing ingredients ──→ useShoppingList hook ──→ localStorage
```

**Data flow:** Each page consumes one or more custom hooks (`usePantry`, `useRecipes`, `useShoppingList`) that own their domain state and sync to `localStorage`. Pages communicate through a shared navigation handler that can pass context (e.g., clicking "Find Recipe" on an expiring item pre-fills the ingredient search).

## Technical Decisions

**State management:** Custom hooks with localStorage over Redux or Zustand
**Why:** The app has three independent data domains (pantry, recipes, shopping) with no cross-domain state conflicts. Custom hooks kept each domain self-contained with zero dependency overhead. localStorage persistence means the app works offline with no backend.

**Tab-based navigation** over React Router
**Why:** The app has four flat views with no nested routes or deep linking requirements. A simple `activeTab` state avoids the router bundle and keeps navigation instant. Inter-page context (like passing an ingredient to the recipe search) is handled through a callback prop.

**OpenFoodFacts** over paid barcode APIs (UPCitemdb, Barcode Lookup)
**Why:** Free and open-source with no API key required. The tradeoff is less comprehensive US product coverage, but for an MVP focused on demonstrating the barcode-to-pantry flow, it removes the billing barrier entirely.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
git clone https://github.com/jonelrichardson-spec/pantry-pal.git
cd pantry-pal
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
```
> Get a free API key at [spoonacular.com/food-api](https://spoonacular.com/food-api). The app also lets you enter the key in-app if the environment variable isn't set.

### Run Locally
```bash
npm run dev
# Open http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

## What I'd Build Next

- **Push notifications** — browser notifications for items expiring within 24 hours, so users don't need to open the app to stay informed
- **Cloud sync with user accounts** — migrate from localStorage to a backend (Supabase or Firebase) so pantry data persists across devices
- **Meal planning calendar** — drag recipes onto a weekly calendar that auto-generates a consolidated shopping list, reducing duplicate store trips
- **Household sharing** — let multiple family members contribute to the same pantry and shopping list in real time

## About This Project

Built as a solo project during the **Pursuit Fellowship** (October 2025). FoodKeeper was designed to solve a personal frustration — constantly throwing out forgotten groceries — while demonstrating full-stack frontend skills: API integration, state management, responsive design, and device hardware access (camera for barcode scanning).

**My role:** Solo developer — designed, built, and deployed the entire application from concept to production.

---

Built by [Jonel Richardson](https://linkedin.com/in/jonel-richardson)
