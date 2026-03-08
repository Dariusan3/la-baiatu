import React from "react";
import { Star, Quote } from "lucide-react";

export default function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      id="recenzii"
      data-testid="reviews-section"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-muted/40"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-2xl text-primary mb-2">Ce spun clienții</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Recenzii
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            Opiniile clienților noștri sunt cea mai mare răsplată
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id || index}
              className="bg-background border border-border p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              data-testid={`review-card-${index}`}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-secondary fill-secondary"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>

              <p className="text-foreground/80 italic leading-relaxed mb-6 text-sm">
                "{review.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif font-bold text-primary text-lg">
                    {review.author[0]}
                  </span>
                </div>
                <div>
                  <p className="font-serif font-semibold text-foreground text-sm">
                    {review.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
