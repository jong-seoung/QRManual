import api from "./api";

export const productInformationService = {

    getAllProductInformation: async (page, size=8) => {
        return await api.get("/api/v1/product-information/list", {
            params: { page, size }
        })
    },
};