import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Camera, ScanBarcode, X, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraScannerProps {
  onCodeDetected: (code: string) => void;
  autoClose?: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ 
  onCodeDetected,
  autoClose = true
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastDetectedCode, setLastDetectedCode] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  // Initialize scanner
  useEffect(() => {
    // Create scanner instance if not already created when component mounts
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('camera-scanner-container');
    }
    
    // Cleanup function to stop and clear the scanner on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      // Ensure the scanner is initialized
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('camera-scanner-container');
      }

      setIsScanning(true);
      setLastDetectedCode(null);
      setScannerError(null);

      console.log("Starting camera scanner...");
      
      // Enhanced configuration with better scanning capabilities
      await scannerRef.current.start(
        { facingMode: "environment" }, // Use back camera if available
        {
          fps: 15, // Higher FPS for better scanning
          qrbox: { width: 500, height: 500 }, // Large scanning area
          aspectRatio: 1.0,
          disableFlip: false, // Allow image flip for better scanning
        },
        (decodedText) => {
          // Success callback - code detected
          console.log('Code detected:', decodedText);
          setLastDetectedCode(decodedText);
          onCodeDetected(decodedText);
          
          toast({
            title: "Barcode Detected",
            description: `Detected code: ${decodedText}`,
          });
          
          // Auto-close if enabled
          if (autoClose) {
            stopScanning();
          }
        },
        (errorMessage) => {
          // Only log scanning errors, don't show to user as these are normal during scanning
          console.log('Scanning status:', errorMessage);
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setScannerError(`Camera error: ${err instanceof Error ? err.message : 'Unable to access camera'}`);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const restartScanner = async () => {
    await stopScanning();
    setTimeout(() => {
      startScanning();
    }, 300); // Short delay before restarting to ensure clean initialization
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-gray-600" />
          <div className="font-medium">Camera Barcode Scanner</div>
        </div>
        
        {!isScanning ? (
          <Button 
            onClick={startScanning}
            className="flex items-center space-x-2"
            variant="camera"
          >
            <ScanBarcode size={18} />
            <span>Start Camera Scanning</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              onClick={stopScanning} 
              variant="outline"
              className="flex items-center space-x-2 border-red-300 text-red-600"
            >
              <X size={18} />
              <span>Stop Scanning</span>
            </Button>
            <Button 
              onClick={restartScanner} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCcw size={18} />
              <span>Restart Camera</span>
            </Button>
          </div>
        )}
      </div>
      
      {scannerError && (
        <Alert variant="destructive">
          <AlertDescription>{scannerError}</AlertDescription>
        </Alert>
      )}
      
      <div 
        id="camera-scanner-container" 
        className={`relative w-full h-[400px] bg-gray-100 rounded-md overflow-hidden ${!isScanning ? 'hidden' : ''}`}
      />
      
      {isScanning && (
        <p className="text-sm text-gray-500 text-center">
          Position barcode within the scanning area. If scanning doesn't work, try adjusting lighting or distance.
        </p>
      )}
      
      {lastDetectedCode && (
        <Alert>
          <AlertDescription>
            <div className="font-medium">Last detected code:</div>
            <div className="mt-1 font-mono text-sm bg-gray-100 p-2 rounded">
              {lastDetectedCode}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
