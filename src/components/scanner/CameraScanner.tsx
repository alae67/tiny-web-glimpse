
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only initialize scanner when needed, not on component mount
    return () => {
      if (scannerRef.current && isScanning) {
        try {
          scannerRef.current.stop().catch(err => {
            console.error('Error stopping scanner on unmount:', err);
          });
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('camera-scanner-container');
      }

      setIsScanning(true);
      setLastDetectedCode(null);
      setScannerError(null);

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        throw new Error("No camera found on this device.");
      }

      const cameraId = cameras[0].id;

      await scannerRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 450, height: 450 }, // INCREASED scanning box size from 400 to 450
          aspectRatio: window.innerWidth > 600 ? 1.0 : undefined,
          disableFlip: false,
        },
        (decodedText) => {
          console.log("✅ Code detected:", decodedText);
          setLastDetectedCode(decodedText);
          
          try {
            // Call the callback function with the detected code
            onCodeDetected(decodedText);
            
            toast({
              title: "Barcode Detected",
              description: `Detected code: ${decodedText}`,
            });
            
            // Stop scanning if autoClose is true
            if (autoClose) {
              stopScanning().catch((err) => {
                console.error('Error stopping scanner:', err);
                setIsScanning(false);
              });
            }
          } catch (err) {
            console.error("Error in onCodeDetected:", err);
            toast({
              title: "Error",
              description: "Error processing the scanned code",
              variant: "destructive"
            });
          }
        },
        (errorMessage) => {
          console.log("❌ Scan error:", errorMessage);
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
    if (scannerRef.current) {
      try {
        // Check if scanner is actually running before attempting to stop
        if (isScanning) {
          await scannerRef.current.stop();
          console.log("Scanner stopped successfully");
        }
      } catch (err: any) {
        // Ignore specific errors related to scanner not running
        if (typeof err === 'string' && err.includes('Cannot stop')) {
          console.log("Scanner was not running, no need to stop");
        } else if (err && err.message && err.message.includes('Cannot stop')) {
          console.log("Scanner was not running, no need to stop");
        } else {
          console.error('Error stopping scanner:', err);
        }
      } finally {
        // Always update state regardless of outcome
        setIsScanning(false);
      }
    }
  };

  const restartScanner = async () => {
    try {
      // First make sure scanner is stopped
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
      }
      
      // Wait a short delay to ensure camera resources are released
      setTimeout(() => {
        setIsScanning(false);
        startScanning();
      }, 500);
    } catch (err) {
      console.error('Error restarting scanner:', err);
      setIsScanning(false);
      setScannerError('Error restarting camera. Please try again.');
      toast({
        title: "Error",
        description: "Failed to restart camera scanner",
        variant: "destructive"
      });
    }
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
        ref={scannerContainerRef}
        className={`relative w-full h-[500px] bg-gray-100 rounded-md overflow-hidden ${!isScanning ? 'hidden' : ''}`}
      >
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="border-2 border-blue-500 w-[450px] h-[450px] opacity-70"></div>
          </div>
        )}
      </div>
      
      {isScanning && (
        <div className="text-sm text-gray-500 space-y-2">
          <p className="text-center font-medium">Scanning Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure barcode is well-lit and not blurry</li>
            <li>Position barcode within the blue box</li>
            <li>Keep your device steady</li>
            <li>Try different distances (4-10 inches works best)</li>
            <li>If scanning large products, make sure barcode is fully visible</li>
          </ul>
        </div>
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
