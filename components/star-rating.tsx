import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

export function StarRating({ rating, onRate }: StarRatingProps) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} cursor-pointer`}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  )
}

