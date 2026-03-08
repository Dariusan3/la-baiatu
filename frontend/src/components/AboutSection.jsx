import React from "react";
import { Clock, MapPin, Users } from "lucide-react";

export default function AboutSection({ info }) {
  return (
    <section
      id="despre"
      data-testid="about-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative animate-fade-in-up opacity-0 animation-delay-100">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
                alt="Interior Restaurant La Băiatu'"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-lg hidden md:block">
              <p className="font-accent text-3xl">Din 2010</p>
              <p className="text-sm text-white/80">Tradiție de familie</p>
            </div>
          </div>

          {/* Content */}
          <div className="animate-fade-in-up opacity-0 animation-delay-200">
            <p className="font-accent text-2xl text-primary mb-2">Povestea Noastră</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Despre Noi
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              {info?.description ||
                "Un restaurant de familie care vă oferă o experiență culinară autentică cu un meniu fantastic și o abordare prietenoasă."}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              La Băiatu' este un loc special unde fiecare preparat este gătit cu dragoste, după rețetele transmise din generație în generație. Veniți să descoperiți gustul autentic al bucătăriei românești într-o atmosferă caldă și primitoare.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-sm">Program</h3>
                  {info?.opening_hours &&
                    Object.entries(info.opening_hours).map(([day, hours]) => (
                      <p key={day} className="text-xs text-muted-foreground mt-1">
                        {day}: {hours}
                      </p>
                    ))}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-sm">Locație</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {info?.address || "Aleea Anemonelor 21, Deva"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
                <Users className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-sm">Familie</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 generații de tradiție culinară
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
