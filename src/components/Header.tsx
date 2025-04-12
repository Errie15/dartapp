"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-gray-800 text-white py-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold">Dart Scorer</Link>
        
        <nav className="flex space-x-4">
          <Link 
            href="/" 
            className={`hover:text-blue-300 transition-colors ${isActive('/') ? 'text-blue-400' : ''}`}
          >
            Hem
          </Link>
          <Link 
            href="/players" 
            className={`hover:text-blue-300 transition-colors ${isActive('/players') ? 'text-blue-400' : ''}`}
          >
            Spelare
          </Link>
          <Link 
            href="/game" 
            className={`hover:text-blue-300 transition-colors ${isActive('/game') ? 'text-blue-400' : ''}`}
          >
            Spel
          </Link>
          <Link 
            href="/stats" 
            className={`hover:text-blue-300 transition-colors ${isActive('/stats') ? 'text-blue-400' : ''}`}
          >
            Statistik
          </Link>
        </nav>
      </div>
    </header>
  );
} 