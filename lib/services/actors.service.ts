import { actorsApi } from "@/lib/api/actors";

export const actorsService = {
  getActors: () => actorsApi.getActors(),
};
