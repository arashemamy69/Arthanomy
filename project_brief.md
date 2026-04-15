# Project Brief: Arthanomy

## Overview
**Arthanomy** is a modern, Canadian-focused personal finance and investing platform. The platform is designed to educate users on financial freedom, offering lived investing experiences, market updates, and model portfolios. 

**Tagline:** *Invest Smarter. Build Wealth. Live Free.*

## Objectives
- Empower Canadians to take control of their financial future through accessible, high-quality education.
- Provide transparent, real-world examples of model portfolios (Couch Potato, All-Weather, Aggressive Growth).
- Deliver timely market commentary and evergreen financial articles.
- Build a community of like-minded investors through a newsletter subscription model (Substack).

## Tech Stack
The application is built using a modern, performant, and scalable architecture:
- **Frontend Framework:** React 19 with Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 with custom theming (`ThemeProvider`)
- **Content Management:** Sanity CMS (Headless CMS for evergreen articles)
- **Newsletter & Updates:** Substack (RSS feed and signup form)
- **Market Data:** Tiingo API (via Express backend)
- **Backend:** Express.js (serves API routes and Vite middleware)
- **Animations:** Motion (Framer Motion)
- **Data Visualization:** Recharts (used for interactive portfolio growth charts)
- **Icons:** Lucide React
- **Typography & Markdown:** `@tailwindcss/typography`, `react-markdown`, and `@portabletext/react`

## Core Features & Architecture

### 1. Public Facing Website
- **Dynamic Hero Section:** Features an animated, interactive area chart (built with Recharts) showcasing 5-year growth of major ETFs (SPY, QQQ, VTI), fetching live data from the Tiingo API via the Express backend.
- **Model Portfolios:** Educational breakdown of different investing strategies to help users understand asset allocation.
- **Latest Updates:** A feed of timely market commentary fetched from a Substack RSS feed proxy.
- **Featured Articles:** Evergreen financial guides (e.g., TFSA/RRSP optimization, Couch Potato strategy) driven by Sanity CMS. Includes a related articles feature.
- **Newsletter Integration:** A visually distinct sign-up form that posts directly to Substack.

### 2. Content Management & Data Sources
- **Sanity CMS:** Used for evergreen, structured content. We use `@sanity/client` to fetch data. *Note: The embedded Sanity Studio (`/studio`) was removed to prevent Out-Of-Memory (OOM) errors during build. Content is managed via sanity.io/manage.*
- **Substack:** Used for timely newsletters and updates. The backend proxies the RSS feed to avoid CORS issues.
- **Tiingo API:** Replaced Yahoo Finance due to reliability issues. The backend securely fetches historical monthly data using `TIINGO_API_KEY`.

### 3. UI/UX Design
- **Responsive & Accessible:** Mobile-first design principles utilizing Tailwind CSS.
- **Engaging Animations:** Scroll-triggered fade-ins and interactive hover states powered by Framer Motion.
- **Custom Theming:** A centralized `ThemeContext` that manages gradients, text colors, and hover states to ensure a cohesive brand identity across the application.

## Next Steps / Future Enhancements
- Build out the full Markets dashboard with live indicators.
- Expand the model portfolios section with deeper, interactive drill-downs into specific ETF/stock allocations.
- Add search and filtering capabilities to the Articles page.
