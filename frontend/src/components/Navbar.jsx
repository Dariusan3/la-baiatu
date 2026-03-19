import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#acasa", label: "Acasă" },
  { href: "#despre", label: "Despre Noi" },
  { href: "#meniu", label: "Meniu" },
  { href: "#galerie", label: "Galerie" },
  { href: "#recenzii", label: "Recenzii" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a
            href="#acasa"
            onClick={(e) => handleNavClick(e, "#acasa")}
            className="flex items-center gap-2"
            data-testid="navbar-logo"
          >
            <span className={`font-serif text-2xl font-bold transition-colors duration-300 ${scrolled ? "text-primary" : "text-white"}`}>
              La Băiatu'
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white/90 hover:text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
            <a href="tel:0750868367" data-testid="nav-phone-btn">
              <Button
                size="sm"
                className="rounded-full bg-primary text-white hover:bg-primary/90 gap-2 px-5"
              >
                <Phone className="w-4 h-4" />
                Rezervări
              </Button>
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-lg border-t border-border mt-2 animate-fade-in" data-testid="mobile-menu">
          <div className="px-4 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:0750868367"
              className="block mt-4"
            >
              <Button className="w-full rounded-full bg-primary text-white gap-2">
                <Phone className="w-4 h-4" />
                Sună pentru Rezervări
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
