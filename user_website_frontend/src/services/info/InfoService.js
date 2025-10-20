// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";


export const getAllInfo = async (payload, router) => {
  const response = await apiClient.get("/profile/web", { params: payload });
  return handleApiResponse(response, router);
};