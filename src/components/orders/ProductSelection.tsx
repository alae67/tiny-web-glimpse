
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Gift } from "lucide-react";
import { Product } from "@/hooks/product/types";

interface ProductSelectionProps {
  availableProducts: Product[];
  filteredAvailableProducts: Product[];
  productSearchTerm: string;
  onProductSearchChange: (value: string) => void;
  onAddProduct: (productId: string) => void;
  onQuickAddProduct: (product: Product) => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  availableProducts,
  filteredAvailableProducts,
  productSearchTerm,
  onProductSearchChange,
  onAddProduct,
  onQuickAddProduct,
}) => {
  return (
    <div className="space-y-2">
      <Label>Products</Label>
      <div className="flex space-x-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={productSearchTerm}
            onChange={(e) => onProductSearchChange(e.target.value)}
          />
        </div>
        <Select onValueChange={onAddProduct}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add product" />
          </SelectTrigger>
          <SelectContent>
            {availableProducts.map((product) => {
              const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
              return (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - ${productPrice.toFixed(2)}
                  {product.winEligible && <span className="ml-2">🏆</span>}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid for Quick Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {filteredAvailableProducts.map((product) => {
          const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          return (
            <div 
              key={product.id}
              className="border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onQuickAddProduct(product)}
            >
              <div className="flex items-center space-x-3">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md" 
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">${productPrice.toFixed(2)}</p>
                    {product.winEligible && (
                      <Badge className="bg-yellow-500">
                        <Gift className="h-3 w-3 mr-1" /> Eligible
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
