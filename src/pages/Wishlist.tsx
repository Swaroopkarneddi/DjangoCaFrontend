
import { Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash, ArrowRight } from "lucide-react";

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useShop();

  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wishlist</h1>
        
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Trash size={16} className="text-red-500" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-brand-600 truncate">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-brand-700 price">
                      <span className="rupee-symbol">₹</span>
                      {product.price.toLocaleString('en-IN')}
                    </span>
                    
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">★</span>
                      <span className="text-sm text-gray-700">{product.rating}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full mt-3 bg-brand-600 hover:bg-brand-700"
                    variant="default"
                    size="sm"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">
              Add items to your wishlist to save them for later.
            </p>
            <Link to="/products">
              <Button className="bg-brand-600 hover:bg-brand-700">
                Browse Products
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Wishlist;
