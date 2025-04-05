import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  className,
}: StarRatingProps) => {
  // Calculate the number of full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  // Determine star size
  const starSize = size === "sm" ? 14 : size === "md" ? 18 : 24;

  return (
    <div className={cn("flex items-center", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={starSize}
          className="text-amber-500 fill-amber-500"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star size={starSize} className="text-amber-500 fill-amber-500" />
          <Star
            size={starSize}
            className="absolute top-0 left-0 text-amber-500 fill-gray-200"
            style={{
              clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
            }}
          />
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={starSize}
          className="text-amber-500 fill-gray-200"
        />
      ))}

      {/* <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span> */}
      <span className="ml-1 text-sm text-gray-600">
        {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
      </span>
    </div>
  );
};
