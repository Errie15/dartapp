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
    if (isActive && remainingScore > 0) {
      const paths = getRecommendedCheckouts(remainingScore);
      setCheckoutPaths(paths);
    } else {
      setCheckoutPaths([]);
    }
  }, [remainingScore, isActive]);
  
  // Om det inte finns några checkout-vägar eller scoren är 0, visa inget
  if (checkoutPaths.length === 0 || remainingScore === 0) {
    if (remainingScore === 0) {
      return null;
    }
    
    // Om vi har 1 poäng kvar, visa specialmeddelande
    if (remainingScore === 1) {
      return (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2">
          <div className="text-sm text-yellow-800 font-medium mb-1">
            Ingen checkout möjlig
          </div>
          <p className="text-xs text-yellow-700">
            Med 1 poäng kvar går det inte att checka ut eftersom senaste pilen måste landa i en dubbel.
          </p>
        </div>
      );
    }
    
    return (
      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-2">
        <div className="text-sm text-gray-800 font-medium mb-1">
          Ingen rekommenderad checkout
        </div>
        <p className="text-xs text-gray-700">
          Kunde inte hitta en checkout-väg för {remainingScore} poäng med max 3 pilar.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-2">
      <div className="text-sm text-green-800 font-medium mb-1">
        Checkout-förslag ({checkoutPaths[0].totalThrows} pilar)
      </div>
      
      <ul className="space-y-1.5">
        {checkoutPaths.map((path, index) => (
          <li key={index} className="flex items-center">
            <span className="inline-block w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">
              {index + 1}
            </span>
            <span className="text-sm text-green-800 font-medium">
              {formatCheckoutPath(path)}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Information om dubblar */}
      <div className="mt-2 text-xs text-green-700">
        <p>Kom ihåg: Det sista kastet måste vara en dubbel.</p>
      </div>
    </div>
  );
} 