export type OrderStatus = "pending" | "cooking" | "completed" | "cancelled";

export interface SubmittedOrder {
  id: string;
  items: { name: string; quantity: number; price: number; temp: string | null; note: string }[];
  total: number;
  time: string;
  status: OrderStatus;
}

const ORDER_HISTORY_PREFIX = "caffiend-order-history-";
const seoulDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type HistoryStorage = Pick<Storage, "length" | "key" | "getItem" | "setItem" | "removeItem">;

function readOrderTime(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)(Z|[+-]\d{2}:\d{2})?$/.exec(value);
  if (!match) return null;
  const [ , day, time, zone ] = match;
  // Older saved dates may have no offset. A time without a date cannot be aged.
  const local = new Date(`${day}T${time}Z`);
  if (!Number.isFinite(local.valueOf()) || local.toISOString().slice(0, 16) !== `${day}T${time.slice(0, 5)}`) return null;
  const received = new Date(`${day}T${time}${zone ?? "+09:00"}`);
  return Number.isFinite(received.valueOf()) ? received : null;
}

function getCurrentHistory(value: unknown, now: Date): SubmittedOrder[] {
  if (!Array.isArray(value)) return [];
  const today = seoulDate.format(now);
  return value.filter((entry): entry is SubmittedOrder => {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" ||
        !Array.isArray(entry.items) || !Number.isFinite(entry.total)) return false;
    const received = readOrderTime(entry.time);
    return received !== null && received <= now && seoulDate.format(received) === today;
  });
}

function getBrowserStorage(): HistoryStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function pruneBrowserOrderHistory(
  table?: string,
  storage: HistoryStorage | null = getBrowserStorage(),
  now = new Date(),
): SubmittedOrder[] {
  if (!storage) return [];
  let keys: string[];
  try {
    keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
      .filter((key): key is string => key?.startsWith(ORDER_HISTORY_PREFIX) === true);
  } catch {
    return [];
  }

  let activeHistory: SubmittedOrder[] = [];
  for (const key of keys) {
    try {
      const raw = storage.getItem(key);
      if (raw === null) continue;
      let saved: unknown;
      try { saved = JSON.parse(raw); } catch { saved = null; }
      const current = getCurrentHistory(saved, now);
      if (key === `${ORDER_HISTORY_PREFIX}${table}`) activeHistory = current;
      if (current.length === 0) {
        storage.removeItem(key);
      } else if (Array.isArray(saved) && current.length !== saved.length) {
        storage.setItem(key, JSON.stringify(current));
      }
    } catch {
      // Storage may be unavailable or full. Do not interfere with table ordering.
    }
  }
  return activeHistory;
}

export function saveBrowserOrderHistory(table: string, orders: SubmittedOrder[]): void {
  const storage = getBrowserStorage();
  if (!storage) return;
  const key = `${ORDER_HISTORY_PREFIX}${table}`;
  const current = getCurrentHistory(orders, new Date());
  try {
    if (current.length > 0) {
      storage.setItem(key, JSON.stringify(current));
    } else {
      storage.removeItem(key);
    }
  } catch {
    // An accepted QR order is still valid if the browser rejects local storage.
  }
}
