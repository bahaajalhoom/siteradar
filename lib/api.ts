const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(apiUrl(path), { ...init, credentials: "include" });
}
