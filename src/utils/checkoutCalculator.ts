// Definiera typer för ett kast och en checkout-väg
export interface Throw {
  segment: string;
  value: number;
}

export interface CheckoutPath {
  throws: Throw[];
  totalThrows: number;
}

// Alla möjliga dubbelsegment (1-20 och bullseye)
const doubles: Throw[] = [
  ...Array.from({ length: 20 }, (_, i) => ({ segment: `D${i + 1}`, value: (i + 1) * 2 })),
  { segment: 'DB', value: 50 } // Dubbel bullseye
];

// Alla möjliga trippelsegment (1-20)
const triples: Throw[] = Array.from(
  { length: 20 },
  (_, i) => ({ segment: `T${i + 1}`, value: (i + 1) * 3 })
);

// Alla möjliga enkla segment (1-20 och bullseye)
const singles: Throw[] = [
  ...Array.from({ length: 20 }, (_, i) => ({ segment: `S${i + 1}`, value: i + 1 })),
  { segment: 'SB', value: 25 } // Enkel bullseye (outer bull)
];

// Alla möjliga segment förutom dubbla
const allSegmentsExceptDoubles: Throw[] = [...singles, ...triples];

/**
 * Beräknar möjliga checkout-vägar för en given poäng
 * @param remainingScore Kvarvarande poäng
 * @returns Array med möjliga checkout-vägar, sorterade efter antal kast
 */
export function calculateCheckout(remainingScore: number): CheckoutPath[] {
  // Specialfall: Om poängen är 0, finns det ingen checkout
  if (remainingScore <= 0) {
    return [];
  }

  // Specialfall: Om poängen är 1, är det omöjligt att checka ut (bust-regel)
  if (remainingScore === 1) {
    return [{ throws: [{ segment: 'D1', value: 2 }], totalThrows: 1 }];
  }

  // Specialfall: Om poängen är 2, enda möjligheten är D1
  if (remainingScore === 2) {
    return [{ throws: [{ segment: 'D1', value: 2 }], totalThrows: 1 }];
  }

  const checkoutPaths: CheckoutPath[] = [];

  // En-pils checkout: kolla om poängen kan checkas ut med en dubbel
  const oneThrowDouble = doubles.find(d => d.value === remainingScore);
  if (oneThrowDouble) {
    checkoutPaths.push({
      throws: [oneThrowDouble],
      totalThrows: 1
    });
  }

  // Två-pilar checkout: kolla alla kombinationer av ett segment följt av en dubbel
  for (const firstThrow of allSegmentsExceptDoubles) {
    const scoreAfterFirstThrow = remainingScore - firstThrow.value;
    
    // Om poängen blir 1 eller under 0, blir det "bust"
    if (scoreAfterFirstThrow <= 1) {
      continue;
    }
    
    // Hitta dubbel för att checka ut
    const finishingDouble = doubles.find(d => d.value === scoreAfterFirstThrow);
    if (finishingDouble) {
      checkoutPaths.push({
        throws: [firstThrow, finishingDouble],
        totalThrows: 2
      });
    }
  }

  // Tre-pilar checkout: kolla alla kombinationer av två segment följda av en dubbel
  // Vi prioriterar att hitta kombinationer där de första två kasten ger höga poäng
  // för att maximera chansen att komma till en enkel dubbel i sista kastet
  for (const firstThrow of allSegmentsExceptDoubles) {
    for (const secondThrow of allSegmentsExceptDoubles) {
      const scoreAfterTwoThrows = remainingScore - firstThrow.value - secondThrow.value;
      
      // Om poängen blir 1 eller under 0, blir det "bust"
      if (scoreAfterTwoThrows <= 1) {
        continue;
      }
      
      // Hitta dubbel för att checka ut
      const finishingDouble = doubles.find(d => d.value === scoreAfterTwoThrows);
      if (finishingDouble) {
        checkoutPaths.push({
          throws: [firstThrow, secondThrow, finishingDouble],
          totalThrows: 3
        });
      }
    }
  }

  // Sortera checkout-vägar: först efter antal kast (minst antal först),
  // sedan efter komplexitet (föredra vägar med högre värden på första kasten)
  return checkoutPaths
    .sort((a, b) => {
      // Först sortera efter antal kast
      if (a.totalThrows !== b.totalThrows) {
        return a.totalThrows - b.totalThrows;
      }
      
      // Vid samma antal kast, prioritera vägar med högst första kast
      // eftersom dessa ger större chans att nå en enkel dubbel
      const aFirstValue = a.throws[0].value;
      const bFirstValue = b.throws[0].value;
      return bFirstValue - aFirstValue;
    })
    .slice(0, 5); // Begränsa till de 5 bästa vägarna
}

/**
 * Hämtar de rekommenderade checkout-vägarna för en given poäng
 * @param remainingScore Kvarvarande poäng
 * @returns Array med de bästa checkout-vägarna, eller tom array om ingen checkout är möjlig
 */
export function getRecommendedCheckouts(remainingScore: number): CheckoutPath[] {
  // Hämta alla möjliga checkout-vägar
  const allPaths = calculateCheckout(remainingScore);
  
  // Om det finns vägar med 1 kast, returnera endast dessa
  const oneThrowPaths = allPaths.filter(path => path.totalThrows === 1);
  if (oneThrowPaths.length > 0) {
    return oneThrowPaths.slice(0, 3);
  }
  
  // Om det finns vägar med 2 kast, returnera endast dessa
  const twoThrowPaths = allPaths.filter(path => path.totalThrows === 2);
  if (twoThrowPaths.length > 0) {
    return twoThrowPaths.slice(0, 3);
  }
  
  // Annars returnera de bästa 3 vägarna (troligen 3-kast vägar)
  return allPaths.slice(0, 3);
}

/**
 * Formaterar en checkout-väg till en läsbar sträng
 * @param path Checkout-väg
 * @returns Formaterad sträng
 */
export function formatCheckoutPath(path: CheckoutPath): string {
  return path.throws.map(t => t.segment).join(', ');
} 