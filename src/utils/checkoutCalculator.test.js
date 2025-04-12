// Importera checkout-funktioner
import { getRecommendedCheckouts } from './checkoutCalculator';

// Funktion för att testa checkout-beräkningar för olika poäng
function testCheckout(score) {
  console.log(`\nTest för poäng: ${score}`);
  const checkouts = getRecommendedCheckouts(score);
  
  if (checkouts.length === 0) {
    console.log(`  Ingen checkout-väg hittades för ${score} poäng.`);
  } else {
    console.log(`  Möjliga checkout-vägar (${checkouts.length} st):`);
    checkouts.forEach((path, index) => {
      console.log(`  ${index + 1}. ${path.throws.map(t => t.segment).join(' → ')} (${path.totalThrows} pilar)`);
    });
  }
}

// Testa några vanliga checkout-poäng
console.log('=== CHECKOUT-KALKYLATOR TESTER ===');

// Specialfall
testCheckout(0);  // Ingen checkout
testCheckout(1);  // Specialfall - D1
testCheckout(2);  // D1

// Vanliga checkouts
testCheckout(40);  // D20
testCheckout(32);  // D16
testCheckout(36);  // D18

// Lite svårare checkouts
testCheckout(50);  // Bullseye eller S10 + D20
testCheckout(101); // T17 + D25 eller andra kombinationer
testCheckout(156); // T20 + T20 + D18 etc.

// Checkout som kräver 3 pilar
testCheckout(167); // T20 + T19 + D25 m.fl.
testCheckout(170); // T20 + T20 + D25 (största möjliga checkout) 