---
name: sedifex-integration
description: Guidelines and patterns for working with Sedifex booking integrations, API endpoints, validations, and gallery resources.
---

# Sedifex Booking Integration Skill

This skill provides guidelines and patterns for working with Sedifex booking integrations in this repository.

## Key Files & Paths

- API endpoint: [src/app/api/integration-bookings/route.ts](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/api/integration-bookings/route.ts)
- Validation utility: [src/lib/booking-validation.js](file:///c:/Users/user/Desktop/kwakuasamoah/src/lib/booking-validation.js)
- Booking Page: [src/app/book/page.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/book/page.tsx)
- Booking Form Component: [src/components/booking-form.tsx](file:///c:/Users/user/Desktop/kwakuasamoah/src/components/booking-form.tsx)

## Guidelines

1. **Environment Variables**:
   - `SEDIFEX_API_BASE_URL`: Base API URL (e.g., Firebase Cloud Functions endpoint).
   - `SEDIFEX_STORE_ID`: The unique Store ID.
   - `SEDIFEX_INTEGRATION_API_KEY`: API Key for server-side requests. Must NOT be exposed in the frontend.

2. **Validation**:
   - Always run the tests in `src/lib/booking-validation.test.mjs` using `npm test` when modifying the booking validation logic.
