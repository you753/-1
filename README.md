# NŪR Studio — Clothing Store Prototype

A bilingual (Arabic/English) clothing storefront prototype with a lightweight store admin experience.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Prototype features

- Arabic RTL and English LTR toggle.
- Responsive storefront, product categories, search, product sizes, and cart.
- Cart summary and demo checkout options: cash on delivery, card, and Apple Pay.
- Admin preview for adding, editing, and deleting products and viewing stock.
- Product catalog is saved in browser localStorage for this demo.

## Important

This is a front-end prototype. Checkout does not process payments or create real orders. Card and Apple Pay require a payment provider integration (for example, a provider available in the store's country), merchant onboarding, and server-side payment verification. Admin actions are not authenticated and localStorage is not a production database. Do not use this prototype to collect payment or customer data.
