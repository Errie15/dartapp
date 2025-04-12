import Link from "next/link";
import { BiTargetLock, BiUserPlus, BiBarChartAlt2 } from "react-icons/bi";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Dart Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link 
          href="/game" 
          className="flex flex-col items-center p-8 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          <BiTargetLock className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Start New Game</h2>
          <p className="text-center">Set up and play a new dart game</p>
        </Link>
        
        <Link 
          href="/players" 
          className="flex flex-col items-center p-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <BiUserPlus className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Players</h2>
          <p className="text-center">Add, edit, or remove players</p>
        </Link>
        
        <Link 
          href="/stats" 
          className="flex flex-col items-center p-8 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <BiBarChartAlt2 className="text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">View Statistics</h2>
          <p className="text-center">Check game history and player stats</p>
        </Link>
      </div>
    </div>
  );
}
