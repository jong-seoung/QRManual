import { create } from "zustand";
import { productInformationService } from "../services/productInformation";
import asyncHandler from "../utils/asyncHandler.js";

const productInformationStore = create((set) => ({
  productInformationList: [],
  ProductInformationById: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: false,
  size: 8,
  loading: false,
  error: null,

  setPage: (page) => set({ page }),

  createProductInformation: async (data) =>
    asyncHandler(set, async () => {
      const response = await productInformationService.createProductInformation(
        data
      );
      return response.data;
    }),

  updateProductInformation: async (productInformation_id, data) =>
    asyncHandler(set, async () => {
      const response = await productInformationService.updateProductInformation(
        productInformation_id,
        data
      );
      return response.data;
    }),

  getAllProductInformation: async (page = 0, size = 8) =>
    asyncHandler(set, async () => {
      const response = await productInformationService.getAllProductInformation(
        page,
        size
      );

      set({
        productInformationList: response.data.content,
        page: response.data.number,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        first: response.data.first,
        last: response.data.last,
      });

      return response.data.content;
    }),

  getAllProductInformationByCompanyId: async (page = 0, size = 8, id) =>
    asyncHandler(set, async () => {
      const response =
        await productInformationService.getAllProductInformationByCompanyId(
          page,
          size,
          id
        );

      set({
        productInformationList: response.data.content,
        page: response.data.number,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        first: response.data.first,
        last: response.data.last,
      });

      return response.data.content;
    }),

  getProductInformationById: async (id) =>
    asyncHandler(set, async () => {
      const response =
        await productInformationService.getProductInformationById(id);
      set({ ProductInformationById: response.data });
      return response.data;
    }),
}));

export default productInformationStore;
