
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "./product/useProducts";
import { useBarcodeHistory } from "./product/useBarcodeHistory";
import { useOrderOperations } from "./product/useOrderOperations";
import { useCurrencySettings } from "./product/useCurrencySettings";
import { findProductByCode, isProductOutOfStock, updateProductStock } from "./product/productUtils";
import { Product } from "./product/types";

export const useProductOrder = () => {
  const [lastOrderedProduct, setLastOrderedProduct] = useState<Product | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  
  const { toast } = useToast();
  const { availableProducts } = useProducts();
  const { scannedBarcodes, addBarcodeToHistory, clearScannedBarcodes } = useBarcodeHistory();
  const { createNewOrder } = useOrderOperations();
  const { currencySymbol } = useCurrencySettings();

  const handleSellProduct = async (scannedCode: string) => {
    console.log("Selling product with code:", scannedCode);
    
    const product = findProductByCode(availableProducts, scannedCode);
    
    if (product) {
      if (isProductOutOfStock(product)) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive"
        });
        return;
      }
      
      await updateProductStock(product.id);
      
      toast({
        title: "Sale Complete",
        description: `Successfully sold ${product.name}`,
      });
      
      setLastOrderedProduct(product);
      setOrderCount(prev => prev + 1);
    } else {
      toast({
        title: "Invalid Product",
        description: `No product found with code: ${scannedCode}`,
        variant: "destructive"
      });
      console.error(`Product not found during sale attempt: ${scannedCode}`);
    }
  };

  const handleCreateOrder = async (scannedCode: string) => {
    console.log("Creating order for product code:", scannedCode);
    
    addBarcodeToHistory(scannedCode);
    
    const product = findProductByCode(availableProducts, scannedCode);
    
    if (product) {
      if (isProductOutOfStock(product)) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive"
        });
        return;
      }
      
      await createNewOrder(product);
      setLastOrderedProduct(product);
      setOrderCount(prev => prev + 1);
    } else {
      toast({
        title: "Invalid Product",
        description: `No product found with code: ${scannedCode}`,
        variant: "destructive"
      });
      console.error(`Product not found: ${scannedCode}`);
    }
  };

  return {
    lastOrderedProduct,
    orderCount,
    scannedBarcodes,
    currencySymbol,
    handleCreateOrder,
    handleSellProduct,
    clearScannedBarcodes
  };
};
