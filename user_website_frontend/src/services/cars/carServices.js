import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";


export const getAllCars = async (payload, router) => {
  const response = await apiClient.get('/carsWebsite/getAllBotswanaCars ', {
    params: payload,
  });
  return handleApiResponse(response, router);
};

export const getCar = async ( id,router) => {
  
  const response = await apiClient.get(`/carsWebsite/getCar/${id}`);
  return handleApiResponse(response, router);
};

// export const getCar = async (id, router) => {
//   const response = await apiClient.get(`/cars/${id}`);
//   return handleApiResponse(response, router);
// };