import {
  tagsApi,
  type CreateTagPayload,
  type GetTagsParams,
  type Tag,
  type UpdateTagPayload,
} from "@/lib/api/content/tags";
import type { PaginatedResult } from "@/types/pagination";

export const tagsService = {
  async getTags(params?: GetTagsParams): Promise<PaginatedResult<Tag>> {
    const response = await tagsApi.getTags(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getTagById(id: string): Promise<Tag> {
    const response = await tagsApi.getTagById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createTag(payload: CreateTagPayload): Promise<Tag> {
    const response = await tagsApi.createTag(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateTag(id: string, payload: UpdateTagPayload): Promise<Tag> {
    const response = await tagsApi.updateTag(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteTag(id: string) {
    const response = await tagsApi.deleteTag(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
