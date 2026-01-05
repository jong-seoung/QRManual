import { create } from "zustand";
import api from "./api";

export const productInformationService = {

    createProductInformation: async (data) => {
        return await api.post("/api/v1/product-information/create", data);
    },

    createProductSubAll: async (productInformation_id, data) => {
        return await api.post(`/api/v1/product-information/${productInformation_id}/create`, data);
    },

    getAllProductInformation: async (page, size=8) => {
        return await api.get("/api/v1/product-information/list", {
            params: { page, size }
        })
    },

    getProductInformationById: async (id) => {
        return await api.get(`/api/v1/product-information/detail/${id}`);
    }
};