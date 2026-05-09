import { env } from "@/lib/constants/env";

import { getAccessToken } from "@/lib/auth/token";

import type { QueryParams } from "@/types/http";

interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: QueryParams;

  body?: unknown;
}

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

  return response.json();
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
