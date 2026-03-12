# TechCorp — Internal Tools Dashboard

> Monitor and manage your organization's SaaS tools and expenses — built in 3 days.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764abc)](https://redux-toolkit.js.org)

---

## 🚀 Quick Start
```bash
git clone https://github.com/loxfer72/FrontendDashboardExercise.git
cd FrontendDashboardExercise
npm install
npm run dev
# → http://localhost:3000
```

---

## 🏗️ Architecture
```
app/                    # Next.js App Router — 3 routes + layout
components/
  layout/               # Header partagé (1 composant, 3 pages)
  dashboard/            # KPICard, RecentToolsTable
  tools/                # ToolCard, ToolFilters, AddToolModal
  analytics/            # CostCharts, InsightCards
  ui/                   # StatusBadge, Skeleton, ThemeToggle
store/                  # Redux slices: theme | tools | analytics
hooks/                  # useAppDispatch + useAppSelector typés
types/                  # Interfaces TypeScript partagées
utils/                  # api.ts | formatters.ts | constants.ts
public/
  favicon.svg           # Favicon custom
  icons/placeholder.svg # Fallback si icon_url API manquante
```

**Fichiers intentionnellement absents :**
- `public/next.svg`, `public/vercel.svg` — assets de démo supprimés à l'init
- `styles/` — tout est dans `tailwind.config.ts` + `app/globals.css`
- `hooks/useTools.ts` etc. — logique fetch centralisée dans les Redux thunks

---

## 🎨 Design System Evolution

**Jour 6 — Foundation :** Palette verrouillée dans `tailwind.config.ts` (purple `#7C3AED`, status colors, dark/light tokens). Dark mode via `darkMode: "class"` + Redux `themeSlice`. Animations `fade-in` / `slide-up` définies une fois, réutilisées partout.

**Jour 7 — Consistency :** Zéro nouvelle couleur ou classe introduite. `ToolCard` réutilise les mêmes `rounded-2xl`, `border`, `hover:-translate-y-0.5` que `KPICard`. `StatusBadge` identique au Dashboard. `AddToolModal` reprend le même pattern de `border-b` et `rounded-xl`.

**Jour 8 — Integration :** Charts colorés avec `PALETTE` extraite de la même config. Couleurs de grille et de texte dérivées du state Redux `isDark` — les graphiques respectent le dark/light toggle sans configuration supplémentaire.

---

## 🔗 Navigation & User Journey
```
/ (Dashboard)
├── KPIs + Recent Tools → vue d'ensemble
│
├── → /tools (Tools Catalog)
│     Filtres status/dept/category, grid/list, Add Tool, bulk select
│
└── → /analytics (Analytics)
      Charts coût/usage, insights avec liens croisés vers /tools
```

**Cross-page links :** Les `InsightCards` dans Analytics pointent directement vers `/tools?status=unused`, `/tools?status=expiring`, etc.

---

## 📊 Data Integration Strategy

Toutes les données viennent de `https://tt-jsonserver-01.alt-tools.tech/`.

| Page | Méthode fetch | Raison |
|---|---|---|
| Dashboard | Server Component (`async`) + ISR `revalidate: 60` | Pas de waterfall client, KPIs visibles immédiatement |
| Tools | Client via Redux thunk (`fetchTools`) | Filtres interactifs nécessitent les données en mémoire client |
| Analytics | Client via Redux thunk (`fetchAnalytics`) | Charts Chart.js = canvas, forcément client-side |

Les filtres Tools sont appliqués côté client après un fetch unique — évite des appels API répétés à chaque changement de filtre.

---

## 📱 Progressive Responsive Design

| Breakpoint | Dashboard | Tools | Analytics |
|---|---|---|---|
| < 640px | KPIs 1 col, hamburger | Cards 1 col | Charts stackés |
| 640–1024px | KPIs 2×2 | Cards 2 col, filtres top | Charts 1 col |
| > 1024px | KPIs 4 col | Cards 3 col | Charts 2 col côte à côte |

Touch targets ≥ 44px. `overflow-x-auto` sur les tables pour mobile.

---

## 🧪 Testing Strategy
```bash
npm run test        # Jest + React Testing Library
npm run test:e2e    # Playwright
```

**Unit :** `StatusBadge` (3 statuts), `KPICard` (rendu + trend color), `formatCurrency` / `getCostTrend`, reducers `toolsSlice` (setFilter, toggleSelectTool, addTool).

**E2E :** Dashboard load → KPIs visibles, Tools filter → résultats filtrés, Add Tool modal → 3 steps → tool ajouté, Theme toggle → classe `dark` appliquée.

---

## ⚡ Performance Optimizations

- **ISR Dashboard** — revalidation 60s, zéro fetch client pour les KPIs
- **Redux single fetch** — outils chargés une fois, filtrés en mémoire
- **Skeleton screens** — `KPICardSkeleton` + `TableRowSkeleton` pour perceived performance
- **`next/font` Geist** — `font-display: swap`, zéro CLS
- **`onError` img** — fallback `public/icons/placeholder.svg` si l'API retourne une URL cassée
- **`line-clamp-2`** — évite le layout shift sur les descriptions de `ToolCard`

---

## 🎯 Design Consistency Approach

Après le Jour 6, la règle était simple : **aucun token CSS nouveau**. Chaque composant Jour 7 et 8 référence exclusivement les classes Tailwind définies dans `tailwind.config.ts`. Le Header est un composant unique avec un `placeholder` adaptatif via `usePathname()` — aucune duplication. Les couleurs Chart.js sont les mêmes constantes hexadécimales que le reste du design system.

---

## 📈 Data Visualization Philosophy

**Chart.js** choisi pour son bundle léger (~60kb gzipped) et son rendu Canvas natif — pas de dépendance SVG lourde. Trois types couvrent tous les besoins analytics : `Line` (évolution temporelle), `Doughnut` (répartition proportionnelle), `Bar horizontal` (classement). Le hook `useChartTheme()` centralise la dérivation dark/light pour les couleurs de grille et de texte.

---

## 🔮 Next Steps

- **Auth** — NextAuth.js + rôles admin/viewer
- **Real-time** — SWR polling ou WebSocket pour coûts live
- **Export** — PDF via `@react-pdf/renderer`, Excel via `xlsx`
- **Notifications** — Toast system + alertes email pour outils expirants
- **Multi-tenant** — Support workspaces multi-organisations
- **Tests coverage** — 80%+ avec Playwright E2E sur les 3 pages