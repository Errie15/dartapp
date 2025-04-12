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
      <div className="container mx-auto flex justify-between items-center px-container">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:text-accent-primary transition-colors">
          <FaBullseye className="text-3xl text-red-crimson animate-pulse" />
          <span className="font-display text-cream">Dart Scorer</span>
        </Link>
        
        <button 
          className="lg:hidden bg-transparent border-none shadow-none p-2 text-2xl text-cream"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Meny"
        >
          <FaBars className="text-accent-primary" />
        </button>
        
        <nav className={`
          lg:flex lg:items-center lg:space-x-6 
          ${mobileMenuOpen 
            ? 'absolute top-full left-0 right-0 bg-gradient-luxury shadow-xl p-4 flex flex-col space-y-2 border-t-3 border-accent-primary animate-fade-in' 
            : 'hidden'
          }
        `}>
          <Link 
            href="/" 
            className={`
              menu-item
              ${isActive('/') ? 'active' : ''}
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="menu-item-icon">
              <FaBullseye />
            </span>
            <span>Hem</span>
          </Link>
          <Link 
            href="/players" 
            className={`
              menu-item
              ${isActive('/players') ? 'active' : ''}
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="menu-item-icon">
              <FaUser />
            </span>
            <span>Spelare</span>
          </Link>
          <Link 
            href="/game" 
            className={`
              menu-item
              ${isActive('/game') ? 'active' : ''}
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="menu-item-icon">
              <FaDice />
            </span>
            <span>Spel</span>
          </Link>
          <Link 
            href="/stats" 
            className={`
              menu-item
              ${isActive('/stats') ? 'active' : ''}
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="menu-item-icon">
              <FaChartBar />
            </span>
            <span>Statistik</span>
          </Link>
        </nav>
      </div>
    </header>
  );
} 