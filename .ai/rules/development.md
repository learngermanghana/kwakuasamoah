# Development Rules

This file outlines the rules and conventions for developers and agent systems operating in this repository.

1. **Next.js & React Conventions**:
   - Keep page-level rendering logic clean. Avoid putting massive business logic directly in `page.tsx` where possible.
   - Use server actions or API routes for sensitive data transactions.
   
2. **Style System**:
   - Utilize TailwindCSS v4 classes.
   - Keep custom utility classes in `src/app/globals.css` if necessary.

3. **Sedifex Booking**:
   - Ensure all payload parameters sent to Sedifex API are validated through `booking-validation.js`.
