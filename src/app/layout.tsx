import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dart Scorer",
  description: "Håll reda på dina dartspel och statistik",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={montserrat.variable}>
      <body className="antialiased bg-black-rich min-h-screen">
        <Header />
        <main className="pt-28 pb-16">
          {children}
        </main>
        <footer className="bg-gradient-luxury py-8 border-t border-gray-800">
          <div className="container mx-auto px-container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Dart Scorer. Alla rättigheter reserverade.</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-sm text-gray-400 hover:text-accent-primary transition-colors">Integritetspolicy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-accent-primary transition-colors">Användarvillkor</a>
                <a href="#" className="text-sm text-gray-400 hover:text-accent-primary transition-colors">Kontakt</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
