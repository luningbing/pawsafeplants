# Email capture Worker

Cloudflare Worker + D1 endpoint for the free TikTok Shop Shipping Adjustment Scanner.

Stored fields are limited to the submitted email, optional newsletter consent, source, consent version, timestamps and submission count. IP addresses, user agents and settlement data are not stored. Worker observability is disabled to reduce accidental personal-data logging.

## Deploy

```sh
npm install
npm run db:apply:remote
npm run deploy
```

The browser client only sends requests from `whichadgotsale.com`, `www.whichadgotsale.com`, `localhost`, or `127.0.0.1` origins.

## Inspect without exposing full addresses

```sh
npx wrangler d1 execute whichadgotsale-leads --remote --command \
  "SELECT COUNT(*) AS leads, SUM(newsletter_opt_in) AS newsletter_opt_ins FROM leads;"
```

## Delete a requested address

Use a bound parameter or the Cloudflare D1 console. Do not paste user emails into shared logs or analytics events.
