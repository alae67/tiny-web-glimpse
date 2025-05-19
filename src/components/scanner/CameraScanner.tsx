import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('camera-scanner-container', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128]
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        });
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
          qrbox: { width: 350, height: 350 },
          aspectRatio: window.innerWidth > 600 ? 1.0 : undefined,
          disableFlip: false,
        },
        (decodedText) => {
          console.log("✅ Code detected:", decodedText);
          setLastDetectedCode(decodedText);
          try {
            onCodeDetected(decodedText);
          } catch (err) {
            console.error("Error in onCodeDetected:", err);
          }
          toast({
            title: "Barcode Detected",
            description: `Detected code: ${decodedText}`,
          });
          if (autoClose) {
            stopScanning().catch((err) => {
              // Ignore 'Cannot stop' errors
              if (
                (typeof err === 'string' && err.includes('Cannot stop')) ||
                (err && err.message && err.message.includes('Cannot stop'))
              ) {
                setIsScanning(false);
                return;
              }
              console.error('Error stopping scanner:', err);
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
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err: any) {
        // Ignore error if scanner is not running
        if (typeof err === 'string' && err.includes('Cannot stop')) {
          setIsScanning(false);
          return;
        }
        if (err && err.message && err.message.includes('Cannot stop')) {
          setIsScanning(false);
          return;
        }
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const restartScanner = async () => {
    await stopScanning();
    setTimeout(() => {
      startScanning();
    }, 300);
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
        className={`relative w-full h-[350px] bg-gray-100 rounded-md overflow-hidden ${!isScanning ? 'hidden' : ''}`}
      >
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="border-2 border-blue-500 w-[350px] h-[350px] opacity-70"></div>
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
            <li>Try different distances (4-8 inches works best)</li>
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
