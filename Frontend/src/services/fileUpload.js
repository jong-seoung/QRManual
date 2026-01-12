import { create } from "zustand";
import api from "./api";

export const fileUploadService = {
  fileUpload: async (data, name) => {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await api.post(`/api/v1/upload-file/${name}`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    // {
    // "path": "/test/f564e820-4cd7-4b2c-9e3f-d8341beb14d0.jpg",
    // "originalName": "ba26ced4b63fdf30cddc004d0d994b78c5c05f1bf2c235c387e3daec920b.jpg",
    // "size": 343995
    // }
    return response.data;
  },

  fileDelete: async (data, name) => {
    const formData = new FormData();
    formData.append("path", data.path);

    const response = await api.delete(`/api/v1/delete-file/${name}`, {
      params: {
        path: data.path,
      },
    });
    // {
    // "path": "/test/f564e820-4cd7-4b2c-9e3f-d8341beb14d0.jpg",
    // "originalName": "ba26ced4b63fdf30cddc004d0d994b78c5c05f1bf2c235c387e3daec920b.jpg",
    // "size": 343995
    // }
    return response.data;
  },
};
