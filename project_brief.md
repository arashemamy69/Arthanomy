# Project Brief: Arthanomy

## Overview
**Arthanomy** is a modern, Canadian-focused personal finance and investing platform. The platform is designed to educate users on financial freedom, offering lived investing experiences, market updates, and model portfolios. 

**Tagline:** *Invest Smarter. Build Wealth. Live Free.*

## Objectives
- Empower Canadians to take control of their financial future through accessible, high-quality education.
- Provide transparent, real-world examples of model portfolios (Classic, Growth, Income, Balanced).
- Deliver timely market commentary and evergreen financial articles.
- Build a community of like-minded investors through a newsletter subscription model.

## Tech Stack
The application is built using a modern, performant, and scalable frontend architecture:
- **Framework:** React 19 with Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 with custom theming (`ThemeProvider`)
- **Content Management:** Sanity CMS (Headless CMS integrated directly via `/studio` route)
- **Animations:** Motion (Framer Motion)
- **Data Visualization:** Recharts (used for interactive portfolio growth charts)
- **Icons:** Lucide React
- **Typography & Markdown:** `@tailwindcss/typography`, `react-markdown`, and `@portabletext/react`

## Core Features & Architecture

### 1. Public Facing Website
- **Dynamic Hero Section:** Features an animated, interactive area chart (built with Recharts) showcasing portfolio growth, alongside strong calls-to-action.
- **Model Portfolios:** Educational breakdown of different investing strategies (Classic, Growth, Income, Balanced) to help users understand asset allocation.
- **Latest Updates:** A feed of timely market commentary and portfolio adjustments, dynamically fetched from Sanity CMS.
- **Featured Articles:** Evergreen financial guides (e.g., TFSA/RRSP optimization, Couch Potato strategy) driven by the CMS.
- **Newsletter Integration:** A visually distinct, engaging sign-up form to capture user emails and build a community.

### 2. Content Management System (Sanity Studio)
- Integrated directly into the app under the `/studio` route.
- **Configured Schemas:**
  - `post`: For market updates and evergreen articles.
  - `author`: To manage content creators.
  - `topic` & `tag`: For categorizing and organizing content.
  - `blockContent`: Rich text editor configuration for article bodies.

### 3. UI/UX Design
- **Responsive & Accessible:** Mobile-first design principles utilizing Tailwind CSS.
- **Engaging Animations:** Scroll-triggered fade-ins and interactive hover states powered by Framer Motion.
- **Custom Theming:** A centralized `ThemeContext` that manages gradients, text colors, and hover states to ensure a cohesive brand identity across the application.

## Next Steps / Future Enhancements
- Connect the Sanity Studio to a live Sanity Project ID (currently using a placeholder/development ID).
- Wire up the newsletter subscription form to an email marketing service (e.g., Mailchimp, ConvertKit).
- Expand the model portfolios section with deeper, interactive drill-downs into specific ETF/stock allocations.
