export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws",
  enableMockAuth: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false",
};
