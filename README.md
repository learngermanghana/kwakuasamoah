# Kwaku Lotteryy Travel & Consultation Platform

A premium, high-performance web application built for Kwaku Lotteryy's travel and relocation consultation business. The platform seamlessly blends rich content delivery with an integrated booking flow and a custom Admin CRM.

---

## 🏗️ Architecture & Tech Stack

This project is built on modern web standards to ensure lightning-fast performance, maintainability, and a premium user experience.

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & React 19.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) using a custom, high-contrast design system centered around "Npontu Green" and "Npontu Gold."
- **Data Engine:** A lightweight, localized JSON database (`src/data/db.json`) serving as the source of truth for blogs, services, gallery items, and global settings. Access is fully typed via `src/lib/data.ts`.
- **Booking Integration:** Native [Cal.com](https://cal.com/) embed integration wrapped in a custom global provider to handle modal triggers anywhere on the site.
- **Admin CRM:** A built-in, authenticated management dashboard (`/admin`) for tracking bookings, writing blogs, updating packages, and modifying site settings dynamically.

---

## 🔍 What Already Existed

Before the recent system-wide overhaul, the platform laid down a strong structural foundation:
- **Core Architecture:** The Next.js 16 App Router configuration and basic page routing (`/about`, `/services`, `/contact`, `/countries`, etc.).
- **Data Layer:** The initial JSON-backed data models and helper functions to load static content.
- **Admin Framework:** The foundational layout for the Admin CRM, including basic authentication routing and the dashboard shell.
- **Base Aesthetics:** The initial brand color palettes and typography rules.

---

## 🚀 What Was Done (Recent Upgrades)

A comprehensive UX/UI redesign and feature expansion was implemented to elevate the platform to a premium standard, inspired by modern conversion-focused designs (including structural references from the Dionne portfolio).

### 1. Global Cal.com Booking Integration
- Extracted the Cal.com modal logic and implemented a `CalBookingProvider` across the entire application layout.
- Any element with the `data-cal-modal` attribute instantly triggers the customized 15-minute consultation booking popup (`/kwakulotteryy/15min`).

### 2. Premium Footer Redesign
- Rebuilt the footer from the ground up to feature a sleek, multi-column layout.
- Introduced an interactive, 4-column Instagram-style image gallery with seamless hover overlays and custom inline SVG social icons.

### 3. Dynamic Admin Settings
- Upgraded the `/admin/settings` panel to allow non-technical administrators (Kwaku) to easily swap out the footer gallery images and update the Cal.com scheduling link without touching code.

### 4. Header & Navigation Refactoring
- **Submenu System:** Organized a cluttered navigation bar by grouping related links (Countries, Resources, FAQ, Blog) into a clean, interactive "Relocation Info" dropdown.
- **Mobile Drawer:** Refined the mobile hamburger menu with indented, nested link structures.
- **Security:** Removed public-facing Admin CRM buttons to ensure the dashboard remains completely stealth and accessible only via direct URL.

### 5. Homepage Overhaul
- Transformed `/page.tsx` into a highly dynamic, alternating light/dark themed landing page.
- Added a "Meet Kwaku" hero section, engaging trust metrics/statistics, and a new "Supported Destinations" grid to immediately highlight available country guides.
- Integrated a new interactive Destination Carousel for featured travel expeditions.

### 6. FAQ Page Redesign
- Upgraded the bare-bones FAQ placeholder into a fully interactive accordion layout, categorized by topics, complete with a branded dark hero header.

### 7. Build Stability & Type Safety
- Resolved Turbopack build constraints by replacing legacy `lucide-react` imports with optimized, inline SVG components.
- Hardened the database models and TypeScript constraints to ensure zero-error builds in production.

---

## 🛠️ Local Development

To run the platform locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Admin Access:** Navigate to `/admin/login` to access the CRM. (Ensure your environment variables for authentication are set up if applicable).
