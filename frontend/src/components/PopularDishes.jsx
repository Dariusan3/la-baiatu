import React from "react";
import { Flame } from "lucide-react";

const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76690b67f61?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633070962060-6fae2bc680fa?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1638805426661-dbe6842813f8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
];

export default function PopularDishes({ dishes }) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <section
      id="populare"
      data-testid="popular-dishes-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-foreground"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-2xl text-secondary mb-2">Alese cu grijă</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Preparate Populare
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-base">
            Cele mai apreciate preparate de către clienții noștri
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dishes.slice(0, 8).map((dish, index) => (
            <div
              key={dish.id || index}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
              data-testid={`popular-dish-${index}`}
            >
              <div className={`${index === 0 ? "aspect-square" : "aspect-[4/5]"}`}>
                <img
                  src={FOOD_IMAGES[index % FOOD_IMAGES.length]}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-secondary" />
                  <span className="text-secondary text-xs font-medium">Popular</span>
                </div>
                <h3 className={`font-serif font-bold text-white ${index === 0 ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}>
                  {dish.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-accent text-secondary text-xl md:text-2xl">
                    {dish.price} RON
                  </span>
                  <span className="text-white/50 text-xs">{dish.weight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
