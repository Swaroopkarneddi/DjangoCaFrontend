
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  Package, 
  LogOut, 
  BadgeIndianRupee
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { cart, isAuthenticated, user, logout } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BadgeIndianRupee size={24} className="text-brand-600" />
            <span className="text-xl font-bold text-brand-700">RupeeShop</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full flex">
              <Input
                type="search"
                placeholder="Search products..."
                className="rounded-r-none focus-visible:ring-brand-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="default" 
                className="rounded-l-none bg-brand-600 hover:bg-brand-700"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-brand-600 ${
                  location.pathname === link.path
                    ? "text-brand-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="relative text-gray-600 hover:text-brand-600">
                <Heart size={22} />
              </Link>
              
              <Link to="/cart" className="relative text-gray-600 hover:text-brand-600">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-brand-100">
                      <User size={22} className="text-brand-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex cursor-pointer">
                        <Package size={16} className="mr-2" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="default" className="bg-brand-600 hover:bg-brand-700">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative text-gray-600 hover:text-brand-600 mr-4">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <form onSubmit={handleSearch} className="flex">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="rounded-r-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" variant="default" className="rounded-l-none">
                        <Search size={18} />
                      </Button>
                    </form>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`py-2 px-4 rounded hover:bg-brand-50 ${
                          location.pathname === link.path
                            ? "text-brand-600 font-medium bg-brand-50"
                            : "text-gray-600"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      to="/wishlist"
                      className="py-2 px-4 rounded hover:bg-brand-50 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart size={20} className="mr-2" />
                      Wishlist
                    </Link>
                  </div>
                  
                  <div className="mt-auto">
                    {isAuthenticated ? (
                      <div className="border-t pt-4 mt-4">
                        <div className="px-4 py-2">
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4">
                          <Link
                            to="/orders"
                            className="py-2 px-4 rounded hover:bg-brand-50 flex items-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Package size={20} className="mr-2" />
                            My Orders
                          </Link>
                          <Button
                            variant="destructive"
                            className="mx-4"
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-4 mt-4 px-4">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="default" className="w-full">
                            Login
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
