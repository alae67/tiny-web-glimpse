import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { CameraScanner } from "@/components/scanner/CameraScanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanBarcode, ShoppingCart, Database, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAllProducts, saveOrder, saveProduct } from "@/utils/fileStorage";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Updated Product interface to match with fileStorage.ts
interface Product {
  id: string;
  name: string;
  price: string | number;
  quantity?: number;
  winEligible?: boolean;
  imageUrl?: string;
  category: string;  // Changed from optional to required to match fileStorage.ts
  barcode?: string;
  userId?: string;
  stock: number;  // Changed from optional to required to match fileStorage.ts
}

const QuickScan: React.FC = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [lastOrderedProduct, setLastOrderedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("DH");
  const [activeTab, setActiveTab] = useState("usb-scanner");
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
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

  const handleCreateOrder = async (scannedCode: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to create orders",
        variant: "destructive",
      });
      return;
    }
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
        category: "Scanned Products",  // This is now required in both interfaces
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

  const clearScannedBarcodes = () => {
    setScannedBarcodes([]);
    localStorage.removeItem("scannedBarcodes");
    toast({
      title: "History Cleared",
      description: "Scan history has been cleared"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quick Scan</h1>
          <p className="text-gray-500">Scan products to instantly create orders</p>
        </div>
        <Button 
          onClick={() => setIsScanning(!isScanning)}
          variant={isScanning ? "outline" : "default"}
        >
          {isScanning ? "Pause Scanner" : "Resume Scanner"}
        </Button>
      </div>

      <Tabs defaultValue="usb-scanner" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="usb-scanner" className="flex items-center gap-2">
            <ScanBarcode size={16} />
            USB Scanner
          </TabsTrigger>
          <TabsTrigger value="camera-scanner" className="flex items-center gap-2">
            <Camera size={16} />
            Camera Scanner
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {activeTab === "usb-scanner" ? (
                  <><ScanBarcode className="h-5 w-5" /><span>Barcode Scanner</span></>
                ) : (
                  <><Camera className="h-5 w-5" /><span>Camera Scanner</span></>
                )}
              </CardTitle>
              <CardDescription>
                Scan any product barcode to instantly create a new order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="usb-scanner">
                <BarcodeScanner 
                  onProductScanned={() => {}} 
                  enabled={isScanning && activeTab === "usb-scanner"}
                  createOrderMode={true}
                  onCreateOrder={handleCreateOrder}
                />
              </TabsContent>
              <TabsContent value="camera-scanner">
                <CameraScanner 
                  onCodeDetected={handleCreateOrder}
                  autoClose={false}
                />
              </TabsContent>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Quick Order Status</span>
              </CardTitle>
              <CardDescription>
                Orders created in this session: {orderCount}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lastOrderedProduct ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <div className="font-medium">Last order created:</div>
                      <div>Product: {lastOrderedProduct.name}</div>
                      <div>Price: {typeof lastOrderedProduct.price === 'number' ? 
                        `${lastOrderedProduct.price.toFixed(2)} ${currencySymbol}` : 
                        `${parseFloat(lastOrderedProduct.price).toFixed(2)} ${currencySymbol}`}
                      </div>
                      {lastOrderedProduct.winEligible && (
                        <div className="text-yellow-600 font-medium">
                          Win Eligible Product
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/dashboard/orders'}
                    >
                      View All Orders
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No orders created yet. Scan a product to create your first order.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Barcode history section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Scanned Barcodes History</span>
          </CardTitle>
          <CardDescription>
            Recent barcodes you've scanned ({scannedBarcodes.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scannedBarcodes.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {scannedBarcodes.map((code, index) => (
                  <Badge key={index} variant="outline" className="py-2">
                    {code}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={clearScannedBarcodes}
                className="mt-2"
              >
                Clear History
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No barcodes scanned yet. Scan a product to add to history.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickScan;
