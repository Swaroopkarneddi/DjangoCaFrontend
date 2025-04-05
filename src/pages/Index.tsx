
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop, Product } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const { products } = useShop();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get featured products
    const featured = products.filter(product => product.featured).slice(0, 4);
    setFeaturedProducts(featured);
    
    // Get trending products
    const trending = products.filter(product => product.trending).slice(0, 4);
    setTrendingProducts(trending);
  }, [products]);

  const categories = [
    { 
      id: "electronics", 
      name: "Electronics", 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60" 
    },
    { 
      id: "fashion", 
      name: "Fashion", 
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60" 
    },
    { 
      id: "home", 
      name: "Home & Kitchen", 
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60" 
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Carousel */}
        <section className="mb-12">
          <HeroCarousel />
        </section>
        
        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-brand-600 hover:text-brand-700 flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link 
                key={category.id}
                to={`/products?category=${category.name}`}
                className="group relative rounded-lg overflow-hidden h-48 shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                <img 
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-white text-xl font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured & Trending Products */}
        <section className="mb-12">
          <Tabs defaultValue="featured" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="featured" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <Link to="/products">
                  <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50">
                    View All Products
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trendingProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <Link to="/products">
                  <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50">
                    View All Products
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Special Offer Banner */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Special Offer!</h2>
              <p className="text-white/90 text-lg mb-6">
                Get 20% off on your first order when you sign up for our newsletter.
              </p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
