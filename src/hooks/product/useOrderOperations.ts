
import { useToast } from "@/components/ui/use-toast";
import { saveOrder } from "@/utils/fileStorage";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "./types";
import { updateProductStock } from "./productUtils";

export const useOrderOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createNewOrder = async (product: Product) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to create orders",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const productPrice = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price;
      
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerName: "Quick Order",
        date: new Date().toISOString(),
        status: "pending" as const,
        total: productPrice,
        items: [{ ...product, quantity: 1 }],
        hasWinEligibleProducts: product.winEligible ?? false,
        userId: user.id
      };
      
      console.log("Creating order for user:", user.id, newOrder);
      
      await saveOrder(newOrder);
      await updateProductStock(product.id);
      
      toast({
        title: "Order Created",
        description: `New order created for ${product.name}`,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    createNewOrder
  };
};
