import {
  contentOrderNosApi,
  type ContentOrderNosLastResponse,
} from "@/lib/api/content/order-nos";

export const contentOrderNosService = {
  async getLastContentOrderNos(): Promise<ContentOrderNosLastResponse> {
    const response = await contentOrderNosApi.getLastContentOrderNos();

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
