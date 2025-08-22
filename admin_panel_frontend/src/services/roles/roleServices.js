import { apiClient } from "@/helper/commonHelper";

export const save_role = (formData) => {
  return apiClient.post("/role", formData);
};

export const delete_banner = (roleId) => {
  return apiClient.delete(`/role/${roleId}`);
};

