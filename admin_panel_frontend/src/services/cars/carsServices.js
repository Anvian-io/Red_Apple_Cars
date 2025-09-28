// services/feedbackService.js
import { apiClient } from "@/helper/commonHelper";
import { handleApiResponse } from "@/helper/zindex";

export const createOrUpdateCar = async (formData, router) => {
  const response = await apiClient.post("/cars/create", formData,{
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
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
export const exportCarsToExcel = async (payload) => {
  try {
    const response = await apiClient.get(`/cars/export/excel`, {
      params: payload,
      responseType: "blob" // important for binary files
    });

    // Create blob object
    const blob = new Blob([response.data], { type: response.data.type });

    // Create temporary link element
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Give default file name
    link.setAttribute("download", "cars.xlsx");

    // Append link, click it, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free memory
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting cars to Excel:", error);
  }
};

