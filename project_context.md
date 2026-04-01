# Arthanomy: Project Context & Decisions Log

This document serves as a summary of the work completed and decisions made during the development of the Arthanomy platform. It is intended to provide context for future development sessions or handoffs.

## Project Overview
- **Name:** Arthanomy
- **Purpose:** A Canadian personal finance and investing website aimed at educating users on financial freedom, model portfolios, and market updates.
- **Tagline:** *Invest Smarter. Build Wealth. Live Free.*

## Technical Stack & Decisions
- **Frontend Framework:** React 19 with Vite. Chosen for modern, fast development and optimized builds.
- **Routing:** React Router v7 (`react-router-dom`).
  - Public routes: `/` (Home), `/post/:slug` (Article pages).
  - Admin/CMS route: `/studio/*` (Embedded Sanity Studio).
- **Styling:** Tailwind CSS v4.
  - A custom `ThemeContext` is implemented to manage global themes (gradients, text colors, hover states) consistently across the app.
- **Animations:** `motion/react` (Framer Motion) for scroll-triggered fade-ins and interactive UI elements.
- **Data Visualization:** `recharts` is used in the Hero section to display an interactive, gradient-filled area chart representing portfolio growth.
- **Icons:** `lucide-react` for clean, consistent iconography.
- **Content Rendering:** `@portabletext/react` and `react-markdown` for rendering rich text from the CMS.

## Content Management System (Sanity)
- **Integration:** Sanity Studio is embedded directly into the application at the `/studio` route, allowing content management without leaving the app.
- **Schemas Implemented:**
  - `post`: For market updates and featured articles.
  - `author`: To manage content creators.
  - `topic` & `tag`: For content categorization.
  - `blockContent`: Rich text editor configuration.
- **Current State:** The studio is configured but currently uses a placeholder `SANITY_PROJECT_ID` ('9yc0h8hx'). This needs to be updated with the production project ID.

## UI Components Built
- **Hero Section:** Features a dynamic portfolio growth chart and strong calls-to-action.
- **Model Portfolios:** Displays 4 core strategies (Classic, Growth, Income, Balanced) using a grid layout with hover effects.
- **Latest Updates & Featured Articles:** Grid layouts designed to fetch and display content from Sanity CMS (currently includes fallback dummy data while CMS is being populated).
- **Newsletter:** A visually distinct sign-up section with gradient backgrounds (UI only, needs backend integration).

## Next Steps & Pending Items
1. **Sanity CMS Connection:** Update `sanity.config.ts` with the final Sanity Project ID and Dataset.
2. **Newsletter Integration:** Connect the newsletter form in `HomePage.tsx` to an email service provider API (e.g., Mailchimp, ConvertKit).
3. **Content Population:** Create actual authors, topics, and posts in the Sanity Studio to replace the fallback data in the UI.
4. **Portfolio Drill-downs:** Expand the Model Portfolios section to link to detailed breakdown pages for each strategy.
