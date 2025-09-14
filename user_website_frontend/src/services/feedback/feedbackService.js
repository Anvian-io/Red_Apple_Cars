// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";


export const getAllFeedback = async (payload, router) => {
  const response = await apiClient.get("/feedback/all", { params: payload });
  return handleApiResponse(response, router);
};