import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection({ info }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="acasa"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="font-accent text-2xl sm:text-3xl text-secondary mb-4 animate-fade-in-up opacity-0 animation-delay-100">
          Bine ați venit la
        </p>
        <h1
          className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up opacity-0 animation-delay-200"
          data-testid="hero-title"
        >
          {info?.name || "La Băiatu'"}
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-4 font-light max-w-2xl mx-auto animate-fade-in-up opacity-0 animation-delay-300">
          {info?.tagline || "Gustul de acasă - Tradiție Românească"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fade-in-up opacity-0 animation-delay-400">
          <Button
            onClick={() => scrollTo("#meniu")}
            className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg font-serif shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            data-testid="hero-menu-btn"
          >
            Vezi Meniul
          </Button>
          <Button
            onClick={() => scrollTo("#contact")}
            variant="outline"
            className="rounded-full border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-serif transition-all"
            data-testid="hero-reservation-btn"
          >
            Rezervă o Masă
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm animate-fade-in-up opacity-0 animation-delay-500">
          <div className="text-center">
            <span className="block text-3xl font-serif font-bold text-secondary">{info?.rating || "4.1"}</span>
            <span>din 5 stele</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <span className="block text-3xl font-serif font-bold text-secondary">{info?.total_reviews || "964"}</span>
            <span>recenzii</span>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <span className="block text-3xl font-serif font-bold text-secondary">2 gen.</span>
            <span>tradiție</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollTo("#despre")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        data-testid="scroll-down-btn"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
