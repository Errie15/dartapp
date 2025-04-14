"use client";

import { useEffect, useState } from "react";
import { getRecommendedCheckouts, CheckoutPath, formatCheckoutPath } from "@/utils/checkoutCalculator";

interface CheckoutSuggestionProps {
  remainingScore: number;
  isActive: boolean;
}

export default function CheckoutSuggestion({ 
  remainingScore, 
  isActive 
}: CheckoutSuggestionProps) {
  const [checkoutPaths, setCheckoutPaths] = useState<CheckoutPath[]>([]);
  
  useEffect(() => {
    // Beräkna checkout-vägar endast om komponenten är aktiv
    if (isActive && remainingScore > 0 && remainingScore <= 170) { // 170 är högsta möjliga checkout
      const paths = getRecommendedCheckouts(remainingScore);
      setCheckoutPaths(paths);
    } else {
      setCheckoutPaths([]);
    }
  }, [remainingScore, isActive]);
  
  // Om det inte finns några checkout-vägar eller scoren är 0, visa inget
  if (checkoutPaths.length === 0 || remainingScore === 0) {
    // Om poängen är 0, visa inget
    if (remainingScore === 0) {
      return null;
    }
    
    // Om vi har 1 poäng kvar, visa specialmeddelande
    if (remainingScore === 1) {
      return (
        <div className="bg-gray-700 rounded p-4 flex items-center">
          <div className="bg-gray-600 p-2 rounded-full mr-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-400">Ingen checkout möjlig</div>
            <div className="text-sm text-gray-300">Måste avsluta på en dubbel</div>
          </div>
        </div>
      );
    }
    
    // Om poängen är över 170 eller ingen checkout hittades, visa inget
    return null;
  }
  
  return (
    <div className="bg-gray-700 rounded p-4 flex items-center">
      <div className="bg-gray-600 p-2 rounded-full mr-4">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <div className="text-sm text-gray-400">Checkout-förslag</div>
        <div className="text-lg">{checkoutPaths[0].totalThrows} pil: {formatCheckoutPath(checkoutPaths[0])}</div>
      </div>
    </div>
  );
} 