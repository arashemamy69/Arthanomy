# Arthanomy Sanity Schema Documentation

This document explains the structure of the Sanity CMS schema used in the Arthanomy project, the logic behind its design, and how the frontend consumes this data.

## Overview

The Sanity Studio is located in the `/studio` directory. It is treated as a separate project from the main React website. The website fetches data from Sanity's API using the `@sanity/client` package.

We currently have two main document types defined in our schema:
1.  **Article** (`/studio/schemaTypes/article.ts`)
2.  **Page** (`/studio/schemaTypes/page.ts`)

---

## 1. Article Schema (`article.ts`)

**Purpose:** 
This schema is designed for evergreen educational content, deep dives, and strategy guides. It is meant to feel like a clean, distraction-free publishing platform (similar to Substack).

**Fields:**
*   **`title` (String):** The main headline of the article.
*   **`slug` (Slug):** The URL-friendly version of the title (e.g., `my-first-article`). Used by the frontend to generate the route `/post/my-first-article`.
*   **`topic` (String/Dropdown):** Categorizes the article. We use a predefined list (Education, Market Update, Mindset, Portfolio Strategy) to maintain consistency and allow for future filtering on the frontend.
*   **`readTime` (String):** A manual override for read time (e.g., "5 min read"). *Note: The frontend currently calculates this automatically based on word count, but this field allows editors to override it if needed.*
*   **`mainImage` (Image):** The hero image for the article. It supports "hotspot" cropping, allowing editors to choose the focal point of the image so it looks good on both mobile and desktop.
*   **`publishedAt` (Datetime):** The date the article was published. Used for sorting articles chronologically on the frontend.
*   **`body` (Portable Text / Array):** The rich-text editor. 
    *   *Logic:* Instead of saving raw HTML or Markdown, Sanity saves rich text as an array of blocks (Portable Text). This is highly secure and allows the React frontend to render the text exactly how we want using our own Tailwind CSS classes (via `@portabletext/react`). We restricted the formatting options (H2, H3, Quotes, Bullets, Bold, Italic) to ensure the design remains clean and consistent.

---

## 2. Page Schema (`page.ts`)

**Purpose:**
This schema is designed for "Singleton" or static pages like About, Privacy Policy, and Disclaimer. Instead of hardcoding text into the React components, this allows non-technical users to update legal text or company info directly from the CMS.

**Fields:**
*   **`title` (String):** The name of the page (e.g., "About Arthanomy").
*   **`slug` (Slug):** The URL identifier. For these pages, the slug must exactly match what the frontend expects (e.g., `about`, `privacy`, `disclaimer`).
*   **`subtitle` (String):** A short tagline that appears below the main heading.
*   **`body` (Portable Text / Array):** The main content of the page, using the same clean rich-text editor as the Article schema.

---

## How the Frontend Consumes the Schema

The logic bridging the CMS and the website lives in `src/lib/sanity.ts`.

1.  **GROQ Queries:** We use Sanity's query language (GROQ) to fetch data. For example, to get a specific page, we query: `*[_type == "page" && slug.current == $slug][0]`.
2.  **TypeScript Interfaces:** We define interfaces (e.g., `SanityArticle`, `SanityPage`) in `sanity.ts` that exactly match the shape of the data returned by Sanity. This ensures our React components know exactly what fields are available.
3.  **Rendering:** In components like `ArticlePage.tsx` or `AboutPage.tsx`, we use the `<PortableText value={data.body} />` component to safely convert Sanity's block content into beautifully styled HTML elements.

## Modifying the Schema (Reconciliation Process)

Because the Studio and the Website are decoupled, modifying the schema requires a two-step reconciliation process.

**If you add or modify a field in Sanity Studio (e.g., adding an `authorBio` field):**

1.  **Update the Studio:** You write the code in `/studio/schemaTypes/...`, test it locally, and run `npx sanity deploy` to push the changes to the live CMS.
2.  **Communicate with the AI:** Tell the AI Assistant: *"I added a new string field called `authorBio` to the `article` schema."*
3.  **Update the Frontend:** The AI will then:
    *   Update the GROQ queries in `src/lib/sanity.ts` to fetch the new `authorBio` field.
    *   Update the TypeScript interface (`SanityArticle`) to include `authorBio: string`.
    *   Update the React component (e.g., `ArticlePage.tsx`) to actually render the new data on the screen.

This process ensures that the database structure and the frontend UI remain perfectly in sync without breaking the application logic.
