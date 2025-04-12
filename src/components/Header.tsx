"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiTargetLock } from "react-icons/bi";

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4 sm:mb-0 hover:text-blue-300 transition-colors">
          <BiTargetLock className="text-3xl text-blue-400" />
          <span>Dart Scorer</span>
        </Link>
        
        <nav className="flex space-x-2 sm:space-x-6">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-md hover:bg-slate-700 transition-all ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
          >
            Hem
          </Link>
          <Link 
            href="/players" 
            className={`px-4 py-2 rounded-md hover:bg-slate-700 transition-all ${isActive('/players') ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
          >
            Spelare
          </Link>
          <Link 
            href="/game" 
            className={`px-4 py-2 rounded-md hover:bg-slate-700 transition-all ${isActive('/game') ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
          >
            Spel
          </Link>
          <Link 
            href="/stats" 
            className={`px-4 py-2 rounded-md hover:bg-slate-700 transition-all ${isActive('/stats') ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
          >
            Statistik
          </Link>
        </nav>
      </div>
    </header>
  );
} 