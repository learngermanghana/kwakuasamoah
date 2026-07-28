# Sedifex Skill Setup

This file provides documentation on how the Sedifex booking flow functions and should be managed.

## Process Workflow

1. User visits `/book`.
2. Frontend loads static service configs and renders the `BookingForm`.
3. User submits the form.
4. Client validates data and posts to `/api/integration-bookings`.
5. API route loads server environment variables:
   - `SEDIFEX_API_BASE_URL`
   - `SEDIFEX_STORE_ID`
   - `SEDIFEX_INTEGRATION_API_KEY`
6. API route maps the fields and forwards them to the Sedifex API.
