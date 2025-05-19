
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanBarcode, Camera } from "lucide-react";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { CameraScanner } from "@/components/scanner/CameraScanner";

interface ScannerCardProps {
  activeTab: string;
  isScanning: boolean;
  handleCreateOrder: (scannedCode: string) => void;
}

export const ScannerCard: React.FC<ScannerCardProps> = ({
  activeTab,
  isScanning,
  handleCreateOrder,
}) => {
  return (
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
        {activeTab === "usb-scanner" ? (
          <BarcodeScanner 
            onProductScanned={() => {}} 
            enabled={isScanning && activeTab === "usb-scanner"}
            createOrderMode={true}
            onCreateOrder={handleCreateOrder}
          />
        ) : (
          <CameraScanner 
            onCodeDetected={handleCreateOrder}
            autoClose={false}
          />
        )}
      </CardContent>
    </Card>
  );
};
