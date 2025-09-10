// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const createOrUpdateCar = async (formData, router) => {
  const response = await apiClient.post("/cars/create", formData);
  return handleApiResponse(response, router);
};

export const getAllCars = async (payload, router) => {
  const response = await apiClient.get("/cars", { params: payload });
  return handleApiResponse(response, router);
};

export const getCar = async (id, router) => {
  const response = await apiClient.get(`/cars/${id}`);
  return handleApiResponse(response, router);
};

export const deleteCar = async (CarId, router) => {
  const response = await apiClient.delete(`/cars/${CarId}`);
  return handleApiResponse(response, router);
};
export const deleteMainImage = async (CarId, router) => {
  const response = await apiClient.delete(`/cars/${CarId}`);
  return handleApiResponse(response, router);
};
export const deleteOtherImage = async (CarId, router) => {
  const response = await apiClient.delete(`/cars/${CarId}`);
  return handleApiResponse(response, router);
};