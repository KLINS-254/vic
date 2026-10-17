# ENA Coach Booking Website

A responsive, mobile-first booking flow inspired by the provided ENA Coach screenshots. Static front end suitable for GitHub + Vercel.

## Included
- ENA-style orange/white home page and trip search
- One-way and round-trip selection, date validation, swap origin/destination
- Search result cards with sample schedules, fares, ratings, and filters
- Interactive seat selection, booked seats, boarding/drop-off point validation
- Passenger details form
- M-Pesa / Airtel Money method selection and payment-request status dialog
- Local demo booking history, saved in browser localStorage
- Installable web-app manifest

## Deploy to Vercel
1. Create a GitHub repository and upload all files/folders in this project.
2. Import the repository in Vercel.
3. Framework preset: **Other**. Build command: leave blank. Output directory: `.`.
4. Deploy.

## Important before real bookings
This project is a front-end prototype. The bus schedules, availability, ratings, seat status, and prices are sample data and must be replaced with verified ENA Coach inventory or an authorized booking API. The payment flow **does not send an STK Push or charge money**. To accept real payments, create a secure server-side endpoint (never expose provider secrets in browser JavaScript) and integrate Safaricom Daraja STK Push and/or an authorized Airtel Money API. Verify provider callbacks server-side before confirming a ticket. Add a database and reservation-locking to prevent two customers booking the same seat. Publish accurate privacy, refund, and terms pages before collecting real passenger data.

## Local preview
Open `index.html` in a browser, or serve the folder with any static HTTP server. For production, use HTTPS.
