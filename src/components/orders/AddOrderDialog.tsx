import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import { CameraScanner } from "@/components/scanner/CameraScanner";
import { ProductSelection } from "./ProductSelection";
import { SelectedProductsTable } from "./SelectedProductsTable";
import { Product } from "@/hooks/product/types";

interface AddOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onAddOrder: (customerName: string, customerNotes: string, selectedProducts: Product[]) => void;
  onScannedCode: (code: string) => void;
}

export const AddOrderDialog: React.FC<AddOrderDialogProps> = ({
  isOpen,
  onClose,
  availableProducts,
  onAddOrder,
  onScannedCode,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [filteredAvailableProducts, setFilteredAvailableProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("manual");

  // Filter available products based on search term
  useEffect(() => {
    if (!productSearchTerm.trim()) {
      setFilteredAvailableProducts(availableProducts);
    } else {
      const term = productSearchTerm.toLowerCase().trim();
      const filtered = availableProducts.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.category && product.category.toLowerCase().includes(term))
      );
      setFilteredAvailableProducts(filtered);
    }
  }, [productSearchTerm, availableProducts]);

  const handleAddProduct = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock !== undefined && product.stock <= 0) {
      return;
    }

    const existingProduct = selectedProducts.find(p => p.id === productId);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === productId 
            ? { ...p, quantity: (p.quantity || 1) + 1 } 
            : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuickAddProduct = (product: Product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      return;
    }
    
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === productId ? { ...p, quantity } : p
        )
      );
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => {
        const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        const quantity = product.quantity || 1;
        return total + (productPrice * quantity);
      }, 
      0
    );
  };

  const handleSubmit = () => {
    onAddOrder(customerName, customerNotes, selectedProducts);
    // Reset form
    setCustomerName("");
    setCustomerNotes("");
    setSelectedProducts([]);
    setActiveTab("manual");
  };

  const handleClose = () => {
    onClose();
    setActiveTab("manual");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Enter the details of the new order or scan product barcodes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name or leave blank for guest"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          {/* Product Selection Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="manual">Manual Selection</TabsTrigger>
              <TabsTrigger value="scan">
                <Camera className="mr-2 h-4 w-4" />
                Scan Products
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <ProductSelection
                availableProducts={availableProducts}
                filteredAvailableProducts={filteredAvailableProducts}
                productSearchTerm={productSearchTerm}
                onProductSearchChange={setProductSearchTerm}
                onAddProduct={handleAddProduct}
                onQuickAddProduct={handleQuickAddProduct}
              />
            </TabsContent>
            <TabsContent value="scan" className="space-y-2">
              <div className="border rounded-md p-4">
                <CameraScanner 
                  onCodeDetected={onScannedCode}
                  autoClose={false}
                />
              </div>
            </TabsContent>
          </Tabs>

          <SelectedProductsTable
            selectedProducts={selectedProducts}
            onUpdateProductQuantity={handleUpdateProductQuantity}
            onRemoveProduct={handleRemoveProduct}
          />

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Notes</Label>
            <Textarea
              id="customerNotes"
              placeholder="Any special instructions or notes..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Add Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderDialog;
