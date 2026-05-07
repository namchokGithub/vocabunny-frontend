import {
  sectionsApi,
  type CreateSectionPayload,
  type GetSectionsParams,
  type Section,
  type UpdateSectionPayload,
} from "@/lib/api/content/sections";

export const sectionsService = {
  async getSections(params?: GetSectionsParams): Promise<Section[]> {
    const response = await sectionsApi.getSections(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getSectionById(id: string): Promise<Section> {
    const response = await sectionsApi.getSectionById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createSection(payload: CreateSectionPayload): Promise<Section> {
    const response = await sectionsApi.createSection(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateSection(
    id: string,
    payload: UpdateSectionPayload,
  ): Promise<Section> {
    const response = await sectionsApi.updateSection(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteSection(id: string) {
    const response = await sectionsApi.deleteSection(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
