
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart } from "lucide-react";
import { Product } from "./types";

interface OrderStatusCardProps {
  orderCount: number;
  lastOrderedProduct: Product | null;
  currencySymbol: string;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  orderCount,
  lastOrderedProduct,
  currencySymbol,
}) => {
  return (
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
  );
};
