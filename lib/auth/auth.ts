import { env } from "@/lib/constants/env";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./token";
import type { ApiResponse } from "@/types/api";
import type { StaffRole, StaffSession } from "@/types";

const SESSION_KEY = "vb_session";
const AUTH_STATE_EVENT = "vb:auth-state-changed";
const BO_LOGIN_PATH = "/api/v1/bo/auth/login/password";
const BO_REFRESH_PATH = "/api/v1/bo/auth/refresh";

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponseBody {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user: {
    id: string;
    email: string;
    display_name?: string;
    name?: string;
    role?: string;
    roles?: Array<{ name: string }>;
  };
}

function mapRole(apiRole: string | undefined): StaffRole {
  const map: Record<string, StaffRole> = {
    ADMIN: "admin",
    CONTENT_ADMIN: "content_manager",
    MODERATOR: "operator",
  };
  return (apiRole && map[apiRole]) || "operator";
}

function emitAuthStateChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  }
}

function toStaffSession(user: AuthResponseBody["user"]): StaffSession {
  const primaryRole = user.role ?? user.roles?.[0]?.name;

  return {
    id: user.id,
    name: user.display_name ?? user.name ?? user.email,
    email: user.email,
    role: mapRole(primaryRole),
  };
}

function saveSession(session: StaffSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

function persistAuthResponse(body: AuthResponseBody) {
  setAccessToken(body.access_token);

  if (body.refresh_token) {
    setRefreshToken(body.refresh_token);
  }

  const session = toStaffSession(body.user);
  saveSession(session);
  emitAuthStateChanged();

  return session;
}

function extractAuthPayload(
  body: ApiResponse<AuthResponseBody> | Partial<AuthResponseBody> | null | undefined,
) {
  if (!body) {
    return null;
  }

  if ("success" in body) {
    return body.success ? body.data : null;
  }

  return body;
}

async function parseAuthResponse(response: Response) {
  const body = (await response.json().catch(() => ({}))) as
    | ApiResponse<AuthResponseBody>
    | (Partial<AuthResponseBody> & {
        message?: string;
      });

  if (!response.ok) {
    const message =
      "error" in body ? body.error.message : "message" in body ? body.message : undefined;

    throw new Error(message ?? "Authentication request failed.");
  }

  const payload = extractAuthPayload(body);

  if (!payload?.access_token || !payload.user) {
    throw new Error("Authentication response is missing required fields.");
  }

  return payload as AuthResponseBody;
}

export function getSession(): StaffSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StaffSession) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function clearAuthState(): void {
  clearTokens();
  clearSession();
  emitAuthStateChanged();
}

export async function login(credentials: LoginCredentials): Promise<StaffSession> {
  const res = await fetch(`${env.apiBaseUrl}${BO_LOGIN_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email_or_username: credentials.email,
      password: credentials.password,
    }),
  });

  const body = await parseAuthResponse(res).catch((error: Error) => {
    throw new Error(error.message || "Login failed. Please try again.");
  });

  return persistAuthResponse(body);
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await fetch(`${env.apiBaseUrl}${BO_REFRESH_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    clearAuthState();
    throw new Error("Session expired. Please sign in again.");
  }

  const body = (await response.json().catch(() => ({}))) as
    | ApiResponse<AuthResponseBody>
    | (Partial<AuthResponseBody> & {
        message?: string;
      });

  if (!response.ok) {
    const message =
      "error" in body ? body.error.message : "message" in body ? body.message : undefined;

    throw new Error(message ?? "Unable to refresh session.");
  }

  const payload = extractAuthPayload(body);

  if (!payload?.access_token) {
    throw new Error("Refresh response is missing an access token.");
  }

  setAccessToken(payload.access_token);

  if (payload.refresh_token) {
    setRefreshToken(payload.refresh_token);
  }

  if (payload.user) {
    saveSession(toStaffSession(payload.user));
  }

  emitAuthStateChanged();

  return payload.access_token;
}

export async function restoreSession(): Promise<StaffSession | null> {
  const session = getSession();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && session) {
    return session;
  }

  if (!refreshToken) {
    clearAuthState();
    return null;
  }

  try {
    await refreshAccessToken();
    return getSession();
  } catch {
    clearAuthState();
    return null;
  }
}

export { AUTH_STATE_EVENT };
