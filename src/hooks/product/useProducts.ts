
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getAllProducts } from "@/utils/fileStorage";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "./types";

export const useProducts = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadAvailableProducts = async () => {
    if (!user) return;
    
    try {
      const products = await getAllProducts();
      console.log("Loaded products for user:", user.id, products.length);
      setAvailableProducts(products as Product[]);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadAvailableProducts();
    }
  }, [user]);

  return {
    availableProducts,
    loadAvailableProducts
  };
};
