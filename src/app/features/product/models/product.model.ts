export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  discount: number | null;
}
