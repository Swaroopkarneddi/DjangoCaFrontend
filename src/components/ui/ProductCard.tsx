
import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop, Product } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 300);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className={cn("group block rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200", className)}
    >
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.trending && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Trending
          </span>
        )}
        
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Heart 
            size={20} 
            className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-semibold text-brand-700 price">
            <span className="rupee-symbol">₹</span>{product.price.toLocaleString('en-IN')}
          </span>
          
          <div className="flex items-center">
            <span className="text-amber-500 mr-1">★</span>
            <span className="text-sm text-gray-700">{product.rating}</span>
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          className={cn(
            "w-full mt-3 bg-brand-600 hover:bg-brand-700 text-white",
            isAddingToCart && "add-to-cart-animation"
          )}
          variant="default"
          size="sm"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
