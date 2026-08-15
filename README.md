# 📊 Peakline — Sales Analytics Dashboard

> A modern, responsive sales analytics dashboard for exploring retail and e-commerce performance through KPIs, interactive visualizations, operational tables, and exportable reports.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data_Visualization-22B5BF)
![React Router](https://img.shields.io/badge/React_Router-Hash_Routing-CA4245?logo=reactrouter&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Desktop_to_Mobile-1FA97A)

---

## 🖥️ Project Preview

> 📸 **Screenshots coming soon.** Add dashboard captures to an `assets/` or `docs/` folder, then replace this note with relative image paths such as `![Dashboard preview](./docs/dashboard-preview.png)`.

---

## Quick Navigation

[Overview](#overview) · [Features](#key-features) · [Modules](#application-modules) · [Dashboard](#dashboard-capabilities) · [Filters](#shared-filter-system) · [Reports](#reporting) · [Technology](#technology-stack) · [Architecture](#architecture) · [Getting Started](#getting-started) · [Roadmap](#roadmap) · [Author](#author)

---

## Overview

Peakline turns a retail sales dataset into a focused internal analytics experience. It is designed for teams that need one place to review revenue, profit, product performance, customer activity, and order-level data without moving between spreadsheets.

The current application is a frontend-only demonstration: it uses a deterministic mock dataset, allowing every view to calculate against the same consistent source of data.

## Key Features

| 📈 Analytics | 🎯 Shared filtering |
| --- | --- |
| Revenue, cost, and profit trends | Date range filtering with quick presets |
| Category, regional, product, and customer insights | Region, category, and product filters |
| Seven KPI cards with period comparisons | One active filter state across relevant views |

| 📦 Operations | 📄 Reporting & experience |
| --- | --- |
| Searchable, sortable, paginated data tables | Five CSV exports based on active filters |
| Order-detail modal and status indicators | Light and dark themes with saved preference |
| Product inventory and customer lifecycle views | Responsive layout and mobile navigation drawer |

## 🧩 Application Modules

| Module | Description |
| --- | --- |
| **Dashboard** | High-level KPI overview with sales, profit, category, region, product, and customer insights. |
| **Sales Analytics** | Trend analysis, performance breakdowns, and filtered product and customer tables. |
| **Products** | Catalog-level units sold, revenue, profit margin, and stock status. |
| **Customers** | Customer spend, order count, average order value, region, and lifecycle segment. |
| **Orders** | Searchable and sortable order data with pagination and a detail modal. |
| **Reports** | Filter-aware CSV exports for core business summaries. |
| **Settings** | Theme controls, global filter reset, and dataset summary. |

## Dashboard Capabilities

### Core KPIs

| Revenue | Profit | Orders | Customers |
| --- | --- | --- | --- |
| Total sales value | Total profitability | Number of orders | Unique customers |

| Average Order Value | Sales Growth | Conversion Rate |
| --- | --- | --- |
| Revenue per order | Comparison with the previous period | Completed order share |

### Visual Analysis

The dashboard and analytics views present monthly revenue and profit trends, cost comparisons, category and regional performance, top products, and customer segmentation. All visualizations are computed from the currently filtered data.

## Shared Filter System

Peakline uses a central filter context to keep analytics consistent throughout the application.

| Filter | Scope |
| --- | --- |
| **Date range** | Limits data by start and end date, with quick range presets. |
| **Region** | Focuses performance data on a selected sales region. |
| **Category** | Narrows results to a product category. |
| **Product** | Narrows results to a specific product within the available selection. |

Active filters drive the relevant metrics, charts, operational tables, and report exports, so each view reflects the same analytical context.

## Reporting

The Reports module exports CSV files from the active filter state.

| Export | Contents |
| --- | --- |
| **Revenue Report** | Monthly revenue, cost, profit, and order totals. |
| **Sales Report** | Order-level sales data matching the active filters. |
| **Product Performance** | Product revenue, margin, units sold, profit, and stock. |
| **Regional Performance** | Revenue, profit, order, and customer figures by region. |
| **Category Performance** | Revenue, profit, and order figures by category. |

## 📱 Responsive by Design

The interface adapts across desktop, laptop, tablet, and mobile viewports. Navigation changes to a mobile drawer on smaller screens, while KPI cards, charts, and data tables reflow to preserve usability.

## 🌗 Theme Support

Peakline supports light and dark modes. The selected theme is stored in `localStorage` and restored when the application is revisited; the initial theme also respects the system color preference when no saved choice exists.

## Technology Stack

| Technology | Role |
| --- | --- |
| [React 19](https://react.dev/) | Component-based user interface |
| [Vite](https://vite.dev/) | Development server and production build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive, utility-first styling and theme variants |
| [Recharts](https://recharts.org/) | Interactive charts and visualizations |
| [React Router](https://reactrouter.com/) | Hash-based client-side routing for static hosting |
| [Lucide](https://lucide.dev/) | Consistent interface icons |

## Architecture

```text
┌──────────────────────────────────────────────┐
│                React Application             │
├──────────────────────────────────────────────┤
│ Dashboard · Analytics · Products · Customers │
│ Orders · Reports · Settings                  │
├──────────────────────────────────────────────┤
│ Reusable layout, filters, and UI components  │
├──────────────────────────────────────────────┤
│ Theme Context · Filter Context · Calculations│
├──────────────────────────────────────────────┤
│ Deterministic mock products, customers,      │
│ and sales orders                             │
└──────────────────────────────────────────────┘
```

The application currently has no backend, database, or external API. Its pages, reports, and visualizations derive from a seeded in-browser mock dataset.

## Project Structure

```text
src/
├── components/
│   ├── filters/       # Global filter controls
│   ├── layout/        # Application shell, navigation, and header
│   └── ui/            # Reusable cards, tables, modals, and states
├── context/           # Theme and global filter providers
├── data/              # Deterministic mock dataset generator
├── pages/             # Route-level application views
├── utils/             # Aggregations, formatting, CSV export, and hooks
├── App.jsx            # Providers and hash-based route definitions
└── main.jsx           # React entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repository-url>
cd Sales_Dashboard
npm install
```

### Development

```bash
npm run dev
```

Vite typically starts the local application at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run Oxlint checks. |

## Data Architecture

The mock generator creates products, customers, and orders using a seeded pseudo-random sequence. Metrics, charts, tables, and downloadable reports all derive from that shared dataset and the active global filters.

This keeps the dashboard internally consistent while making clear that it is an analytics UI demonstration rather than a live production data system.

## Roadmap

- [ ] Connect to a live backend and API
- [ ] Persist data in a database
- [ ] Add authentication and role-based access
- [ ] Support shareable, filter-preserving dashboard URLs
- [ ] Add automated tests for calculations and user flows
- [ ] Offer configurable report columns and advanced exports

## What This Project Demonstrates

- React component architecture and route-level code splitting
- Client-side state management and data aggregation
- Interactive data visualization with Recharts
- Responsive dashboard and table interaction patterns
- CSV generation, theme persistence, and analytics-focused UX

## Author

**Mohan Ramasamy**  
B.E. Electronics and Communication Engineering  
SNS College of Technology

[GitHub](https://github.com/mohanramasamy2005-eng) · [LinkedIn](https://linkedin.com/in/mohanramasamyy)

---

> Built with React, data visualization, and a focus on practical analytics UX.
