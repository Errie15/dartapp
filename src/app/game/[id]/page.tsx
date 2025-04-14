"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useGameStore from "@/store/gameStore";
import { ScoreType } from "@/types";
import DartboardCompactInput from "@/components/DartboardCompactInput";
import CheckoutSuggestion from "@/components/CheckoutSuggestion";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [scoreType, setScoreType] = useState<ScoreType>("single");
  const [throws, setThrows] = useState<Array<{ value: number, type: ScoreType }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { 
    games, 
    addScore, 
    endGame, 
    getPlayer, 
    getPlayerRemainingScore, 
    getPlayerAverageScore,
    checkValidThrow
  } = useGameStore();
  
  // Find the game from the store
  const game = games.find(g => g.id === id);
  
  useEffect(() => {
    // If game doesn't exist, redirect to game page
    if (!game) {
      router.push("/game");
      return;
    }
    
    // Set active player if not already set
    if (!activePlayerId && game.playerIds && game.playerIds.length > 0) {
      setActivePlayerId(game.playerIds[0]);
    }
  }, [game, activePlayerId, router]);

  // Rensa felmeddelandet när spelaren ändras
  useEffect(() => {
    setErrorMessage(null);
  }, [activePlayerId]);
  
  // Early return if game is not found
  if (!game) {
    return <div className="p-8 text-center">Laddar spel...</div>;
  }
  
  const handleNumberClick = (number: number) => {
    if (!activePlayerId || throws.length >= 3) return;
    
    // Validera kast innan det läggs till i vyn
    const throwValue = number;
    const throwType = scoreType;
    const validity = checkValidThrow(activePlayerId, throwValue, throwType, id);

    // Om kastet skulle leda till "bust", visa en varning men låt användaren lägga till det ändå
    // (så att vi kan visa en tydligare varning när de försöker registrera hela rundan)
    if (!validity.valid) {
      setErrorMessage(validity.message || "Ogiltigt kast");
    } else {
      // Rensa tidigare felmeddelanden
      setErrorMessage(null);
    }
    
    const newThrow = { value: number, type: scoreType };
    setThrows([...throws, newThrow]);
  };
  
  const handleBullClick = (isBullseye: boolean) => {
    if (!activePlayerId || throws.length >= 3) return;
    
    const type: ScoreType = isBullseye ? "innerBull" : "outerBull";
    const value = isBullseye ? 50 : 25;
    
    // Validera kast innan det läggs till i vyn
    const validity = checkValidThrow(activePlayerId, value, type, id);
    
    // Om kastet skulle leda till "bust", visa en varning men låt användaren lägga till det ändå
    if (!validity.valid) {
      setErrorMessage(validity.message || "Ogiltigt kast");
    } else {
      // Rensa tidigare felmeddelanden
      setErrorMessage(null);
    }
    
    const newThrow = { value, type };
    setThrows([...throws, newThrow]);
  };
  
  const handleMissClick = () => {
    if (!activePlayerId || throws.length >= 3) return;
    
    // Rensa felmeddelande vid miss (eftersom det inte kan leda till bust)
    setErrorMessage(null);
    
    const newThrow = { value: 0, type: "single" as ScoreType };
    setThrows([...throws, newThrow]);
  };
  
  const handleRemoveThrow = (index: number) => {
    const newThrows = [...throws];
    newThrows.splice(index, 1);
    setThrows(newThrows);
    
    // Rensa felmeddelande när ett kast tas bort
    setErrorMessage(null);
  };
  
  const handleScoreSubmit = () => {
    if (!activePlayerId || throws.length === 0 || !game) return;
    
    // Kontrollera om någon av kasten skulle leda till bust för att förhindra registrering
    let isBust = false;
    let bustMessage = "";
    
    // Ackumulera poäng genom att stega igenom alla kast och simulera effekten
    // Använd checkValidThrow för varje steg i simuleringen
    let simulatedRemainingScore = getPlayerRemainingScore(activePlayerId, id);
    
    for (const throwItem of throws) {
      // Simulera kastet och kontrollera validitet
      const validity = checkValidThrow(activePlayerId, throwItem.value, throwItem.type, id);
      
      if (!validity.valid) {
        isBust = true;
        bustMessage = validity.message || "Ogiltigt kast";
        break;
      }
      
      // Uppdatera kvarvarande poäng för nästa kast-validering
      let throwValue = throwItem.value;
      if (throwItem.type === 'double') throwValue *= 2;
      if (throwItem.type === 'triple') throwValue *= 3;
      simulatedRemainingScore -= throwValue;
      
      // Om den simulerade poängen är 0 eller negativ, avbryt (detta är extra kontroll)
      if (simulatedRemainingScore <= 0 && simulatedRemainingScore !== 0) {
        // Om simulerad poäng inte är exakt 0, markera som bust
        // Denna kod bör inte nås om checkValidThrow fungerar korrekt
        if (simulatedRemainingScore !== 0) {
          isBust = true;
          bustMessage = "Poängen skulle bli under 0 eller exakt 1.";
          break;
        }
      }
    }
    
    if (isBust) {
      // Visa felmeddelande och tillåt inte registrering
      setErrorMessage(bustMessage);
      return;
    }
    
    // Om ingen bust, registrera alla kast
    throws.forEach(throwItem => {
      addScore(activePlayerId, throwItem.value, throwItem.type);
    });
    
    // Beräkna kvarvarande poäng efter alla kast
    const playerRemainingScore = getPlayerRemainingScore(activePlayerId, id);
    
    // Kontrollera om spelaren har vunnit (poäng === 0)
    if (playerRemainingScore === 0) {
      endGame(id);
      router.push(`/game/${id}/summary`);
      return;
    }
    
    // Byt spelare
    if (game.playerIds && game.playerIds.length > 0) {
      const currentPlayerIndex = game.playerIds.indexOf(activePlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % game.playerIds.length;
      setActivePlayerId(game.playerIds[nextPlayerIndex]);
    }
    
    // Återställ val
    setScoreType("single");
    setThrows([]);
    setErrorMessage(null);
  };
  
  const calculateScoreValue = (type: ScoreType, value: number) => {
    if (type === "double") return value * 2;
    if (type === "triple") return value * 3;
    return value;
  };
  
  const renderThrowLabel = (throwItem: { value: number, type: ScoreType }) => {
    if (throwItem.value === 0) return "Miss";
    if (throwItem.type === "innerBull") return "Bullseye";
    if (throwItem.type === "outerBull") return "Outer Bull";
    return `${throwItem.type === "single" ? "Enkel" : throwItem.type === "double" ? "Dubbel" : "Trippel"} ${throwItem.value}`;
  };
  
  // Beräkna kvarvarande poäng efter aktuella kast
  const calculateRemainingScore = () => {
    if (!activePlayerId) return 0;
    
    const startingScore = getPlayerRemainingScore(activePlayerId, id);
    const throwsTotal = throws.reduce((sum, throwItem) => {
      let value = throwItem.value;
      if (throwItem.type === 'double') value *= 2;
      if (throwItem.type === 'triple') value *= 3;
      return sum + value;
    }, 0);
    
    return startingScore - throwsTotal;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/game')} 
              className="text-red-500 hover:text-red-400"
            >
              ≡
            </button>
            <h1 className="text-2xl font-bold ml-4">Dart Scorer</h1>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Är du säker på att du vill avsluta spelet?')) {
                endGame(id);
                router.push(`/game/${id}/summary`);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Avsluta spel
          </button>
        </div>

        {/* Main Title */}
        <h2 className="text-4xl font-serif mb-8">Pågående spel</h2>

        {/* Active Player Section */}
        {activePlayerId && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-3xl font-bold">{getPlayer(activePlayerId)?.name}</h3>
              <div className="text-xl mt-2">
                <span className="mr-2">{calculateRemainingScore()}</span>
                <span className="text-gray-400">Snitt: {getPlayerAverageScore(activePlayerId, id)}</span>
              </div>
              <div className="text-gray-400">Aktuell spelare</div>
            </div>

            {/* Current Score and Throws */}
            <div className="mb-4">
              <div className="bg-gray-700 rounded p-4">
                <div className="text-sm text-gray-400 mb-2">Aktuella kast ({throws.length}/3):</div>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => {
                    const throwItem = throws[index];
                    return (
                      <div 
                        key={index} 
                        className={`flex justify-between items-center p-2 rounded ${
                          throwItem ? 'bg-gray-600' : 'bg-gray-800'
                        }`}
                      >
                        {throwItem ? (
                          <>
                            <span className="text-sm">{renderThrowLabel(throwItem)}</span>
                            <div className="flex items-center">
                              <span className="font-bold mr-2">
                                {calculateScoreValue(throwItem.type, throwItem.value)}
                              </span>
                              <button 
                                onClick={() => handleRemoveThrow(index)}
                                className="text-red-500 hover:text-red-400 p-1"
                              >
                                ×
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">Kast {index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errorMessage && (
                  <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded text-sm text-red-200">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Suggestion */}
            <CheckoutSuggestion 
              remainingScore={calculateRemainingScore()}
              isActive={true}
            />
          </div>
        )}

        {/* Dartboard Input */}
        <div className="bg-gray-800 rounded-lg p-4">
          <DartboardCompactInput 
            onNumberClick={handleNumberClick}
            onBullClick={handleBullClick}
            onMissClick={handleMissClick}
            onScoreSubmit={handleScoreSubmit}
            scoreType={scoreType}
            setScoreType={setScoreType}
            throwCount={throws.length}
            disabled={!activePlayerId}
          />
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8">
          © 2025 Dart Scorer. Alla rättigheter reserverade.
        </div>
      </div>
    </div>
  );
} 