import Link from "next/link";
import { BiTargetLock, BiUserPlus, BiBarChartAlt2 } from "react-icons/bi";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Välkommen till Dart Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link 
          href="/game" 
          className="flex flex-col items-center p-8 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          <BiTargetLock className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Starta Nytt Spel</h2>
          <p className="text-center">Starta och spela ett nytt dartspel</p>
        </Link>
        
        <Link 
          href="/players" 
          className="flex flex-col items-center p-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <BiUserPlus className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Hantera Spelare</h2>
          <p className="text-center">Lägg till, redigera eller ta bort spelare</p>
        </Link>
        
        <Link 
          href="/stats" 
          className="flex flex-col items-center p-8 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <BiBarChartAlt2 className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Visa Statistik</h2>
          <p className="text-center">Kontrollera spelhistorik och spelarstatistik</p>
        </Link>
      </div>
    </div>
  );
}
