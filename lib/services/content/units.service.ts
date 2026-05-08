import {
  unitsApi,
  type CreateUnitPayload,
  type GetUnitsParams,
  type Unit,
  type UpdateUnitPayload,
} from "@/lib/api/content/units";

export const unitsService = {
  async getUnits(params?: GetUnitsParams): Promise<Unit[]> {
    const response = await unitsApi.getUnits(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getUnitById(id: string): Promise<Unit> {
    const response = await unitsApi.getUnitById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createUnit(payload: CreateUnitPayload): Promise<Unit> {
    const response = await unitsApi.createUnit(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateUnit(id: string, payload: UpdateUnitPayload): Promise<Unit> {
    const response = await unitsApi.updateUnit(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteUnit(id: string) {
    const response = await unitsApi.deleteUnit(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
