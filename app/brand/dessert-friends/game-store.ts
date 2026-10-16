"use client";

import {
  STORAGE_KEY,
  createGameSession,
  isValidSession,
  parseGameHash,
  resultHash,
  type DessertId,
  type GameSession,
} from "@/lib/dessert-friends/model";

export type GameRoute =
  | { page: "home" | "quiz" | "collection" }
  | { page: "result"; id: DessertId };

type Snapshot = { ready: boolean; session: GameSession | null; route: GameRoute };
const serverSnapshot: Snapshot = { ready: false, session: null, route: { page: "home" } };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function readSession(): GameSession | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return isValidSession(value) ? value : null;
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getGameSnapshot(): Snapshot {
  if (!snapshot) {
    const route = parseGameHash(window.location.hash) as GameRoute;
    const saved = readSession();
    snapshot = {
      ready: true,
      session: saved || (route.page === "quiz" ? createGameSession() : null),
      route,
    };
  }
  return snapshot;
}

export function getServerGameSnapshot() {
  return serverSnapshot;
}

function onHashChange() {
  const current = getGameSnapshot();
  const route = parseGameHash(window.location.hash) as GameRoute;
  snapshot = {
    ...current,
    route,
    session: current.session || (route.page === "quiz" ? createGameSession() : null),
  };
  emit();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  const current = getGameSnapshot();
  snapshot = { ...current, session: readSession() };
  if (current.route.page === "quiz" && !snapshot.session) snapshot.session = createGameSession();
  emit();
}

export function subscribeGame(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    window.addEventListener("storage", onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      window.removeEventListener("storage", onStorage);
    }
  };
}

function routeHash(route: GameRoute) {
  return route.page === "result" ? resultHash(route.id) : `#${route.page}`;
}

export function saveGameSession(session: GameSession) {
  snapshot = { ...getGameSnapshot(), session };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The game remains playable when browser storage is unavailable.
  }
  emit();
}

export function navigateGame(route: GameRoute) {
  const current = getGameSnapshot();
  snapshot = { ...current, route };
  const next = window.location.pathname + window.location.search + routeHash(route);
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.pushState(window.history.state, "", next);
  }
  emit();
}

export function restoreGameHash() {
  // Next's language switch keeps this client module alive while changing the path.
  // Retain the current game screen without changing the shared language provider.
  const current = getGameSnapshot();
  if (window.location.hash) {
    const explicit = parseGameHash(window.location.hash) as GameRoute;
    if (routeHash(explicit) !== routeHash(current.route)) onHashChange();
  } else if (current.route.page !== "home") {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search + routeHash(current.route),
    );
  }
}
