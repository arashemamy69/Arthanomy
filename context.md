# Arthanomy: Project Context & Strategic Decisions

This document serves as the comprehensive "brain" of the Arthanomy project. It records the strategic, architectural, and technical decisions made throughout the development process, ensuring that any future developer or AI assistant can pick up the project seamlessly with full context.

## 1. Initial Platform Decision: WordPress vs. Modern Stack
**Context:** Early in the project, we discussed whether to use WordPress (hosted on Hostinger) or build a custom application using modern web technologies.
**Decision:** We chose a **React 19 + Vite + Tailwind CSS** stack over WordPress.
**Reasoning:**
- **Interactivity & Custom UI:** The core vision for Arthanomy includes highly interactive, data-driven components (like the live 5-year portfolio growth charts using Recharts). WordPress makes building bespoke, animated, data-driven React components cumbersome.
- **Performance & Modern Feel:** A Single Page Application (SPA) built with React and Framer Motion provides the snappy, app-like experience required for a modern finance platform.
- **Hosting Flexibility:** While Hostinger is traditionally known for shared PHP/WordPress hosting, modern Hostinger VPS or specialized Node.js plans can host an Express/Vite app. Alternatively, the app is perfectly suited for serverless container platforms like Google Cloud Run or Render.

## 2. Content Strategy: Sanity CMS vs. Substack
**Context:** We needed a way to manage both evergreen educational content and timely market updates.
**Decision:** We adopted a **Hybrid Content Strategy**.
- **Sanity CMS (Evergreen Content):** Used for core educational articles, model portfolio breakdowns, and author profiles.
  - *Why?* Evergreen content needs strict structural control, custom UI layouts (like the Bento grid), and strong on-site SEO. Sanity provides a headless API that lets us render this content natively in our React components (`/post/:slug`).
- **Substack (Timely Updates & Newsletters):** Used for weekly/monthly market commentary and email capture.
  - *Why?* Substack has a built-in audience network and handles email delivery out-of-the-box. Instead of building a complex email infrastructure, we proxy Substack's RSS feed into our app (`/substack/:slug`). This gives us the best of both worlds: Substack's email delivery and our website's branded reading experience.

## 3. Architecture Pivot: SPA to Full-Stack (Express)
**Context:** The app originally started as a pure client-side React SPA.
**Decision:** We converted the app to a **Full-Stack Express + Vite** architecture.
**Reasoning:**
- **CORS & API Security:** We needed to fetch live market data and parse the Substack RSS feed. Doing this directly from the browser exposes API keys and triggers Cross-Origin Resource Sharing (CORS) blocks.
- **The Solution:** We added an Express.js backend (`server.ts`) that acts as a proxy. The React frontend calls our own `/api/finance/:ticker` and `/api/substack` routes, and the Express server securely makes the external requests using hidden environment variables.

## 4. Market Data API Evolution
**Context:** The hero section features a live chart showing the 5-year growth of a $10,000 investment.
**Decision History:**
1. **Yahoo Finance:** Initially used, but proved unreliable and difficult to proxy without getting blocked.
2. **Tiingo:** Switched to Tiingo for reliable historical data. However, Tiingo lacked support for Canadian TSX tickers (like `XIC.TO`), which is critical for a Canadian-focused platform.
3. **EODHD (Current):** Switched to EODHD (End of Day Historical Data). It provides reliable, split/dividend-adjusted historical data and fully supports the Canadian market (`XIC.TO`).

## 5. Sanity Studio Out-of-Memory (OOM) Resolution & Local Studio
**Context:** We initially embedded the Sanity Studio directly into the app at the `/studio` route.
**Decision:** We removed the embedded Studio and opted for a standalone local Studio folder.
**Reasoning:** The `@sanity/studio` package is massive. During the build process in the AI Studio preview environment, Vite ran out of memory trying to bundle it, crashing the container. 
**Current Workflow:** We created a standalone Sanity Studio inside the `/studio` directory in this repository. 
- **Schema Location:** The schema that defines the structure of our content (like Articles) is located at `/studio/schemaTypes/article.ts`.
- **Deployment:** The Studio is deployed natively to Sanity's hosting via the `npx sanity deploy` command run from inside the `/studio` folder. It is accessible at `https://arthanomy.sanity.studio`.

## 6. Production Hosting Strategy
**Context:** Planning for the live deployment of the Express + Vite application.
**Options Considered:**
- **Google Cloud Run:** A fully managed, serverless container platform. 
  - *Pros:* Scales to zero (you only pay when the app is processing requests), highly scalable, generous free tier (2 million requests/month), native integration with Google Cloud.
  - *Cons:* Slightly steeper learning curve if you aren't familiar with Docker/Containers.
- **Hostinger (Current User Account):** 
  - *Pros:* Already paid for.
  - *Cons:* Standard shared hosting only supports PHP/WordPress. To run this Node.js/Express app on Hostinger, you must have a **VPS (Virtual Private Server)** plan. You would need to SSH into the server, install Node.js, clone the repo, run `npm run build`, and use a process manager like PM2 and a reverse proxy like Nginx.
- **Render / Railway:** 
  - *Pros:* "Push to deploy" simplicity for Node.js apps. Much easier than configuring a Hostinger VPS manually.

**Recommendation:** If you want the easiest deployment for this specific tech stack, exporting to GitHub and connecting it to **Render** is the smoothest path. If you want enterprise-grade scalability and are comfortable with containers, **Google Cloud Run** is excellent. If you want to use your existing Hostinger account, you must ensure it is a VPS plan and be prepared for manual server configuration.

## 7. Content Architecture & Routing Evolution
**Context:** As the content library grew, the site needed a more robust taxonomy and navigation structure.
**Decisions:**
- **Topic & Tag Taxonomy:** We defined 8 core topics (Education, Stocks and ETFs, Income Investing, Portfolio Strategies, Financial Freedom, Economy, Real Estate, Tax Strategies) and assigned them specific theme colors. We introduced dedicated `/topic/:slug` and `/tag/:slug` pages to aggregate content.
- **Series Hub:** We introduced a "Series" concept for multi-part educational content. The `/learning/:slug` route acts as a hub for a series, listing all parts in order. Articles belonging to a series now display a series header and previous/next part navigation at the bottom.
- **Canonical Routing:** We migrated evergreen article URLs from `/post/:slug` to `/articles/:slug` and implemented canonical `<link>` tags in the document `<head>` to ensure SEO integrity, especially when articles are accessed via different paths (e.g., within a series).

## 8. Advanced Sanity Schema & Rendering
**Context:** The editorial team required richer formatting options and better author attribution.
**Decisions:**
- **Author Profiles:** Added an `author` document type to Sanity. Articles now fetch and display rich author bios, photos, and social links (LinkedIn, Substack) at the bottom of the article.
- **Custom PortableText Renderers:** We implemented custom renderers for specific block types:
  - `pullStat`: Renders large, visually prominent statistical callouts.
  - `table`: Standard table rendering.
  - `arthTable`: A highly customized, editorial-style table renderer that strips markdown bold syntax (`**`), removes all vertical borders, and uses a warm grey header (`#EEECE7`) to match the Arthanomy brand, avoiding a "spreadsheet" look.
