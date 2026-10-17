# ENA Coach-style bus booking website

Responsive React + Vite mobile-first booking demo inspired by the supplied screenshots. Includes an orange slide-out menu, English/Kiswahili toggle, Home, one-way/round-trip selection, 47 county selectors, nearest listed booking-stage recommendation, vehicle types, ticket lookup/print, Supabase authentication, account page, help and floating chat panel.

## Important notes
- This is an independent prototype, not an official ENA Coach product.
- The stage list is illustrative, not a verified list of ENA Coach offices. Replace `src/data.js` stages with operator-confirmed offices, routes and coordinates before real bookings. If a county has no listed stage, the app estimates the nearest listed stage using approximate county-centre coordinates; it does not use live GPS.
- Shuttle is configured for 10 seats; Luxo for 13; Luxury defaults to 49 seats as a placeholder because the exact capacity was not provided. Confirm and edit `src/data.js` before launch. A steering-wheel icon is shown on each vehicle option.
- Search results are demo choices, not live inventory. Fare calculation, payment, live schedules, seat map, SMS, and official operator APIs are not connected.

## Run locally
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your Supabase project URL and publishable/anon key.
4. Run `npm run dev`.

## Supabase setup
1. Create a project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication URL configuration, allow your local URL (usually `http://localhost:5173`) and deployed Vercel URL.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` and Vercel Project Settings → Environment Variables.
5. Never expose a service-role key in frontend code.

RLS restricts booking reads/inserts to the signed-in user. The ticket lookup RPC requires both ticket number and mobile number. For production, place lookup behind an Edge Function with rate limiting to prevent guessing.

## GitHub + Vercel
1. Push this folder to a GitHub repository.
2. Import that repository into Vercel.
3. Add the two environment variables above.
4. Deploy. `vercel.json` rewrites browser routes to the Vite app.

## Before production
Confirm actual stage directory, vehicle seat capacity, schedules, fares, route inventory, company branding permission, terms/privacy, support contacts, ticket validation, and payment flow with the operator. Configure email verification and add monitoring/rate limiting.
