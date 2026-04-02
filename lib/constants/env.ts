export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api",
  enableMockAuth: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false",
};
