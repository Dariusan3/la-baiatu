import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop", alt: "Preparate tradiționale", caption: "Preparate tradiționale" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", alt: "Platou gourmet", caption: "Platou gourmet" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop", alt: "Interior restaurant", caption: "Interior restaurant" },
  { src: "https://images.unsplash.com/photo-1544025162-d76690b67f61?q=80&w=800&auto=format&fit=crop", alt: "Grătar tradițional", caption: "La grătar" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop", alt: "Atmosferă caldă", caption: "Atmosfera caldă" },
  { src: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800&auto=format&fit=crop", alt: "Deserturi delicioase", caption: "Deserturi delicioase" },
  { src: "https://images.unsplash.com/photo-1638805426661-dbe6842813f8?q=80&w=800&auto=format&fit=crop", alt: "Pâine de casă", caption: "Pâine de casă" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop", alt: "Restaurant exterior", caption: "Exterior restaurant" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section
      id="galerie"
      data-testid="gallery-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-2xl text-primary mb-2">Imagini</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Galeria Noastră
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            O privire în lumea noastră culinară
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
              data-testid={`gallery-image-${index}`}
            >
              <div className={`${index === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                <p className="text-white font-serif text-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
          <DialogTitle className="sr-only">Imagine Galerie</DialogTitle>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                data-testid="gallery-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white font-serif text-lg">{selectedImage.caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
