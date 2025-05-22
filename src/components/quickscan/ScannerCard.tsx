
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanBarcode, Camera, ShoppingBag, ShoppingCart } from "lucide-react";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { CameraScanner } from "@/components/scanner/CameraScanner";

interface ScannerCardProps {
  activeTab: string;
  isScanning: boolean;
  handleCreateOrder?: (scannedCode: string) => void;
  handleSellProduct?: (scannedCode: string) => void;
  mode?: "order" | "sell";
}

export const ScannerCard: React.FC<ScannerCardProps> = ({
  activeTab,
  isScanning,
  handleCreateOrder,
  handleSellProduct,
  mode = "order",
}) => {
  // Choose handler based on mode
  const handleCodeDetected = (code: string) => {
    if (mode === "sell" && handleSellProduct) {
      handleSellProduct(code);
    } else if (handleCreateOrder) {
      handleCreateOrder(code);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {activeTab === "usb-scanner" ? (
            <><ScanBarcode className="h-5 w-5" /><span>Barcode Scanner</span></>
          ) : (
            <><Camera className="h-5 w-5" /><span>Camera Scanner</span></>
          )}
          {mode === "sell" ? 
            <ShoppingBag className="h-5 w-5 ml-2 text-green-500" /> : 
            <ShoppingCart className="h-5 w-5 ml-2 text-blue-500" />
          }
        </CardTitle>
        <CardDescription>
          {mode === "sell" 
            ? "Scan any product barcode to instantly sell the product" 
            : "Scan any product barcode to instantly create a new order"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeTab === "usb-scanner" ? (
          <BarcodeScanner 
            onProductScanned={() => {}} 
            enabled={isScanning && activeTab === "usb-scanner"}
            createOrderMode={mode === "order"}
            onCreateOrder={handleCodeDetected}
          />
        ) : (
          <div className="flex justify-center">
            <div style={{ maxWidth: "500px", width: "100%" }} className="border rounded-lg overflow-hidden">
              <CameraScanner 
                onCodeDetected={handleCodeDetected}
                autoClose={false}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
