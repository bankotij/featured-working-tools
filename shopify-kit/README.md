# FIELDWORK set builder

Original Shopify theme section by Jay Bankoti / Bankoti Studio.

This package contains a configurable Online Store 2.0 section. The accompanying FIELDWORK storefront is an original portfolio concept with a local bag. It does not use real store IDs or collect orders.

## Install in a development theme

1. Copy `sections/fieldwork-set-builder.liquid` into the theme's `sections` directory.
2. Copy the two files in `assets` into the theme's `assets` directory.
3. Open the theme editor, add the **Fieldwork set builder** section, and choose a product in each block.
4. Mark the main product required. Choose which optional products are selected initially.
5. Set the heading and description. The theme reads product titles, variant IDs, prices, images and availability from the selected Shopify products.
6. Run the acceptance checks below in the intended theme and market before publishing it to a live store.

## What happens when the customer adds a set

The section creates one `items` array and sends it to the locale-aware `cart/add.js` endpoint. Each selected variant has quantity one and the same `_fieldwork_set` property. A successful response sends the customer to the theme's cart. The cart and checkout remain Shopify's responsibility.

The property identifies related lines; it is not a native bundle product. This package does not create bundle inventory, enforce pricing across separate items, apply a discount or support subscriptions/selling plans. Merchants needing those behaviours should implement the corresponding Shopify bundle, discount and selling-plan capabilities.

## Failure behaviour

- Unavailable variants are disabled, and an unavailable required product disables the action.
- The server remains authoritative for stock and price. A displayed available item can sell out before submission.
- The pending flag prevents a second click while the first request is running.
- Non-success responses show the provider's readable description when supplied.
- A network failure can leave an uncertain result. The section exposes a cart-review link and does not automatically retry.
- Variant selection updates the image when the variant has its own image.

## Acceptance checks

Test empty product blocks, an all-sold-out optional product, a sold-out required product, multiple variants, duplicate product blocks, zero-priced items, currency formatting, mobile layout, keyboard navigation, theme-editor section reload, fast double-clicks, an HTTP 422 stock response and a lost response. Verify the final cart lines and properties in a Shopify development store. Review compatibility with the theme's cart customisations and installed discount apps.

The local storefront and cart adapter can be exercised independently. Store installation and live checkout validation have not been performed as part of this portfolio build.

## References

- [Shopify Ajax Cart API](https://shopify.dev/docs/api/ajax/reference/cart)
- [Shopify section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)
- [Shopify Liquid variant object](https://shopify.dev/docs/api/liquid/objects/variant)
