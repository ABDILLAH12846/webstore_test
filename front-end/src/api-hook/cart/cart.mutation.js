import { apiClient } from "../config";

export const addToCart = async (user_id, product_id, quantity) => {
  try {
    const response = await apiClient.post("/cart", {
      user_id,
      product_id,
      quantity,
    });

    return response.data.message; // Kembalikan hanya `message` dari API
  } catch (error) {
    return error.response?.data?.message || "Terjadi kesalahan"; // Jika ada error, ambil `message` dari API atau default error message
  }
};

export const editCart = async (cart_id, quantity) => {
  try {
    const response = await apiClient.put(`/cart/${cart_id}`, {
      quantity,
    });

    return response.data.message; // Kembalikan hanya `message` dari API
  } catch (error) {
    return error.response?.data?.message || "Terjadi kesalahan"; // Jika ada error, ambil `message` dari API atau default error message
  }
};
