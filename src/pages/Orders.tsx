
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllProducts } from "@/utils/fileStorage";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { Order, Product } from "@/hooks/product/types";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterWinEligible, setFilterWinEligible] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // Load orders from localStorage or initialize with sample data
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        
        // Update existing orders to include the win eligibility flag
        const updatedOrders = parsedOrders.map((order: any) => {
          const hasWinEligible = order.items && order.items.some((item: any) => 
            item.winEligible !== undefined ? item.winEligible : false
          );
          
          return {
            ...order,
            hasWinEligibleProducts: hasWinEligible
          };
        });
        
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.error("Error parsing orders:", error);
        initializeWithSampleData();
      }
    } else {
      initializeWithSampleData();
    }
    
    loadAvailableProducts();
  }, []);

  useEffect(() => {
    // Apply filters whenever orders, filterStatus, filterWinEligible or searchTerm changes
    let result = [...orders];

    if (filterStatus !== "all") {
      result = result.filter(order => order.status === filterStatus);
    }
    
    if (filterWinEligible !== "all") {
      result = result.filter(order => 
        filterWinEligible === "eligible" ? order.hasWinEligibleProducts : !order.hasWinEligibleProducts
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(result);
  }, [orders, filterStatus, filterWinEligible, searchTerm]);

  const loadAvailableProducts = async () => {
    try {
      const products = await getAllProducts();
      console.log("Loaded products:", products.length);
      
      const productOptions = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        quantity: 1,
        winEligible: product.winEligible !== undefined ? product.winEligible : false,
        imageUrl: product.imageUrl,
        category: product.category || "Uncategorized",
        barcode: product.barcode,
        stock: product.stock || 10,
        userId: product.userId
      }));
      
      setAvailableProducts(productOptions);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  const initializeWithSampleData = () => {
    const sampleOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-001",
        customerName: "John Doe",
        date: "2025-04-28",
        status: "delivered",
        total: 129.99,
        items: [
          { id: "p1", name: "Wireless Headphones", quantity: 1, price: 129.99, winEligible: true, category: "Electronics", stock: 10 }
        ],
        hasWinEligibleProducts: true,
        userId: ""
      },
      {
        id: "2",
        orderNumber: "ORD-002",
        customerName: "Jane Smith",
        date: "2025-04-27",
        status: "processing",
        total: 249.98,
        items: [
          { id: "p2", name: "Smartphone Case", quantity: 1, price: 24.99, winEligible: true, category: "Accessories", stock: 10 },
          { id: "p3", name: "Bluetooth Speaker", quantity: 1, price: 224.99, winEligible: false, category: "Electronics", stock: 10 }
        ],
        hasWinEligibleProducts: true,
        userId: ""
      },
      {
        id: "3",
        orderNumber: "ORD-003",
        customerName: "Robert Brown",
        date: "2025-04-25",
        status: "pending",
        total: 74.97,
        items: [
          { id: "p4", name: "USB-C Cable Pack", quantity: 3, price: 24.99, winEligible: false, category: "Accessories", stock: 10 }
        ],
        hasWinEligibleProducts: false,
        userId: ""
      }
    ];

    setOrders(sampleOrders);
    setFilteredOrders(sampleOrders);
    localStorage.setItem("orders", JSON.stringify(sampleOrders));
  };

  const handleScannedCode = async (code: string) => {
    console.log("Scanned code in Orders:", code);
    
    let product = availableProducts.find(
      (p) => p.id === code || p.barcode === code
    );
    
    if (product) {
      toast({
        title: "Product Added",
        description: `${product.name} was added to the order`,
      });
    } else {
      toast({
        title: "Invalid Product",
        description: `No product found with code: ${code}`,
        variant: "destructive"
      });
      console.error(`Product not found in order creation: ${code}`);
    }
  };

  const updateProductStock = (productId: string, quantityOrdered: number) => {
    try {
      const storedProducts = localStorage.getItem("products");
      if (!storedProducts) return;
      
      const products = JSON.parse(storedProducts);
      const productIndex = products.findIndex((p: any) => p.id === productId);
      
      if (productIndex !== -1) {
        const currentStock = products[productIndex].stock || 10;
        products[productIndex].stock = Math.max(0, currentStock - quantityOrdered);
        localStorage.setItem("products", JSON.stringify(products));
        console.log(`Updated stock for product ${productId}: ${products[productIndex].stock}`);
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  const handleAddOrder = (customerName: string, customerNotes: string, selectedProducts: Product[]) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product",
        variant: "destructive"
      });
      return;
    }

    const total = selectedProducts.reduce(
      (total, product) => {
        const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        const quantity = product.quantity || 1;
        return total + (productPrice * quantity);
      }, 
      0
    );
    const hasWinEligible = selectedProducts.some(product => product.winEligible);
    const customerNameValue = customerName.trim() || "Guest";
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = currentUser.id || "";

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerName: customerNameValue,
      date: new Date().toISOString(),
      status: "pending",
      total,
      items: selectedProducts,
      hasWinEligibleProducts: hasWinEligible,
      userId: userId
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    selectedProducts.forEach(product => {
      updateProductStock(product.id, product.quantity || 1);
    });

    toast({
      title: "Success",
      description: `New order ${newOrder.orderNumber} has been added successfully!`,
    });

    setIsDialogOpen(false);
    loadAvailableProducts();
  };

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    let filtered = [...updatedOrders];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    if (filterWinEligible !== "all") {
      filtered = filtered.filter(order => 
        filterWinEligible === "eligible" ? order.hasWinEligibleProducts : !order.hasWinEligibleProducts
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(filtered);
    
    toast({
      title: "Success",
      description: "Order deleted successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <AddOrderDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        availableProducts={availableProducts}
        onAddOrder={handleAddOrder}
        onScannedCode={handleScannedCode}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            A list of all customer orders and their current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderFilters
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterWinEligible={filterWinEligible}
            onSearchChange={setSearchTerm}
            onStatusChange={setFilterStatus}
            onWinEligibleChange={setFilterWinEligible}
          />
          <OrdersTable
            orders={filteredOrders}
            onDeleteOrder={handleDeleteOrder}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
