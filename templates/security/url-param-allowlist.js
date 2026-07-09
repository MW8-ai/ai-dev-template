// Same-origin, same-directory allowlist for a URL-shaped query param that
// selects a file to fetch (e.g. ?catalog=, ?config=, ?theme=, ?doc=).
// UMD: works as a browser <script src> (exposes window.resolveScopedParam)
// and as Node require() for unit testing. No deps beyond the URL global,
// which both environments provide.
//
// WHY THIS SHAPE, NOT A DENYLIST:
// A denylist ("reject if it contains :, //, or ..") has to predict every
// way a URL parser might normalize a string before deciding whether to
// trust it — and it loses that game. Confirmed bypasses of an earlier,
// denylist version of this exact pattern (see docs/06-standards/SECURITY.md
// for the case study): a leading space or tab before an absolute URL, and
// "/\evil.com/..." (slash-backslash), both normalize to a cross-origin
// fetch in real browsers despite failing every denylist string check.
// Percent-encoded ".." traversal also normalizes past a raw ".." check.
//
// The fix is to stop predicting normalization and start checking the
// result: let the same WHATWG URL parser the browser uses resolve the
// string, then check the *resolved* origin and path — properties, not
// string shapes.
//
// Returns the resolved pathname+search (a same-origin path confined to
// `scopeDir`, matching `extensionPattern`) to fetch, or null if the raw
// value is absent or resolves outside that scope. Callers MUST fall back
// to a known-safe default when this returns null — never fetch the raw
// value, and never treat null as "use the raw value anyway."
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { resolveScopedParam: factory() };
  } else {
    root.resolveScopedParam = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  /**
   * @param {string} raw - the raw query-param value (untrusted)
   * @param {object} config
   * @param {string} config.scopeDir - directory the resolved path must stay
   *   under, relative to baseHref, e.g. "catalogs/" or "themes/". Must end
   *   in "/".
   * @param {RegExp} [config.extensionPattern] - pathname must match this,
   *   e.g. /\.json$/i. Defaults to /\.json$/i.
   * @param {object} [opts] - override the environment-derived values below;
   *   required in Node, where document/location don't exist.
   * @param {string} [opts.baseHref] - defaults to document.baseURI
   * @param {string} [opts.originHref] - defaults to location.origin
   * @returns {string|null}
   */
  return function resolveScopedParam(raw, config, opts) {
    if (!raw || typeof raw !== 'string') return null;
    if (!config || !config.scopeDir || config.scopeDir.slice(-1) !== '/') {
      throw new Error('resolveScopedParam: config.scopeDir is required and must end in "/"');
    }
    var extensionPattern = config.extensionPattern || /\.json$/i;
    opts = opts || {};
    var baseHref = opts.baseHref || (typeof document !== 'undefined' ? document.baseURI : null);
    var originHref = opts.originHref || (typeof location !== 'undefined' ? location.origin : null);
    if (!baseHref || !originHref) return null;

    var candidate = raw.indexOf('/') !== -1 ? raw : config.scopeDir + raw;

    var url;
    try {
      url = new URL(candidate, baseHref);
    } catch (e) {
      return null;
    }

    // 1. same origin, after the parser's own normalization (backslashes,
    //    leading whitespace, percent-encoding, etc. are already resolved)
    if (url.origin !== originHref) return null;

    // 2. confined to scopeDir under THIS app's deployed base (not the
    //    domain root — apps deployed at a subpath, e.g. GitHub Pages
    //    project sites, must not accidentally allow the domain root's
    //    version of scopeDir). The trailing slash on scopeDir means this
    //    is a path-segment-boundary check, not a raw string-prefix check:
    //    "catalogs-evil/" cannot satisfy a "catalogs/" prefix that includes
    //    the slash.
    var scopeRoot = new URL(config.scopeDir, baseHref);
    if (url.pathname.indexOf(scopeRoot.pathname) !== 0) return null;

    // 3. shape check, on the resolved pathname — not the raw input, so
    //    query strings and fragments can't be used to smuggle a fake
    //    extension past this check in either direction.
    if (!extensionPattern.test(url.pathname)) return null;

    return url.pathname + url.search;
  };

});
