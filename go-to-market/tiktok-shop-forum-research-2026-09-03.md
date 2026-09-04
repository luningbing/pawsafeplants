# TikTok Shop Forum Research — 2026-09-03

Purpose: collect seller language and product signals without promotional posting. Sources are forum statements, not verified market-wide facts.

## Current evidence

| Theme | Seller language / observed problem | Source | Confidence |
| --- | --- | --- | --- |
| Full fee stack is unclear | “is that the complete set of fees” | [Shopify Community: TikTok-related fees](https://community.shopify.com/t/tiktok-related-fees/364651) | Medium |
| Channel and order attribution is unreliable | “cannot find consistent Tiktok shop source_name and/or Tiktok shop order id” | [Shopify Community: order source tracking](https://community.shopify.com/t/shopify-order-source-tracking-for-tiktok-shop/592449) | Medium |
| Synced order data can be incomplete | “there are a bunch of missing values” | [Shopify Community: missing order values](https://community.shopify.com/t/missing-values-when-orders-come-from-tiktok-shop/343414) | Medium |
| Ad spend can hide product-level losses | “My GMV Max ads are burning through budget daily without generating a single sale” | [Reddit: high-ticket product economics](https://www.reddit.com/r/TikTokShopSellers/comments/1vwva4h/how_does_selling_highticket_products_on_a_tiktok/) | Low — one seller |
| Creator economics include more than commission | Seller compares commission-only, retainer + commission, pay-per-video, bonuses and sample costs | [Reddit: UGC/agency pricing](https://www.reddit.com/r/TikTokShopSellers/comments/1w4zv89/tiktok_shop_sellers_can_a_ugccontent_agency_work/) | Low — one operator |
| Cross-border payout and fulfillment setup is opaque | Seller asks how payouts reach a foreign bank “without funds getting held for months” | [Reddit: selling into the US](https://www.reddit.com/r/TikTokShopSellers/comments/1vz17io/how_do_you_sell_on_tiktok_shop_from_outside_the_us/) | Low — adjacent segment |

## Product implications

1. Keep the first-order calculator centered on profit after creator commission, ads, shipping and returns; this is supported by multiple independent discussions.
2. Preserve `Unavailable` when order source, settlement linkage or required costs are missing. The forum evidence supports the existing no-inference rule.
3. Treat sample cost, agency retainer and creator/content attribution as candidates, not committed features. Wait for direct replies or repeated independent evidence.
4. Do not broaden the MVP into entity, tax, bank or compliance guidance; that is a separate cross-border setup problem.

## Live research conversation

- Account: `Murky-Cut-4204`
- Public reply: https://www.reddit.com/r/TikTokShopSellers/comments/1w4zv89/comment/p7k9x5i/
- Method: no product name, no external link, no claim of seller experience.
- Question asked: which metric is optimized when choosing commission versus retainer, and whether creator/content can be tied reliably to orders and refunds.
- Status: posted; awaiting response.

## Decision gate

Do not add sample-cost or agency-pricing fields until either:

- the thread author answers with a concrete operating workflow, or
- two additional independent sellers describe the same cost/attribution need.

