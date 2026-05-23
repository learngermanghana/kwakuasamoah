This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Sedifex booking integration.

The booking page at `/book` pulls service options from Sedifex and submits booking requests through the server-only route at `/api/integration-bookings`.

Required environment variables:

```bash
SEDIFEX_API_BASE_URL=https://us-central1-sedifex-web.cloudfunctions.net
SEDIFEX_STORE_ID=your_store_id
SEDIFEX_INTEGRATION_API_KEY=your_store_or_master_integration_key
```

Optional fallback:

```bash
BOOKING_DEFAULT_SERVICE_ID=service_id_to_use_when_no_service_is_selected
```

The Sedifex key is only used inside the Next.js API route. Do not expose it with a `NEXT_PUBLIC_` prefix.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
