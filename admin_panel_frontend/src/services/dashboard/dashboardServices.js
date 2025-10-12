// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const getDashboardData = async (payload, router) => {
  const response = await apiClient.get("/dashboard/data", { params: payload });
  return handleApiResponse(response, router);
};
export const getRecentSoldCars = async (payload, router) => {
  const response = await apiClient.get("/dashboard/recent-sold", { params: payload });
  return handleApiResponse(response, router);
};
