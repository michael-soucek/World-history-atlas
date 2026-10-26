/**
 * Tells Bing, Yandex and the other IndexNow engines that pages changed, so
 * they recrawl now instead of whenever they next pass by. Run after a deploy:
 *
 *   node scripts/indexnow.mjs            # every URL in the live sitemap
 *   node scripts/indexnow.mjs /path ...  # just these paths
 *
 * The key file public/e18a87770191350c019bf0ba56c74b4a.txt proves we own the site.
 */
const HOST = "www.bordersoftime.com";
const KEY = "e18a87770191350c019bf0ba56c74b4a";

const paths = process.argv.slice(2);
const urls = paths.length
  ? paths.map((p) => `https://${HOST}${p}`)
  : [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URLs → HTTP ${res.status}`);
