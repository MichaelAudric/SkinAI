export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(`http://localhost:8000${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    let errorMsg = "API Error";
    try {
      const error = await res.json();
      errorMsg = error.detail || errorMsg;
    } catch {}

    throw new Error(errorMsg);
  }

  return res.json();
}
