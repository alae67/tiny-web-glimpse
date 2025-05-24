
import { useState, useEffect } from "react";

export const useCurrencySettings = () => {
  const [currencySymbol, setCurrencySymbol] = useState("DH");

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("userSettings");
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setCurrencySymbol(settings.currency === "USD" ? "$" : "DH");
      }
    } catch (error) {
      console.error("Error loading currency settings:", error);
    }
  }, []);

  return {
    currencySymbol
  };
};
