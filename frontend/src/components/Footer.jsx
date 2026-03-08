import React from "react";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export default function Footer({ info }) {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer data-testid="footer" className="bg-foreground text-white/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold text-white mb-3">La Băiatu'</h3>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              Gustul de acasă - Tradiție Românească. Restaurant de familie din Deva, cu preparate autentice din bucătăria vestică românească.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Navigare</h4>
            <ul className="space-y-2">
              {[
                { label: "Acasă", href: "#acasa" },
                { label: "Despre Noi", href: "#despre" },
                { label: "Meniu", href: "#meniu" },
                { label: "Galerie", href: "#galerie" },
                { label: "Recenzii", href: "#recenzii" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-white/60 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-white/60">{info?.address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href={`tel:${info?.phone}`} className="text-white/60 hover:text-secondary transition-colors">
                  {info?.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href={`mailto:${info?.email}`} className="text-white/60 hover:text-secondary transition-colors">
                  {info?.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-4">Program</h4>
            {info?.opening_hours && Object.entries(info.opening_hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm mb-2">
                <span className="text-white/60">{day}</span>
                <span className="text-secondary font-medium">{hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {currentYear} La Băiatu'. Toate drepturile rezervate.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Făcut cu <Heart className="w-3 h-3 text-primary" /> în Deva, România
          </p>
        </div>
      </div>
    </footer>
  );
}
