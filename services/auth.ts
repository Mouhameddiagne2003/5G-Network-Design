// services/auth.ts
export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Erreur de connexion");
  return res.json();
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    ...(options.headers || {}),
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers });
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Erreur d'inscription");
  return res.json();
}
