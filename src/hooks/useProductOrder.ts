
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getAllProducts, saveOrder, saveProduct } from "@/utils/fileStorage";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/components/quickscan/types";

export const useProductOrder = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [lastOrderedProduct, setLastOrderedProduct] = useState<Product | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("DH");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // Get currency from settings
    try {
      const storedSettings = localStorage.getItem("userSettings");
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setCurrencySymbol(settings.currency === "USD" ? "$" : "DH");
      }
    } catch (error) {
      console.error("Error loading currency settings:", error);
    }
  
    if (user) {
      loadAvailableProducts();
      // Load saved barcodes from localStorage
      const savedBarcodes = localStorage.getItem("scannedBarcodes");
      if (savedBarcodes) {
        setScannedBarcodes(JSON.parse(savedBarcodes));
      }
    }
  }, [user]);

  const loadAvailableProducts = async () => {
    if (!user) return;
    
    try {
      // Use our utility function to get products (will handle permissions)
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

  const updateProductStock = async (productId: string, quantity: number = 1) => {
    try {
      // Get current products from localStorage
      const storedProducts = localStorage.getItem("products");
      if (!storedProducts) return;
      
      const products = JSON.parse(storedProducts);
      
      // Find the product to update
      const productIndex = products.findIndex((p: any) => p.id === productId);
      
      if (productIndex !== -1) {
        // Update the stock
        const currentStock = products[productIndex].stock || 10; // Default to 10 if not set
        products[productIndex].stock = Math.max(0, currentStock - quantity);
        
        // Save updated products back to localStorage
        localStorage.setItem("products", JSON.stringify(products));
        console.log(`Updated stock for product ${productId}: ${products[productIndex].stock}`);
        
        // Refresh available products
        await loadAvailableProducts();
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

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
      // Ensure price is a number
      const productPrice = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price;
      
      // Create a new order with this product and explicitly set the user ID
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerName: "Quick Order",
        date: new Date().toISOString(),
        status: "pending" as const,
        total: productPrice, // Now guaranteed to be a number
        items: [{ ...product, quantity: 1 }],
        hasWinEligibleProducts: product.winEligible ?? false,
        userId: user.id // Explicitly set the user ID
      };
      
      console.log("Creating order for user:", user.id, newOrder);
      
      // Save the order using our utility function
      await saveOrder(newOrder);
      
      // Update product stock
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

  const handleCreateOrder = async (scannedCode: string) => {
    console.log("Creating order for product code:", scannedCode);
    
    // Save the scanned barcode to history
    const updatedBarcodes = [...new Set([...scannedBarcodes, scannedCode])];
    setScannedBarcodes(updatedBarcodes);
    localStorage.setItem("scannedBarcodes", JSON.stringify(updatedBarcodes));
    
    // Try to find product by barcode or id
    let product = availableProducts.find(
      (p) => p.id === scannedCode || p.barcode === scannedCode
    );
    
    if (product) {
      // Check if product is out of stock
      if (product.stock !== undefined && product.stock <= 0) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive"
        });
        return;
      }
    } else {
      // If product doesn't exist, create a new one with default values
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        barcode: scannedCode,
        name: `Product ${scannedCode}`,
        price: 0,
        stock: 10,
        winEligible: false,
        category: "Scanned Products",
      };
      
      // Save the new product to database
      try {
        await saveProduct(newProduct);
        toast({
          title: "New Product Created",
          description: `Created product with barcode: ${scannedCode}`,
        });
        
        // Set product to the newly created product
        product = newProduct;
        
        // Refresh available products
        await loadAvailableProducts();
      } catch (error) {
        console.error("Error saving new product:", error);
        toast({
          title: "Error",
          description: "Failed to create new product",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Create new order with the product
    await createNewOrder(product);
    setLastOrderedProduct(product);
    setOrderCount(prev => prev + 1);
  };

  const clearScannedBarcodes = () => {
    setScannedBarcodes([]);
    localStorage.removeItem("scannedBarcodes");
  };

  return {
    lastOrderedProduct,
    orderCount,
    scannedBarcodes,
    currencySymbol,
    handleCreateOrder,
    clearScannedBarcodes
  };
};
