
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShop, Product } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

const Products = () => {
  const { products } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";
  const initialSearch = queryParams.get("search") || "";
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // Extract all available categories from products
  const allCategories = Array.from(
    new Set(products.map((product) => product.category))
  );
  
  // Find min and max prices from products
  const minMaxPrice = products.reduce(
    (acc, product) => {
      return {
        min: Math.min(acc.min, product.price),
        max: Math.max(acc.max, product.price),
      };
    },
    { min: Infinity, max: 0 }
  );
  
  // Initialize price range based on products
  useEffect(() => {
    if (minMaxPrice.min !== Infinity && minMaxPrice.max !== 0) {
      setPriceRange([minMaxPrice.min, minMaxPrice.max]);
    }
  }, [minMaxPrice.min, minMaxPrice.max]);
  
  // Apply filters and sort
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }
    
    // Apply price range filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply rating filter
    if (ratingFilter > 0) {
      result = result.filter((product) => product.rating >= ratingFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "top-rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        // Featured products first, then sort by id
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.id - b.id;
        });
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories, priceRange, ratingFilter, sortBy]);
  
  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    navigate({ search: newUrl }, { replace: true });
  }, [searchQuery, selectedCategories, navigate]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search query is already applied via the useEffect
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const handleRatingFilterChange = (rating: number) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
  };
  
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([minMaxPrice.min, minMaxPrice.max]);
    setRatingFilter(0);
    setSortBy("featured");
  };
  
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (ratingFilter > 0) count++;
    if (priceRange[0] > minMaxPrice.min || priceRange[1] < minMaxPrice.max) count++;
    return count;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-500">
            Browse our collection of {filteredProducts.length} products
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-brand-600">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Narrow down your product search with filters
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 flex flex-col gap-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {allCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label htmlFor={`category-${category}`} className="cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={priceRange}
                        min={minMaxPrice.min}
                        max={minMaxPrice.max}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div>
                    <h3 className="font-medium mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={ratingFilter === rating}
                            onCheckedChange={() => handleRatingFilterChange(rating)}
                          />
                          <Label htmlFor={`rating-${rating}`} className="cursor-pointer flex items-center">
                            {rating}★ & up
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => setFilterOpen(false)}
                    className="w-full bg-brand-600 hover:bg-brand-700"
                  >
                    Apply Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Active Filters */}
        {(selectedCategories.length > 0 || ratingFilter > 0 || searchQuery) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => handleCategoryChange(category)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {ratingFilter > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {ratingFilter}★ & up
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setRatingFilter(0)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-500 h-6"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          </div>
        )}
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={clearAllFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
