import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/utils/toast";
import productData from "@/data/products.json";
import userData from "@/data/users.json";
import axios from "axios";
export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  rating: number;
  reviews: ProductReview[];
  brand: string;
  stock: number;
  featured?: boolean;
  trending?: boolean;
};

export type ProductReview = {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  products: CartItem[];
  totalAmount: number;
  date: string;
  status: "pending" | "shipped" | "delivered";
  address: string;
  paymentMethod: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  address?: string;
  phone?: string;
};

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: User | null;
  isAuthenticated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  placeOrder: (address: string, paymentMethod: string) => void;
  getProductById: (id: number) => Product | undefined;
  addReview: (productId: number, rating: number, comment: string) => void;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(productData);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    setCartTotal(total);
  }, [cart]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedWishlist = localStorage.getItem("wishlist");
    const storedUser = localStorage.getItem("user");
    const storedOrders = localStorage.getItem("orders");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
    toast.info("Item removed from cart");
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);

    if (!isInWishlist) {
      setWishlist((prevWishlist) => [...prevWishlist, product]);
      toast.success(`${product.name} added to wishlist`);
    } else {
      removeFromWishlist(product.id);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
    toast.info("Item removed from wishlist");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      const loggedInUser: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        address: response.data.address || "",
        phone: response.data.phone || "",
      };

      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        name,
        email,
        password,
      });

      const newUser: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        address: response.data.address || "",
        phone: response.data.phone || "",
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));

      toast.success(`Welcome, ${name}!`);
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again."
      );
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  const placeOrder = (address: string, paymentMethod: string) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const newOrder: Order = {
      id: Date.now(),
      products: [...cart],
      totalAmount: cartTotal,
      date: new Date().toISOString(),
      status: "pending",
      address,
      paymentMethod,
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    clearCart();
    toast.success("Order placed successfully!");
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find((product) => product.id === id);
  };

  const addReview = (productId: number, rating: number, comment: string) => {
    if (!user) {
      toast.error("You must be logged in to add a review");
      return;
    }

    const newReview: ProductReview = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              reviews: [...product.reviews, newReview],
              rating: calculateAverageRating([...product.reviews, newReview]),
            }
          : product
      )
    );

    toast.success("Review added successfully");
  };

  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  const value = {
    products,
    cart,
    wishlist,
    orders,
    user,
    isAuthenticated,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    login,
    register,
    logout,
    placeOrder,
    getProductById,
    addReview,
    cartTotal,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
