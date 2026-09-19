import { Star } from "lucide-react";

export function RatingStars({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">
        ({totalReviews})
      </span>
    </div>
  );
}
