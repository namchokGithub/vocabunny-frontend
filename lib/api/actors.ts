import type { Actor } from "@/types";
import { apiClient } from "./client";

const actors: Actor[] = [
  { id: "ACT-001", name: "Lina M.", actorType: "user", status: "online", country: "TH" },
  { id: "ACT-002", name: "Guest-7H2P", actorType: "guest", status: "offline", country: "VN" },
  { id: "ACT-003", name: "Noah R.", actorType: "user", status: "suspended", country: "US" },
];

export const actorsApi = {
  getActors: () => apiClient.mock(actors),
};
