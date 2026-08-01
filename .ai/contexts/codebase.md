# Codebase Index & Context

This file indexes the files and folders of the repository to provide context for AI agents and terminal systems.

## Project Overview

- **Name**: Kwaku Travel / Learn German Ghana
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Firebase Admin (SDK).
- **Core Feature**: Travel packages, study abroad consultation, visa guidance, and integration with the Sedifex booking system.

## Directory Structure & Key Files

### Root Configuration
- [package.json](file:///c:/Users/user/Desktop/kwakuasamoah/package.json): Lists dependencies (Next.js 16, Tailwind v4, etc.) and npm scripts.
- [tsconfig.json](file:///c:/Users/user/Desktop/kwakuasamoah/tsconfig.json): TypeScript compiler configurations.
- [postcss.config.mjs](file:///c:/Users/user/Desktop/kwakuasamoah/postcss.config.mjs) & [tailwind.config.ts](file:///c:/Users/user/Desktop/kwakuasamoah/next.config.ts): Build and CSS configurations.
- [AGENTS.md](file:///c:/Users/user/Desktop/kwakuasamoah/AGENTS.md): Global agent guidelines.

### Source Files (`src/`)

#### App Pages & Routing (`src/app/`)
- [src/app/layout.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/layout.tsx): Root layout with metadata and common shell (Header, Footer, WhatsAppFloat, MailingListCta).
- [src/app/page.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/page.tsx): Homepage listing services, travel features, and testimonials.
- [src/app/globals.css](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/globals.css): Global Tailwind and layout stylesheet.
- [src/app/book/page.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/book/page.tsx): Booking page using the `BookingForm`.
- [src/app/api/integration-bookings/route.ts](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/api/integration-bookings/route.ts): Server-side endpoint proxying requests securely to Sedifex API.
- Individual sub-pages: `about`, `blog`, `contact`, `countries`, `faq`, `gallery`, `packages`, `payment`, `privacy`, `promo`, `resources`, `services`, `terms`.

#### Components (`src/components/`)
- [booking-form.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/booking-form.tsx): Form component for capturing user information and booking preferences.
- [header.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/header.tsx) & [footer.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/footer.tsx): Navigation and footer.
- [whatsapp-float.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/whatsapp-float.tsx): Quick chat float widget.
- [package-card.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/package-card.tsx): Card display component for travel/study packages.

#### Libraries & Utilities (`src/lib/`)
- [booking-validation.js](file:///c:/Users/user/Desktop/kwakuasamoah/src/lib/booking-validation.js): Validation rules for forms.
- [booking-validation.test.mjs](file:///c:/Users/user/Desktop/kwakuasamoah/src/lib/booking-validation.test.mjs): Unit tests for booking validations.
- [data.ts](file:///c:/Users/user/Desktop/kwakuasamoah/src/lib/data.ts): Core static data provider (services, packages, FAQs, blogs).
- [site-config.ts](file:///c:/Users/user/Desktop/kwakuasamoah/src/lib/site-config.ts): Website metadata config.
