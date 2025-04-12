import Link from "next/link";
import { BiTargetLock, BiUserPlus, BiBarChartAlt2 } from "react-icons/bi";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">
          Välkommen till Dart Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Håll reda på dina dart-matcher, spelare och statistik på ett enkelt och smidigt sätt
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        <Link 
          href="/game" 
          className="group flex flex-col items-center p-8 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <div className="bg-red-600/30 p-6 rounded-full mb-6 group-hover:bg-red-600/50 transition-colors">
            <BiTargetLock className="text-6xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Starta nytt spel</h2>
          <p className="text-center opacity-90">Skapa och spela ett nytt dart-spel</p>
        </Link>
        
        <Link 
          href="/players" 
          className="group flex flex-col items-center p-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <div className="bg-blue-600/30 p-6 rounded-full mb-6 group-hover:bg-blue-600/50 transition-colors">
            <BiUserPlus className="text-6xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Hantera spelare</h2>
          <p className="text-center opacity-90">Lägg till, redigera eller ta bort spelare</p>
        </Link>
        
        <Link 
          href="/stats" 
          className="group flex flex-col items-center p-8 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <div className="bg-green-600/30 p-6 rounded-full mb-6 group-hover:bg-green-600/50 transition-colors">
            <BiBarChartAlt2 className="text-6xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Visa statistik</h2>
          <p className="text-center opacity-90">Kontrollera spelhistorik och spelarstatistik</p>
        </Link>
      </div>
    </div>
  );
}
