const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const pageDir = path.join(root, "shopify-ga4-tracking");
const html = fs.readFileSync(path.join(pageDir, "index.html"), "utf8");
const canonical = "https://whichadgotsale.com/shopify-ga4-tracking";

test("the guide has one heading and consistent canonical metadata", () => {
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1);
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
  assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`));
  const article = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(article["@type"], "TechArticle");
  assert.equal(article.mainEntityOfPage, canonical);
  assert.equal(article.headline, html.match(/<h1>(.*?)<\/h1>/)[1]);
  assert.ok(html.includes(`<time datetime="${article.dateModified}">`));
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const entry = sitemap.match(/<url>\s*<loc>https:\/\/whichadgotsale\.com\/shopify-ga4-tracking<\/loc>([\s\S]*?)<\/url>/)[1];
  assert.ok(entry.includes(`<lastmod>${article.dateModified}</lastmod>`));
});

test("local assets, internal links and fragment targets exist", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate fragment IDs");
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^https?:/.test(url)) continue;
    const [relativePath, fragment] = url.split("#");
    const target = relativePath ? path.resolve(pageDir, relativePath) : path.join(pageDir, "index.html");
    assert.ok(fs.existsSync(target), `missing local target: ${url}`);
    if (fragment) {
      const targetHtml = fs.statSync(target).isDirectory()
        ? fs.readFileSync(path.join(target, "index.html"), "utf8")
        : fs.readFileSync(target, "utf8");
      assert.ok(targetHtml.includes(`id="${fragment}"`), `missing fragment: ${url}`);
    }
  }
});

test("the illustrative purchase value excludes separately stated shipping and tax", () => {
  const example = JSON.parse(html.match(/<code id="purchase-example">([\s\S]*?)<\/code>/)[1]);
  const itemValue = example.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  assert.equal(example.value, itemValue);
  assert.notEqual(example.value, itemValue + example.shipping + example.tax);
  assert.ok(example.transaction_id.startsWith("QA-EXAMPLE-"));
  assert.ok(html.includes("Never reuse the example transaction ID in live events."));
  assert.ok(!/<script\b[^>]*>[\s\S]*?gtag\s*\(\s*["']event["']\s*,\s*["']purchase["']/.test(html));
});

test("the guide cites primary references and contains no replacement characters", () => {
  for (const url of [
    "https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup",
    "https://support.google.com/analytics/answer/7201382?hl=en",
    "https://developers.google.com/analytics/devguides/collection/ga4/ecommerce",
    "https://support.google.com/analytics/answer/12313109?hl=en"
  ]) {
    assert.ok(html.includes(`href="${url}"`), `missing reference: ${url}`);
  }
  assert.ok(!html.includes("\uFFFD"), "invalid UTF-8 replacement character");
});
