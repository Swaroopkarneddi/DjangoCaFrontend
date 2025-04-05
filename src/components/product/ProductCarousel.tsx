
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  images: string[];
}

const ProductCarousel = ({ images }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timer = useRef<number | null>(null);

  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    if (images.length > 1) {
      timer.current = window.setInterval(goToNext, 5000);
    }
    
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [images.length]);

  // If there are no images, show a placeholder
  if (!images.length) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-md">
      {/* Main image */}
      <div 
        className="w-full h-96 md:h-[450px] bg-gray-100 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image || "/placeholder.svg"}
            alt={`Product image ${index + 1}`}
            className="w-full h-full object-contain flex-shrink-0"
          />
        ))}
      </div>
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full h-9 w-9"
          >
            <ChevronLeft size={24} />
          </Button>
          
          <Button
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full h-9 w-9"
          >
            <ChevronRight size={24} />
          </Button>
        </>
      )}
      
      {/* Thumbnail indicators */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex ? "border-brand-600" : "border-transparent"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
