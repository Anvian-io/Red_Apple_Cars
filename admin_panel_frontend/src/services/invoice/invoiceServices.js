// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const createAndDownloadInvoice = async (formData, router) => {
  const response = await apiClient.post("/invoice/generate", formData);
  return handleApiResponse(response, router);
};
