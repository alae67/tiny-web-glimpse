
import { Product } from "./types";

export const updateProductStock = async (productId: string, quantity: number = 1) => {
  try {
    const storedProducts = localStorage.getItem("products");
    if (!storedProducts) return;
    
    const products = JSON.parse(storedProducts);
    const productIndex = products.findIndex((p: any) => p.id === productId);
    
    if (productIndex !== -1) {
      const currentStock = products[productIndex].stock || 10;
      products[productIndex].stock = Math.max(0, currentStock - quantity);
      
      localStorage.setItem("products", JSON.stringify(products));
      console.log(`Updated stock for product ${productId}: ${products[productIndex].stock}`);
    }
  } catch (error) {
    console.error("Error updating product stock:", error);
  }
};

export const findProductByCode = (products: Product[], code: string): Product | undefined => {
  return products.find((p) => p.id === code || p.barcode === code);
};

export const isProductOutOfStock = (product: Product): boolean => {
  return product.stock !== undefined && product.stock <= 0;
};
