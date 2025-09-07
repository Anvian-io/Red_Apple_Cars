// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const createOrUpdateFeedback = async (formData, router) => {
  const response = await apiClient.post("/feedback/create", formData);
  return handleApiResponse(response, router);
};

export const getAllFeedback = async (payload, router) => {
  const response = await apiClient.get("/feedback/all", { params: payload });
  return handleApiResponse(response, router);
};

export const getFeedback = async (id, router) => {
  const response = await apiClient.get(`/feedback/${id}`);
  return handleApiResponse(response, router);
};

export const deleteFeedback = async (feedbackId, router) => {
  const response = await apiClient.delete(`/feedback/${feedbackId}`);
  return handleApiResponse(response, router);
};