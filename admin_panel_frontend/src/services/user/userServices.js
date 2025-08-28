import { apiClient } from "@/helper/commonHelper";

export const createOrUpdateUser  = (formData) => {
  return apiClient.post("/user_management/create", formData);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/user_management/${userId}`);
};

export const getAllUsers = (payload) => {
  return apiClient.get(`/user_management/all`, {
    params: payload,
  });
};

export const getUser = (id) => {
  return apiClient.get(`/user_management/${id}`);
};
