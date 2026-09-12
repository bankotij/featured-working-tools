# Bankoti working tools

Original working software for four role-specific LinkedIn profiles.

- Jay: JSON Contract Desk — local schema inference, TypeScript output and candidate validation.
- Kamlesh: Interview Desk — editable role brief, interview questions, evidence and handoff notes. Browser storage is opt-in.
- Ankur: Second Order Notebook — completed-order CSV analysis with explicit maturity windows and exclusions.
- Kushagra: Email Preflight — static HTML checks, destination inventory, restricted rendering and review-note export.
- FIELDWORK: collection, product, bag and build routes backed by a Netlify commerce function.

## Run

Node 22 or newer. `npm run dev` starts http://127.0.0.1:8771. No external packages are needed for local execution. `npm test` runs the logic and server-boundary checks. Netlify CLI deploys `public` and `netlify/functions` using netlify.toml.

Production requires CART_SIGNING_KEY, a randomly generated secret of at least 32 characters, configured in Netlify Functions. Never place it in public files. The local server generates an ephemeral key; restarting it clears existing cart signatures.

## Shopify

Set SHOPIFY_STORE_DOMAIN to the merchant's exact .myshopify.com domain. Tokenless Storefront API access is attempted when no token is supplied. If the merchant requires private Storefront access, configure SHOPIFY_STOREFRONT_TOKEN as a Functions secret. The server sends it only to the configured Shopify store. Never use an Admin API token here.

The adapter uses Storefront API 2026-07 products, cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove and checkoutUrl. Before enabling a merchant store, verify the intended catalogue, market/currency, product route, invalid/sold-out variant, quantity update, cart expiry, checkout handoff and response-loss behaviour against that store. The independent catalogue does not take orders or payments. Live Shopify integration remains unverified until a merchant store is connected.

## Commerce boundary

The independent cart is a signed HttpOnly SameSite cookie, seven-day lifetime. Its item IDs and quantities are not encrypted and contain no personal details. Prices and availability come from the server catalogue. Limits are five units per variant. Sequential updates are supported; simultaneous changes from separate tabs may overwrite each other. A production merchant adapter delegates cart and inventory authority to Shopify.

The API supports GET /api/commerce/products, GET /api/commerce/status, GET /api/commerce/cart, and POST /api/commerce/cart with add/update/remove/clear actions. Writes require JSON, reject foreign Origin headers and validate quantities. These public catalogue endpoints contain no private customer data.

## Sources and photography

Shopify API: https://shopify.dev/docs/api/storefront/latest
Netlify Functions: https://docs.netlify.com/build/functions/overview/

Canvas image: Aedrian Salazar, https://unsplash.com/photos/black-and-brown-leather-backpack-4UIks1_2A-g
Black and tan images: Wiser by the Mile, https://unsplash.com/@wiserbythemile
Licence: https://unsplash.com/license

Images are credited reference photography. The depicted makers are not clients or partners. The practice order file contains fictional IDs and amounts, not client results. No generative image or model service is used by these applications.
