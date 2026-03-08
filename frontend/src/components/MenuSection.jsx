import React, { useState, useMemo } from "react";
import { Search, UtensilsCrossed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const CATEGORY_ICONS = {
  mic_dejun: "Mic Dejun",
  ciorbe_supe: "Ciorbe & Supe",
  paste: "Paste",
  preparate_baza: "Preparate de Bază",
  garnituri: "Garnituri",
  salate: "Salate",
  desert: "Desert",
};

export default function MenuSection({ items, categories }) {
  const [activeCategory, setActiveCategory] = useState("toate");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== "toate") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.ingredients.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [items, activeCategory, searchQuery]);

  const allCategories = [
    { id: "toate", label: "Toate" },
    ...categories,
  ];

  return (
    <section
      id="meniu"
      data-testid="menu-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-2xl text-primary mb-2">Bucătăria noastră</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meniul Nostru
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            Preparate tradiționale românești, gătite cu ingrediente proaspete și multă dragoste
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Caută un preparat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full bg-white border-border focus:border-primary text-foreground"
            data-testid="menu-search-input"
          />
        </div>

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="inline-flex w-auto min-w-full lg:w-full bg-muted/50 rounded-full p-1 h-auto gap-1 flex-nowrap" data-testid="menu-tabs">
              {allCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                  data-testid={`menu-tab-${cat.id}`}
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-8">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16" data-testid="menu-empty-state">
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">
                  Nu s-au găsit preparate
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Încercați altă categorie sau căutare
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredItems.map((item, index) => (
                  <MenuCard key={item.id || index} item={item} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function MenuCard({ item, index }) {
  return (
    <div
      className="bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in-up opacity-0"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms`, animationFillMode: 'forwards' }}
      data-testid={`menu-item-${item.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-accent text-xl text-primary whitespace-nowrap">
            {item.price} RON
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {item.weight && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {item.weight}
            </span>
          )}
          {item.is_popular && (
            <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-medium">
              Popular
            </span>
          )}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {CATEGORY_ICONS[item.category] || item.category}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {item.description}
        </p>

        <div className="pt-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Ingrediente: </span>
            {item.ingredients}
          </p>
        </div>
      </div>
    </div>
  );
}
