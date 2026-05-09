import { env } from "@/lib/constants/env";

import { clearAuthState, refreshAccessToken } from "@/lib/auth/auth";
import { getAccessToken } from "@/lib/auth/token";

import type { QueryParams } from "@/types/http";

interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: QueryParams;
  body?: unknown;
  retryOnUnauthorized?: boolean;
}

let refreshPromise: Promise<string> | null = null;

function buildUrl(path: string, query?: QueryParams) {
  const url = new URL(path, env.apiBaseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

async function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(buildUrl(path, options?.query), {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options?.headers,
    },

    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (
    response.status === 401 &&
    options?.retryOnUnauthorized !== false &&
    path !== "/api/v1/bo/auth/login/password" &&
    path !== "/api/v1/bo/auth/refresh"
  ) {
    try {
      const nextToken = await refreshAccessTokenOnce();

      return request<T>(path, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${nextToken}`,
        },
        retryOnUnauthorized: false,
      });
    } catch {
      clearAuthState();
      redirectToLogin();
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  const body = await parseResponseBody<unknown>(response);

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String(body.message)
        : "Request failed.";

    if (response.status === 401) {
      clearAuthState();
      redirectToLogin();
    }

    throw new Error(message);
  }

  return body as T;
}

async function mock<T>(data: T, delay = 250): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}

export const apiClient = {
  get: <T>(path: string, query?: QueryParams) =>
    request<T>(path, {
      method: "GET",
      query,
    }),

  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
    }),

  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),

  mock,
};
