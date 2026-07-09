# Security Patterns

Reusable, tested code patterns for recurring security-boundary problems. Unlike the rest of `templates/`, these are working implementations, not fill-in-the-blanks documents — copy the `.js` and `.test.mjs` file together, adapt the config, keep the tests.

## `url-param-allowlist.js`

**Use when:** a URL query parameter selects a file to fetch client-side — `?catalog=`, `?config=`, `?theme=`, `?doc=`, anything of that shape.

**The problem it solves:** the naive version of this is `param.includes("/") ? param : "somedir/" + param`, maybe with a few string checks bolted on (`startsWith("http")`, `includes("..")`). That's a denylist, and denylists lose against URL parsers. This exact pattern shipped once as a denylist, was reviewed before merge, and was found to have real bypasses verified against actual browser `URL` resolution — not hypothetical:

| Payload | Denylist said | Browser actually resolved to |
|---|---|---|
| `/\evil.com/x.json` | passes (no `//`, no `:`, no `..`) | cross-origin fetch to `evil.com` |
| `" https://evil.com/x.json"` (leading space) | passes | cross-origin fetch to `evil.com` |
| `"\thttps://evil.com/x.json"` (leading tab) | passes | cross-origin fetch to `evil.com` |
| `%2e%2e/%2e%2e/secrets.json` | passes (no literal `..`) | same-origin, but escapes the intended directory |

Browsers normalize backslashes to slashes and strip leading whitespace *before* resolving a URL. A string check written today can't out-predict that normalization — it's checking the wrong thing.

**The fix:** stop pattern-matching, start parsing. Let `new URL(candidate, baseHref)` do the same normalization the browser will do anyway, then check the *resolved* `origin` and `pathname` — same-origin, confined to a specific directory, correct file extension. Three property checks on a parsed result, not a growing list of string checks trying to anticipate every encoding trick.

**What it will not do:** protect you from a same-origin file that's legitimately reachable but semantically wrong for this use — the allowlist is about *origin and directory confinement*, not content validation. If the fetched file itself is untrusted (it is — it came from a query param), still escape everything from it before writing it into the DOM. See the "Input Validation" section of [`docs/06-standards/SECURITY.md`](../../docs/06-standards/SECURITY.md).

**Adopting it:**

```js
const { resolveScopedParam } = require('./url-param-allowlist.js');
// or <script src="url-param-allowlist.js"></script> in a browser — exposes window.resolveScopedParam

const raw = new URLSearchParams(location.search).get('catalog');
const path = resolveScopedParam(raw, { scopeDir: 'catalogs/', extensionPattern: /\.json$/i })
  || 'catalogs/default.json'; // always have a same-origin fallback for the null case
fetch(path).then(...);
```

Run `node url-param-allowlist.test.mjs` after adapting `scopeDir`/`extensionPattern` — keep every bypass case, they're the reason this file exists instead of a three-line denylist.

**Provenance:** this pattern was extracted from a real fix in [MW8-ai/architecture-anatomy](https://github.com/MW8-ai/architecture-anatomy) (`lib/resolve-catalog-param.js`, v1.8.1) after a security review of that repo caught a DOM XSS whose root cause was exactly the denylist described above.
