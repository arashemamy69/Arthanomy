# Arthanomy Sanity Schema Documentation

This document explains the structure of the Sanity CMS schema used in the Arthanomy project, the logic behind its design, and how the frontend consumes this data.

## Overview

The Sanity Studio is located in the `/studio` directory. It is treated as a separate project from the main React website. The website fetches data from Sanity's API using the `@sanity/client` package.

We currently have several document types defined in our schema:
1.  **Article** (`article`)
2.  **Page** (`page`)
3.  **Series** (`series`)
4.  **Author** (`author`)
5.  **Portfolio** (`portfolio`)
6.  **Topic** (`topic`)
7.  **Tag** (`tag`)

---

## 1. Portfolio Schema (`portfolio.ts`)

**Purpose:** 
Manages the model portfolios displayed on the `/portfolios` page and their detailed simulation pages.

**Fields:**
*   **`title` (String):** The name of the portfolio (e.g., "Balanced Portfolio").
*   **`slug` (Slug):** The URL identifier (e.g., `balanced-portfolio`).
*   **`description` (Text):** A detailed description of the portfolio's strategy.
*   **`type` (Reference to `portfolioType` or String):** Categorizes the portfolio (e.g., Growth, Balanced, Income). *Note: This can be implemented as a simple string dropdown or a reference to a dedicated `portfolioType` document to allow dynamic creation of new types, similar to tags.*
*   **`holdings` (Array of Objects):** The actual assets in the portfolio.
    *   **`ticker` (String):** The stock or ETF symbol. **Must use `.TO` for Canadian TSX tickers** (e.g., `XIC.TO`, `HYLD.TO`) so the `yahoo-finance2` backend can fetch the data.
    *   **`weight` (Number):** The percentage allocation (e.g., 15). The total weights should sum to 100.

---

## 2. Article Schema (`article.ts`)

**Purpose:** 
This schema is designed for evergreen educational content, deep dives, and strategy guides. It is meant to feel like a clean, distraction-free publishing platform (similar to Substack).

**Fields:**
*   **`title` (String):** The main headline of the article.
*   **`slug` (Slug):** The URL-friendly version of the title. Used by the frontend to generate the route `/articles/:slug`.
*   **`topic` (Reference):** Categorizes the article into a main topic (e.g., Education, Stocks and ETFs).
*   **`tags` (Array of References):** Allows for granular tagging.
*   **`author` (Reference):** Links to an `author` document to display the author's bio and photo.
*   **`series` (Reference):** Links to a `series` document if the article is part of a multi-part guide.
*   **`partNumber` (Number):** The order of the article within a series.
*   **`mainImage` (Image):** The hero image for the article.
*   **`publishedAt` (Datetime):** The date the article was published.
*   **`body` (Portable Text / Array):** The rich-text editor. Includes custom block types like `pullStat`, `table`, and `arthTable` (editorial tables).

---

## 3. Page Schema (`page.ts`)

**Purpose:**
This schema is designed for "Singleton" or static pages like About, Privacy Policy, and Disclaimer.

**Fields:**
*   **`title` (String):** The name of the page.
*   **`slug` (Slug):** The URL identifier (e.g., `about`, `privacy`, `disclaimer`).
*   **`subtitle` (String):** A short tagline.
*   **`body` (Portable Text / Array):** The main content of the page.

---

## How the Frontend Consumes the Schema

The logic bridging the CMS and the website lives in `src/lib/sanity.ts`.

1.  **GROQ Queries:** We use Sanity's query language (GROQ) to fetch data. For example, to get a specific portfolio, we query: `*[_type == "portfolio" && slug.current == $slug][0]`.
2.  **TypeScript Interfaces:** We define interfaces (e.g., `SanityPortfolio`, `SanityArticle`) in `sanity.ts` that exactly match the shape of the data returned by Sanity. This ensures our React components know exactly what fields are available.
3.  **Rendering:** In components like `ArticlePage.tsx`, we use the `<PortableText value={data.body} components={portableTextComponents} />` component to safely convert Sanity's block content into beautifully styled HTML elements using our custom renderers.

## Modifying the Schema (Reconciliation Process)

Because the Studio and the Website are decoupled, modifying the schema requires a two-step reconciliation process.

**If you add or modify a field in Sanity Studio (e.g., adding an `authorBio` field):**

1.  **Update the Studio:** You write the code in `/studio/schemaTypes/...`, test it locally, and run `npx sanity deploy` to push the changes to the live CMS.
2.  **Communicate with the AI:** Tell the AI Assistant: *"I added a new string field called `authorBio` to the `article` schema."*
3.  **Update the Frontend:** The AI will then:
    *   Update the GROQ queries in `src/lib/sanity.ts` to fetch the new field.
    *   Update the TypeScript interface to include the new property.
    *   Update the React component to actually render the new data on the screen.

This process ensures that the database structure and the frontend UI remain perfectly in sync without breaking the application logic.
