export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  cart_quantity: number;
  cart_id: number;
}

export interface GetProductListInput {
  params?: {
    q?: string;
    limit?: number;
  };
}
