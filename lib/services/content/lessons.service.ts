import {
  lessonsApi,
  type CreateLessonPayload,
  type GetLessonsParams,
  type Lesson,
  type UpdateLessonPayload,
} from "@/lib/api/content/lessons";

export const lessonsService = {
  async getLessons(params?: GetLessonsParams): Promise<Lesson[]> {
    const response = await lessonsApi.getLessons(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getLessonById(id: string): Promise<Lesson> {
    const response = await lessonsApi.getLessonById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createLesson(payload: CreateLessonPayload): Promise<Lesson> {
    const response = await lessonsApi.createLesson(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateLesson(
    id: string,
    payload: UpdateLessonPayload,
  ): Promise<Lesson> {
    const response = await lessonsApi.updateLesson(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteLesson(id: string) {
    const response = await lessonsApi.deleteLesson(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
