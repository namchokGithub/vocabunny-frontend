import { env } from "@/lib/constants/env";
import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";

interface RequestOptions extends RequestInit {
  query?: QueryParams;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
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

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { query, headers, ...init } = options;
  const response = await fetch(buildUrl(path, query), {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

async function mock<T>(data: T, delay = 250): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}

export const apiClient = {
  baseUrl: env.apiBaseUrl,
  request,
  get: <T>(path: string, query?: RequestOptions["query"]) =>
    request<ApiResponse<T>>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    request<ApiResponse<T>>(path, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<ApiResponse<T>>(path, {
      method: "PUT",
      body: JSON.stringify(body ?? {}),
    }),
  delete: <T>(path: string) =>
    request<ApiResponse<T>>(path, { method: "DELETE" }),
  mock,
};
