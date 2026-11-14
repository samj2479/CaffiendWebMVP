export type AnalyticsChoice = "unknown" | "allowed" | "declined";

// The PG precheck privacy draft describes a site without optional analytics.
export const SITE_ANALYTICS_ENABLED = false;
export const ANALYTICS_ID = "G-H84L1G1Y80";
export const ANALYTICS_CHOICE_KEY = "caffiend-analytics-consent-v1";
const CHOICE_EVENT = "caffiend:analytics-consent";
let memoryChoice: AnalyticsChoice = "unknown";
let memoryOnly = false;

export function isAnalyticsPage(pathname: string): boolean {
  return !/^\/(?:en\/)?(?:order|admin|policies|terms|privacy|refund|review\/policies)(?:\/|$)/.test(pathname);
}

export function getAnalyticsChoice(): AnalyticsChoice {
  if (typeof window === "undefined") return "unknown";
  if (memoryOnly) return memoryChoice;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CHOICE_KEY);
    return value === "allowed" || value === "declined" ? value : "unknown";
  } catch { return memoryChoice; }
}

export function getServerAnalyticsChoice(): AnalyticsChoice { return "unknown"; }

/** Google's measurement-disable flag also stops a tag already loaded on this page. */
export function setAnalyticsMeasurementEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  const scope = window as unknown as Record<string, unknown>;
  scope[`ga-disable-${ANALYTICS_ID}`] = !(SITE_ANALYTICS_ENABLED && enabled && isAnalyticsPage(window.location.pathname));
}

/** Only GA cookies on this host are cleared; order/language/game storage is untouched. */
export function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie.split(";").map(part => part.trim().split("=", 1)[0])
    .filter(name => name === "_ga" || name.startsWith("_ga_"));
  const host = window.location.hostname;
  for (const name of names) {
    const expiry = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    document.cookie = expiry;
    document.cookie = `${expiry}; domain=${host}`;
    document.cookie = `${expiry}; domain=.${host}`;
  }
}

export function saveAnalyticsChoice(choice: Exclude<AnalyticsChoice, "unknown">): void {
  // Apply withdrawal before notifying React or any other listener.
  setAnalyticsMeasurementEnabled(choice === "allowed");
  if (!SITE_ANALYTICS_ENABLED) return;
  if (choice === "declined") clearAnalyticsCookies();
  memoryChoice = choice;
  try {
    window.localStorage.setItem(ANALYTICS_CHOICE_KEY, choice);
    memoryOnly = false;
  } catch { memoryOnly = true; }
  window.dispatchEvent(new Event(CHOICE_EVENT));
}

export function subscribeToAnalyticsChoice(onChange: () => void): () => void {
  if (!SITE_ANALYTICS_ENABLED) return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ANALYTICS_CHOICE_KEY && event.key !== null) return;
    memoryChoice = "unknown";
    memoryOnly = false;
    const choice = getAnalyticsChoice();
    setAnalyticsMeasurementEnabled(choice === "allowed");
    if (choice !== "allowed") clearAnalyticsCookies();
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHOICE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHOICE_EVENT, onChange);
  };
}
