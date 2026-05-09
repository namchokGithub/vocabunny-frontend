import { getAccessToken, getRefreshToken } from "./token";

export function isAuthenticated(): boolean {
  return !!getAccessToken() || !!getRefreshToken();
}
