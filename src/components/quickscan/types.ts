
// Define shared types for QuickScan components
export interface Product {
  id: string;
  name: string;
  price: string | number;
  quantity?: number;
  winEligible?: boolean;
  imageUrl?: string;
  category: string;
  barcode?: string;
  userId?: string;
  stock: number;
}
