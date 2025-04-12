import Link from "next/link";
import { FaBullseye, FaUser, FaChartBar, FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="container mx-auto px-container">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-3xl mb-12">
          <h1 className="mb-8">
            <span className="block gold-accent mb-2">Välkommen till</span>
            <span className="block text-cream">Dart Scorer</span>
          </h1>
          <div className="divider my-8 w-32 mx-auto"></div>
          <p className="text-lg text-gray-300 mb-8 max-w-content mx-auto">
            Håll reda på dina dart-matcher, spelare och statistik på ett elegant och effektivt sätt
          </p>
          <Link href="/game" className="inline-block">
            <button className="mt-4 py-4 px-8">
              Starta nytt spel
              <FaArrowRight className="ml-2" />
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="my-section">
        <h2 className="text-center mb-12">Fantastiska funktioner</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="luxury-card group hover:border-accent-secondary">
            <div className="card-header">
              <h3 className="card-title">Spel</h3>
              <span className="icon icon-lg icon-primary">
                <FaBullseye />
              </span>
            </div>
            <p>Starta och spela dart-matcher med dina vänner. Räkna poäng och håll koll på turneringar.</p>
            <Link href="/game" className="flex items-center mt-4 underline-effect">
              <span>Börja spela</span>
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
          
          <div className="luxury-card group hover:border-accent-secondary">
            <div className="card-header">
              <h3 className="card-title">Spelare</h3>
              <span className="icon icon-lg icon-primary">
                <FaUser />
              </span>
            </div>
            <p>Skapa och hantera spelare med individuella profiler. Lägg till information och håll koll på prestationer.</p>
            <Link href="/players" className="flex items-center mt-4 underline-effect">
              <span>Hantera spelare</span>
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
          
          <div className="luxury-card group hover:border-accent-secondary">
            <div className="card-header">
              <h3 className="card-title">Statistik</h3>
              <span className="icon icon-lg icon-primary">
                <FaChartBar />
              </span>
            </div>
            <p>Analysera spelstatistik för att förbättra ditt spel. Se trender, genomsnitt och höjdpunkter.</p>
            <Link href="/stats" className="flex items-center mt-4 underline-effect">
              <span>Visa statistik</span>
              <FaArrowRight className="ml-2 text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-section py-16 bg-gradient-luxury rounded-lg border-l-3 border-accent-primary p-8 shadow-luxury">
        <div className="text-center">
          <h2 className="mb-4">Börja använda Dart Scorer idag</h2>
          <p className="mb-8 max-w-content mx-auto">
            Ta ditt dartspel till nästa nivå med vår eleganta och kraftfulla applikation
          </p>
          <Link href="/game">
            <button className="gold">
              Starta ditt första spel
              <FaArrowRight className="ml-2" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
