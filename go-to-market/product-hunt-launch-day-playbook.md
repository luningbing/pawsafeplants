# Product Hunt Launch Day Playbook

Launch page:
https://www.producthunt.com/products/whichadgotsale?launch=whichadgotsale

Launch window:
June 29, 2026 at 12:01am PT / 03:01pm GMT+8 for 24 hours.

Goal:
Get useful traffic and comments without paying for promotion, spamming communities, or making claims the product cannot prove yet.

## Morning Before Launch

- Confirm the live site opens: https://whichadgotsale.com/
- Confirm the manual setup page opens: https://whichadgotsale.com/manual-url-setup-service/
- Confirm GA4 Realtime is visible in the correct property.
- Do not buy paid Product Hunt or directory promotion.
- Do not change the core Product Hunt promise unless the published page has a typo.

## First 30 Minutes After Launch

1. Open the Product Hunt launch page.
2. Check whether the tagline is still:
   `Find which ad sent the sale from your ad links`
3. Post or verify the first comment.
4. Open GA4 Realtime.
5. Click the live site from Product Hunt once.
6. Confirm the visit appears as referral traffic or direct traffic within Realtime.

## First Comment

```text
I built WhichAdGotSale for small ecommerce sellers who do not have a full tracking setup yet.

The first problem is usually not a complex dashboard. It is a messy ad landing page URL, missing UTM fields, or a campaign name that never shows up clearly in GA4.

The tool keeps the first workflow simple:

1. Paste your product or landing page URL.
2. Choose the ad channel.
3. Add readable campaign and creative labels.
4. Copy the final URL into the ad platform.
5. Click it once and check GA4 Realtime.

It also includes a bulk builder, existing URL checker, and GA4 checklist. It runs in the browser and does not upload entered URLs or campaign names to a server.

I would love feedback from Shopify, WooCommerce, TikTok, Meta, Google Ads, affiliate, and AppLovin operators.
```

## Share Copy

Short:

```text
I just launched WhichAdGotSale on Product Hunt.

It is a free tool for small ecommerce sellers to build clean ad landing page URLs and check traffic in GA4 before spending more on ads.

Would love feedback:
[Product Hunt link]
```

More practical:

```text
Small ecommerce ads often fail the boring setup step: the final landing page URL has messy or missing tracking parameters.

I launched WhichAdGotSale to make that first check easier:
- build a clean ad URL
- keep UTMs readable
- check the URL before launch
- verify the visit in GA4 Realtime

Free, no login:
[Product Hunt link]
```

Chinese:

```text
我今天在 Product Hunt 上线了 WhichAdGotSale。

它是给小白独立站卖家/运营用的免费工具：生成广告落地页 URL，保持 UTM 可读，然后在 GA4 Realtime 里检查流量有没有进来。

不是复杂归因系统，先解决投放前最容易踩坑的链接配置问题。

[Product Hunt link]
```

## GA4 Events To Watch

- `builder_cta_clicked`
- `sample_builder_loaded`
- `campaign_url_copied`
- `ad_url_qa_checker_cta_clicked`
- `ad_url_qa_checked`
- `tracking_qa_report_downloaded`
- `manual_setup_cta_clicked`
- `manual_setup_email_clicked`

Decision rules:

- Visitors but no builder events: make the first CTA and headline clearer.
- Builder/sample events but no copy/download events: improve the form defaults or result panel.
- Copy/download events but no manual setup clicks: keep free tool as acquisition and add one stronger service CTA.
- Manual setup clicks but no email: make the intake brief shorter and add a clearer price/turnaround line.

## No-Spam Backlink Moves

Do:

- Reply to real Product Hunt comments with useful setup advice.
- Share the launch from your own account.
- Submit to free directories only when the listing is clearly allowed.
- Post educational content that teaches GA4/UTM setup and includes the tool as the example.

Do not:

- Post generic comment links under unrelated threads.
- Buy directory boosts before there is referral proof.
- Promise perfect attribution.
- Mention private/internal company materials.
- Hide redirects, cloak ad destinations, or frame URL encoding as concealment.

## If Someone Asks For Help

Use this reply:

```text
Happy to help. The free path is:

1. Paste your landing page URL into the builder.
2. Choose your channel.
3. Use a readable campaign name first.
4. Click the generated URL yourself.
5. Check GA4 Realtime.

If you want me to configure one store and one to two channels for you, the starter manual setup is USD 99:
https://whichadgotsale.com/manual-url-setup-service/
```

## End Of Day Review

Record:

- Product Hunt upvotes:
- Product Hunt comments:
- GA4 users from Product Hunt:
- Total users:
- Top event:
- Manual setup page views:
- Email clicks:
- Any real user questions:
- One copy change to test tomorrow:
