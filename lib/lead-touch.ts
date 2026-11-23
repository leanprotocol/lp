/* Where a visit came from, for the lead_channel field in TeleCRM.

   components/first-touch.tsx saves the last outside source of a visit in a
   small first-party cookie: the site that sent the visitor, the page they
   landed on, and whether the link was an ad or a tagged campaign link. The
   cookie is shared by www, forms and the other leanprotocol.in subdomains, so
   a visitor who arrives from Google on an article and fills in the form on
   forms.leanprotocol.in is still known to have come from a search.

   The lead routes use it for one thing only: to tell "Organic search" apart
   from the rest of "Organic / Direct". Ads and tagged links keep the channel
   they already had.

   Pure ASCII file. */

export const TOUCH_COOKIE = "lp_touch";
export const ORGANIC_SEARCH = "Organic search";
export const ORGANIC_DIRECT = "Organic / Direct";

export type Touch = { ref: string; landing: string; tagged: boolean };

const SEARCH_HOSTS: RegExp[] = [
  /^(www\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/,
  /googlequicksearchbox$/, // the Google app on Android
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)search\.yahoo\.(com|co\.[a-z]{2})$/,
  /(^|\.)yandex\.(com|ru|com\.tr)$/,
  /(^|\.)ecosia\.org$/,
  /^search\.brave\.com$/,
  /(^|\.)startpage\.com$/,
  /(^|\.)baidu\.com$/,
];

/* Accepts a full address or a bare host name. */
function hostOf(value: string | null | undefined): string {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return "";
  if (!v.includes("/")) return v.slice(0, 200);
  try {
    return new URL(v).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isSearchEngine(value: string | null | undefined): boolean {
  const host = hostOf(value);
  return host !== "" && SEARCH_HOSTS.some((re) => re.test(host));
}

/* Reads the cookie from a request's Cookie header. Null when it is missing or unreadable. */
export function readTouch(cookieHeader: string | null | undefined): Touch | null {
  try {
    for (const part of String(cookieHeader ?? "").split(";")) {
      const i = part.indexOf("=");
      if (i < 0 || part.slice(0, i).trim() !== TOUCH_COOKIE) continue;
      const raw = part.slice(i + 1).trim();
      if (!raw || raw.length > 1000) return null;
      const data = JSON.parse(decodeURIComponent(raw));
      if (!data || typeof data !== "object") return null;
      return {
        ref: typeof data.r === "string" ? data.r.slice(0, 200).toLowerCase() : "",
        landing: typeof data.l === "string" ? data.l.slice(0, 200) : "",
        tagged: data.p === 1,
      };
    }
  } catch {
    /* a damaged cookie is treated as no cookie */
  }
  return null;
}

/* The channel of a lead that has no ad click ID and no utm_source of its own.
   touch: the saved source of the visit, when there is one.
   referrer: the page the form was opened from, used when there is no cookie. */
export function unpaidChannel(touch: Touch | null, referrer?: string | null): string {
  if (touch) {
    if (touch.tagged) return ORGANIC_DIRECT; // the visit came through an ad or a tagged link
    return isSearchEngine(touch.ref) ? ORGANIC_SEARCH : ORGANIC_DIRECT;
  }
  return isSearchEngine(referrer) ? ORGANIC_SEARCH : ORGANIC_DIRECT;
}
