
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

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: Product[];
  hasWinEligibleProducts: boolean;
  userId: string;
}
