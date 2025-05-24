
import { useState, useEffect } from "react";

export const useBarcodeHistory = () => {
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

  useEffect(() => {
    const savedBarcodes = localStorage.getItem("scannedBarcodes");
    if (savedBarcodes) {
      setScannedBarcodes(JSON.parse(savedBarcodes));
    }
  }, []);

  const addBarcodeToHistory = (code: string) => {
    const updatedBarcodes = [...new Set([...scannedBarcodes, code])];
    setScannedBarcodes(updatedBarcodes);
    localStorage.setItem("scannedBarcodes", JSON.stringify(updatedBarcodes));
  };

  const clearScannedBarcodes = () => {
    setScannedBarcodes([]);
    localStorage.removeItem("scannedBarcodes");
  };

  return {
    scannedBarcodes,
    addBarcodeToHistory,
    clearScannedBarcodes
  };
};
