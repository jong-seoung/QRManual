import { create } from "zustand";
import api from "./api";

export const productInformationService = {
  createProductInformation: async (data) => {
    return await api.post("/api/v1/product-information/createAll", data);
  },

  updateProductInformation: async (productInformation_id, data) => {
    return await api.put(
      `/api/v1/product-information/update/${productInformation_id}`,
      data
    );
  },

  getAllProductInformation: async (page, size = 8) => {
    return await api.get("/api/v1/product-information/list", {
      params: { page, size },
    });
  },

  getAllProductInformationByCompanyId: async (page, size = 8, id) => {
    return await api.get(`/api/v1/product-information/list/company/${id}`, {
      params: { page, size },
    });
  },

  getProductInformationById: async (id) => {
    return await api.get(`/api/v1/product-information/detail/${id}`);
  },

  deleteProductInformation: async (id) => {
    return await api.delete(`/api/v1/product-information/delete/${id}`);
  },

  toggleBookmark: async (id, isExist) => {
    try {
      if (isExist) {
        await api.delete(`/api/v1/bookmark/${id}`);
        return false;
      } else {
        await api.post(`/api/v1/bookmark/${id}`);
        return true;
      }
    } catch (error) {
      console.error("Bookmark toggle failed", error);
      throw error;
    }
  },
};
