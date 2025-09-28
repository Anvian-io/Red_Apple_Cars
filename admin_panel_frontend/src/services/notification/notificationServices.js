import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const getAllNotification = async (payload, router) => {
  const response = await apiClient.get("/notifications", { params: payload });
  return handleApiResponse(response, router);
};