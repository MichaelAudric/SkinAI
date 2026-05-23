import { apiFetch } from "./api";

export function login(data: { email: string; password: string }) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
