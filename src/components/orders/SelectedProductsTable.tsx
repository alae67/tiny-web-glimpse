
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { Product } from "@/hooks/product/types";

interface SelectedProductsTableProps {
  selectedProducts: Product[];
  onUpdateProductQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

export const SelectedProductsTable: React.FC<SelectedProductsTableProps> = ({
  selectedProducts,
  onUpdateProductQuantity,
  onRemoveProduct,
}) => {
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Win Eligible</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts.map((product) => {
            const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity || 1}
                    onChange={(e) =>
                      onUpdateProductQuantity(
                        product.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-16"
                  />
                </TableCell>
                <TableCell>${productPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {product.winEligible ? (
                    <Badge className="bg-yellow-500">
                      <Gift className="h-3 w-3 mr-1" /> Eligible
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Eligible</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
