
import { ProductReview } from "@/context/ShopContext";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/StarRating";

interface ReviewCardProps {
  review: ProductReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const reviewDate = new Date(review.date);
  const formattedDate = reviewDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="shadow-sm border-gray-100">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            <div className="mt-1">
              <StarRating rating={review.rating} />
            </div>
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <p className="mt-3 text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
