import { create } from "zustand";
import { productInformationService } from "../services/productInformation";
import asyncHandler from "../utils/asyncHandler.js";

const productInformationStore = create((set) => ({
  productInformationList: [],
  page: 0,          
  totalPages: 0,    
  totalElements: 0,
  first: true,      
  last: false,   
  size: 8,        
  loading: false,
  error: null,

  getAllProductInformation: async (page = 0, size = 8) =>
    asyncHandler(set, async () => {
      const response = await productInformationService.getAllProductInformation(page, size);

      set({
        productInformationList: response.data.content,
        page: response.data.number,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        first: response.data.first,
        last: response.data.last,
      });

      return response;
    }),
}));

export default productInformationStore;
