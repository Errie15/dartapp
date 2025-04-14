"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBullseye, FaUser, FaDice, FaChartBar, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-400 ${
      scrolled ? 'bg-gradient-dark shadow-lg py-3' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-container">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:text-accent-primary transition-colors">
            <FaBullseye className="text-3xl text-red-crimson animate-pulse" />
            <span className="font-display text-cream">Dart Scorer</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-cream hover:text-accent-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Meny"
          >
            <FaBars className="text-2xl" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isActive={isActive} onClick={() => {}} />
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <NavLinks isActive={isActive} onClick={() => setMobileMenuOpen(false)} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

// NavLinks component for reusability
function NavLinks({ isActive, onClick }: { isActive: (path: string) => boolean, onClick: () => void }) {
  return (
    <>
      <Link 
        href="/" 
        className={`flex items-center gap-2 text-cream hover:text-accent-primary transition-colors ${
          isActive('/') ? 'text-accent-primary' : ''
        }`}
        onClick={onClick}
      >
        <FaBullseye className="text-lg" />
        <span>Hem</span>
      </Link>
      <Link 
        href="/players" 
        className={`flex items-center gap-2 text-cream hover:text-accent-primary transition-colors ${
          isActive('/players') ? 'text-accent-primary' : ''
        }`}
        onClick={onClick}
      >
        <FaUser className="text-lg" />
        <span>Spelare</span>
      </Link>
      <Link 
        href="/game" 
        className={`flex items-center gap-2 text-cream hover:text-accent-primary transition-colors ${
          isActive('/game') ? 'text-accent-primary' : ''
        }`}
        onClick={onClick}
      >
        <FaDice className="text-lg" />
        <span>Spel</span>
      </Link>
      <Link 
        href="/stats" 
        className={`flex items-center gap-2 text-cream hover:text-accent-primary transition-colors ${
          isActive('/stats') ? 'text-accent-primary' : ''
        }`}
        onClick={onClick}
      >
        <FaChartBar className="text-lg" />
        <span>Statistik</span>
      </Link>
    </>
  );
} 