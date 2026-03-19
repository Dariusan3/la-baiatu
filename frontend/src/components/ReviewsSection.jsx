import React from "react";
import { Star, Quote, ThumbsUp } from "lucide-react";

export default function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const satisfactionPct = ((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100).toFixed(1);

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

          {/* Satisfaction badge */}
          <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-6 py-3 shadow-sm mt-2">
            <ThumbsUp className="w-5 h-5 text-accent" />
            <span className="font-serif text-2xl font-bold text-primary">{satisfactionPct}%</span>
            <span className="text-muted-foreground text-sm">satisfacție clienți</span>
          </div>
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
