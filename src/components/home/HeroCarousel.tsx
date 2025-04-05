import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const carouselItems = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Get up to 50% off on all summer items",
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
    image: "/images/1.jpg",
    link: "/products?category=Electronics",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest collection",
    bgColor: "bg-gradient-to-r from-blue-500 to-purple-500",
    image: "/images/1.jpg",
    link: "/products",
  },
  {
    id: 3,
    title: "Exclusive Deals",
    description: "Limited time offers on premium products",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
    image: "/images/1.jpg",
    link: "/products?category=Electronics",
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevious = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
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
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl h-[300px] md:h-[400px] lg:h-[500px]">
      {/* Carousel items */}
      <div
        className="h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`w-full h-full flex-shrink-0 flex ${item.bgColor}`}
          >
            <div className="container mx-auto px-6 md:px-8 flex items-center h-full">
              <div className="w-full md:w-1/2 text-white z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {item.title}
                </h2>
                <p className="text-lg md:text-xl mb-6">{item.description}</p>
                <Link to={item.link}>
                  <Button className="bg-white text-gray-800 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                {/* <img
                  src={item.image || "/images/1.jpg"}
                  // alt={item.title}
                  className="w-full h-full object-cover"
                /> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        onClick={goToPrevious}
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full h-9 w-9 z-10"
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        onClick={goToNext}
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full h-9 w-9 z-10"
      >
        <ChevronRight size={24} />
      </Button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
