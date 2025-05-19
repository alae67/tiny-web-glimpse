
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BarcodeHistoryCardProps {
  scannedBarcodes: string[];
  clearScannedBarcodes: () => void;
}

export const BarcodeHistoryCard: React.FC<BarcodeHistoryCardProps> = ({
  scannedBarcodes,
  clearScannedBarcodes,
}) => {
  const { toast } = useToast();

  const handleClearHistory = () => {
    clearScannedBarcodes();
    toast({
      title: "History Cleared",
      description: "Scan history has been cleared"
    });
  };

  return (
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
              onClick={handleClearHistory}
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
  );
};
