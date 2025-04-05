import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShop, Product } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductCarousel from "@/components/product/ProductCarousel";
import ProductCard from "@/components/ui/ProductCard";
import ReviewCard from "@/components/ui/ReviewCard";
import { StarRating } from "@/components/ui/StarRating";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  CheckCircle2,
  Truck,
  BadgeIndianRupee,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/utils/toast";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { 
    getProductById, 
    addToCart, 
    addToWishlist, 
    wishlist, 
    addReview, 
    isAuthenticated,
    products
  } = useShop();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(parseInt(productId));
      if (foundProduct) {
        setProduct(foundProduct);
        
        setIsInWishlist(wishlist.some(item => item.id === foundProduct.id));
        
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        navigate("/not-found");
      }
    }
  }, [productId, getProductById, wishlist, navigate, products]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/cart");
    }
  };
  
  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
      setIsInWishlist(!isInWishlist);
    }
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a review");
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment for your review");
      return;
    }
    
    setIsSubmittingReview(true);
    
    if (product) {
      addReview(product.id, reviewRating, reviewComment);
      
      setReviewRating(5);
      setReviewComment("");
      
      setTimeout(() => {
        const updatedProduct = getProductById(product.id);
        if (updatedProduct) {
          setProduct(updatedProduct);
        }
        setIsSubmittingReview(false);
      }, 500);
    }
  };
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Loading product...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-500 hover:text-brand-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/products" className="text-gray-500 hover:text-brand-600">
                    Products
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link 
                    to={`/products?category=${product.category}`} 
                    className="text-gray-500 hover:text-brand-600"
                  >
                    {product.category}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700 truncate max-w-[150px] md:max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <ProductCarousel images={product.images} />
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-gray-500">
                ({product.reviews.length} reviews)
              </span>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-brand-700">
                <span className="rupee-symbol">₹</span>
                {product.price.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="mb-6 pb-6 border-b">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <Label htmlFor="quantity" className="block mb-2">
                    Quantity
                  </Label>
                  <div className="flex h-10 w-28">
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="flex-1 h-full text-center rounded-none border-x-0"
                    />
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                      onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Availability</Label>
                  <div className={cn(
                    "flex items-center",
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  )}>
                    {product.stock > 0 ? (
                      <>
                        <CheckCircle2 size={16} className="mr-1" />
                        <span>In Stock ({product.stock} available)</span>
                      </>
                    ) : (
                      <span>Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="bg-brand-600 hover:bg-brand-700"
                  size="lg"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Buy Now
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
              
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                className="w-full mt-4"
              >
                <Heart
                  size={18}
                  className={cn(
                    "mr-2",
                    isInWishlist ? "fill-red-500 text-red-500" : ""
                  )}
                />
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-700">
                <Truck size={20} className="text-brand-600 mt-0.5" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-gray-500">For orders over ₹499</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-gray-700">
                <BadgeIndianRupee size={20} className="text-brand-600 mt-0.5" />
                <div>
                  <p className="font-medium">Cash on Delivery Available</p>
                  <p className="text-sm text-gray-500">Pay when you receive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                      <dl className="space-y-2">
                        <div className="flex">
                          <dt className="w-24 text-gray-500">Brand:</dt>
                          <dd className="font-medium">{product.brand}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-24 text-gray-500">Category:</dt>
                          <dd className="font-medium">{product.category}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Shipping</h3>
                      <ul className="space-y-1 text-gray-700">
                        <li>Free shipping on orders over ₹499</li>
                        <li>Standard delivery: 3-5 working days</li>
                        <li>Express delivery: 1-2 working days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {product.reviews.length} reviews for this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={product.rating} size="lg" />
                    <span className="text-lg font-medium">
                      {product.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Share your experience with this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating" className="block mb-2">
                        Rating
                      </Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className={`p-2 rounded-full ${
                              reviewRating >= rating
                                ? "text-amber-500"
                                : "text-gray-300"
                            }`}
                          >
                            <Star
                              size={24}
                              className={`${
                                reviewRating >= rating ? "fill-amber-500" : "fill-gray-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="comment" className="block mb-2">
                        Your Review
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">You need to be logged in to write a review.</p>
                  <Link to="/login">
                    <Button>Login to Write a Review</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
