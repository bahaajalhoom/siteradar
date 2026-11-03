const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api-siteradar.apps.taqat.academy"
    : "http://127.0.0.1:3000")
).replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(apiUrl(path), { ...init, credentials: "include" });
}
