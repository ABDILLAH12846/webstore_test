import { apiClient } from "../config";


export const deleteProduct = async (id) => {
    try {
        const response = await apiClient.delete(`/products/${id}`);
    
        return response.data.message; // Kembalikan hanya `message` dari API
      } catch (error) {
        return error.response?.data?.message || "Terjadi kesalahan"; // Jika ada error, ambil `message` dari API atau default error message
      }
}