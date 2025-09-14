import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";


export const getAllCars = async (payload, router) => {
  const response = await apiClient.get("/cars/getAllUnsoldCars", { params: payload });
  return handleApiResponse(response, router);
};