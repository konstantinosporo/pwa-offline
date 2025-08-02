export interface ProductModel {
  id?: number;
  name: string;
  description?: string | null;
  price: number;
  quantity?: number | null;
  category?: string | null;
  image_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  discount?: number | null;
}
