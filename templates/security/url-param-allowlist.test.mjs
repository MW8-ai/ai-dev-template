// Run: node templates/security/url-param-allowlist.test.mjs
// Zero-dependency assertions. Copy this alongside url-param-allowlist.js
// when you adopt the pattern — keep the bypass cases, they're the reason
// this exists in the first place.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { resolveScopedParam } = require("./url-param-allowlist.js");

// Node has no document/location globals; pass them explicitly to match what
// the browser supplies at runtime (document.baseURI / location.origin).
// This baseHref deliberately includes a subpath — GitHub Pages project
// sites and similar deployments are not served from the domain root, and
// the confinement check must be verified against that reality, not assumed.
const opts = {
  baseHref: "https://example.github.io/my-app/index.html",
  originHref: "https://example.github.io",
};
const config = { scopeDir: "catalogs/", extensionPattern: /\.json$/i };
const resolve = (raw) => resolveScopedParam(raw, config, opts);

let pass = 0; const t = (name, fn) => { fn(); console.log("ok -", name); pass++; };

// --- obvious rejections ---

t("absolute https URL is rejected", () => {
  assert.equal(resolve("https://evil.com/x.json"), null);
});

t("javascript: scheme is rejected", () => {
  assert.equal(resolve("javascript:alert(1)"), null);
});

t("protocol-relative URL is rejected", () => {
  assert.equal(resolve("//evil.com/x.json"), null);
});

t("empty/missing param resolves to null (caller applies its own default)", () => {
  assert.equal(resolve(""), null);
  assert.equal(resolve(null), null);
  assert.equal(resolve(undefined), null);
});

// --- normalization bypasses that defeat a denylist (verified against real
// browser URL resolution — see docs/06-standards/SECURITY.md case study) ---

t("slash-backslash is rejected (browsers resolve this to a cross-origin URL)", () => {
  assert.equal(resolve("/\\evil.com/x.json"), null);
});

t("leading space before an absolute URL is rejected", () => {
  assert.equal(resolve(" https://evil.com/x.json"), null);
});

t("leading tab before an absolute URL is rejected", () => {
  assert.equal(resolve("\thttps://evil.com/x.json"), null);
});

t("percent-encoded traversal is rejected", () => {
  assert.equal(resolve("%2e%2e/%2e%2e/secrets.json"), null);
});

t("plain traversal is rejected", () => {
  assert.equal(resolve("../../../etc/passwd"), null);
  assert.equal(resolve("catalogs/../../../etc/passwd"), null);
});

t("suffix-origin trick is rejected", () => {
  assert.equal(resolve("https://example.github.io.evil.com/x.json"), null);
});

// --- confinement boundary (subpath deployment + sibling directory) ---

t("domain-root scopeDir does not satisfy a subpath deployment's confinement", () => {
  assert.equal(resolve("/catalogs/evil.json"), null);
});

t("sibling directory is rejected, not string-prefix-matched", () => {
  assert.equal(resolve("../catalogs-evil/x.json"), null);
  assert.equal(resolve("/my-app/catalogs-evil/x.json"), null);
});

t("bare scopeDir request with no trailing content is rejected", () => {
  assert.equal(resolve("catalogs"), null);
});

// --- extension check is on the resolved pathname ---

t("query string after the extension is fine", () => {
  assert.equal(resolve("foo.json?a=.txt"), "/my-app/catalogs/foo.json?a=.txt");
});

t("fragment is stripped, still valid", () => {
  assert.equal(resolve("foo.json#.txt"), "/my-app/catalogs/foo.json");
});

t("extension in the query does not count", () => {
  assert.equal(resolve("evil.txt?x=.json"), null);
});

// --- must still work ---

t("bare filename resolves under scopeDir", () => {
  assert.equal(resolve("foo.json"), "/my-app/catalogs/foo.json");
});

t("same-origin relative path under scopeDir is used", () => {
  assert.equal(resolve("catalogs/nested/foo.json"), "/my-app/catalogs/nested/foo.json");
});

t("throws if scopeDir is misconfigured without a trailing slash", () => {
  assert.throws(() => resolveScopedParam("foo.json", { scopeDir: "catalogs" }, opts));
});

console.log(`\n${pass} passed`);
