import { apiClient } from "@/helper/commonHelper";

export const save_role = (formData) => {
  return apiClient.post("/role/create", formData);
};

export const delete_role = (roleId) => {
  return apiClient.delete(`/role/${roleId}`);
};

export const get_all_roles = (payload) => {
  return apiClient.get(`/role/all`,{
    params:payload
  });
};
