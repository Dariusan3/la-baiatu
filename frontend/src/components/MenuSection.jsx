import React, { useState, useMemo } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

const CATEGORY_ORDER = [
  "mic_dejun",
  "preparate_baza",
  "ciorbe_supe",
  "garnituri",
  "salate",
  "paste",
  "desert",
];

const CATEGORY_LABELS = {
  mic_dejun: "Mic dejun",
  ciorbe_supe: "Ciorbe și supe",
  paste: "Paste",
  preparate_baza: "Preparate de bază",
  garnituri: "Garnituri",
  salate: "Salate",
  desert: "Desert",
};

const CATEGORY_IMAGES = {
  mic_dejun: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop",
  preparate_baza: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
  ciorbe_supe: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&auto=format&fit=crop",
  garnituri: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?q=80&w=1200&auto=format&fit=crop",
  salate: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  paste: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1200&auto=format&fit=crop",
  desert: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
};

export default function MenuSection({ items }) {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeCategory, setActiveCategory] = useState("mic_dejun");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const filteredItems = useMemo(() => {
    let filtered = safeItems.filter((item) => item.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.ingredients.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [safeItems, activeCategory, searchQuery]);

  const availableCategories = useMemo(() => {
    const cats = new Set(safeItems.map((i) => i.category));
    return CATEGORY_ORDER.filter((c) => cats.has(c));
  }, [safeItems]);

  return (
    <section
      id="meniu"
      data-testid="menu-section"
      className="relative"
    >
      {/* Dark header area */}
      <div className="bg-[#1a2332] text-white pt-16 pb-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-accent text-2xl text-[#5b9bd5] mb-2">Află mai multe</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              MENIU
            </h2>
          </div>

          {/* Category tabs */}
          <div className="flex justify-center overflow-x-auto pb-0 -mb-px">
            <div className="flex gap-0">
              {availableCategories.map((catId) => (
                <button
                  key={catId}
                  onClick={() => { setActiveCategory(catId); setSearchQuery(""); }}
                  className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-3 transition-colors ${
                    activeCategory === catId
                      ? "text-[#5b9bd5] border-b-[3px] border-[#5b9bd5]"
                      : "text-white/70 border-b-[3px] border-transparent hover:text-white"
                  }`}
                  data-testid={`menu-tab-${catId}`}
                >
                  {CATEGORY_LABELS[catId]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category banner image */}
        <div className="relative h-40 sm:h-52 overflow-hidden mt-0 bg-[#1a2332]">
          <img
            src={CATEGORY_IMAGES[activeCategory]}
            alt={CATEGORY_LABELS[activeCategory]}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 className="font-serif text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
              {CATEGORY_LABELS[activeCategory]}
            </h3>
          </div>
        </div>
      </div>

      {/* Menu items area - light background */}
      <div className="bg-background py-10 px-6">
        <div className="max-w-6xl mx-auto">
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

          {/* Items grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-medium">Nu s-au găsit preparate</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <MenuCard key={item.id || index} item={item} onAdd={() => addItem(item)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item, onAdd }) {
  return (
    <div className="bg-white border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="mb-3">
        {item.is_popular && (
          <span className="inline-block text-xs text-white bg-primary px-2.5 py-0.5 rounded-full font-medium mb-2">
            Ofertă specială
          </span>
        )}
        <h3 className="font-serif font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
          {item.name}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-1">{item.weight}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        {item.ingredients}
      </p>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        {item.price.toFixed(2)} RON
      </button>
    </div>
  );
}
