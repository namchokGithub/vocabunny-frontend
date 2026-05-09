import { clearAuthState } from "./auth";

export function logout(): void {
  clearAuthState();
  window.location.href = "/login";
}
