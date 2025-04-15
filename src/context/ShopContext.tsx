// import productData from "@/data/products.json";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/utils/toast";
import productData from "@/data/products.json";
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
  fetchWishlist: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  placeOrder: (address: string, paymentMethod: string) => void;
  fetchUserOrders: (userId: number) => Promise<Order[]>;
  getProductById: (id: number) => Product | undefined;
  addReview: (productId: number, rating: number, comment: string) => void;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch products from backend, loading fallback data."
        );
        setProducts(productData);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cart]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedWishlist = localStorage.getItem("wishlist");
    const storedUser = localStorage.getItem("user");
    // const storedOrders = localStorage.getItem("orders");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    // if (storedOrders) setOrders(JSON.parse(storedOrders));
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

  // useEffect(() => {
  //   localStorage.setItem("orders", JSON.stringify(orders));
  // }, [orders]);

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

  // const addToWishlist = (product: Product) => {
  //   const isInWishlist = wishlist.some((item) => item.id === product.id);
  //   if (!isInWishlist) {
  //     setWishlist((prev) => [...prev, product]);
  //     toast.success(`${product.name} added to wishlist`);
  //   } else {
  //     removeFromWishlist(product.id);
  //   }
  // };

  // const removeFromWishlist = (productId: number) => {
  //   setWishlist((prev) => prev.filter((item) => item.id !== productId));
  //   toast.info("Item removed from wishlist");
  // };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error("You must be logged in to add to wishlist");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/wishlist/${user.id}/add/`, {
        product: product.id,
      });

      setWishlist((prev) => [...prev, product]);
      toast.success(`${product.name} added to wishlist`);
    } catch (error: any) {
      if (error.response?.data?.message === "Already in wishlist") {
        toast.info(`${product.name} is already in wishlist`);
      } else {
        console.error("Failed to add to wishlist:", error);
        toast.error("Could not add to wishlist");
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) {
      toast.error("You must be logged in to remove from wishlist");
      return;
    }

    try {
      const item = wishlist.find((item) => item.id === productId);
      if (!item) return;

      // Make sure you pass the data in the correct format for a DELETE request
      await axios.delete(`http://127.0.0.1:8000/api/wishlist/delete/`, {
        data: {
          user_id: user.id,
          product_id: item.id,
        },
      });

      // Update the wishlist state
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      toast.info("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Could not remove from wishlist");
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/wishlist/${user.id}/`
      );

      const wishlistProductIds = response.data.map((item: any) => item.product);

      // Match with existing products list to get full product objects
      const matchedProducts = products.filter((product) =>
        wishlistProductIds.includes(product.id)
      );

      setWishlist(matchedProducts);
    } catch (error) {
      console.error("Failed to load wishlist from backend:", error);
      toast.error("Could not load wishlist");
    }
  };
  useEffect(() => {
    if (products.length > 0 && user) {
      fetchWishlist();
    }
  }, [products, user]);

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

  const fetchUserOrders = async (userId: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/${userId}/orders/`
      );

      // console.log(response.data); // Log the response data to inspect it

      const transformedOrders = response.data.map((order: any) => {
        const transformedOrder = {
          ...order,
          products: order.products.map((item: any) => {
            const t = item.product.quantity;
            const product = products.find(
              (product) => product.id === item.product.id
            );

            if (product) {
              // console.log("Found product:", product);
              return {
                product: {
                  ...product,
                  price: product.price?.toString() || "0",
                  reviews: product.reviews.map((review) => ({
                    ...review,
                    rating: review.rating?.toString() || "0",
                  })),
                },
                quantity: t || 1,
              };
            }

            console.log("Product not found for item:", item);
            return item;
          }),
        };
        return transformedOrder;
      });

      console.log(transformedOrders);
      setOrders(transformedOrders);
      return transformedOrders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders.");
      return [];
    }
  };
  useEffect(() => {
    if (products.length > 0 && user) {
      fetchUserOrders(user.id);
    }
  }, [products, user]);

  // const placeOrder = async (address: string, paymentMethod: string) => {
  //   if (cart.length === 0) {
  //     toast.error("Your cart is empty");
  //     return;
  //   }

  //   const newOrder = {
  //     products: cart.map((item) => ({
  //       product: {
  //         id: item.product.id,
  //         quantity: item.quantity,
  //       },
  //     })),
  //     totalAmount: cartTotal,
  //     status: "pending",
  //     address,
  //     paymentMethod,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `http://127.0.0.1:8000/api/user/${user?.id}/orders/`,
  //       newOrder
  //     );

  //     const placedOrder = response.data;

  //     setOrders((prevOrders) => [...prevOrders, placedOrder]);
  //     localStorage.setItem("orders", JSON.stringify([...orders, placedOrder]));

  //     clearCart();
  //     toast.success("Order placed successfully!");
  //   } catch (error) {
  //     console.error("Failed to place order:", error);
  //     toast.error("Failed to place order");
  //   }
  // };

  const placeOrder = async (address: string, paymentMethod: string) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const newOrder = {
      products: cart.map((item) => ({
        product: {
          id: item.product.id,
          quantity: item.quantity,
        },
      })),
      totalAmount: cartTotal,
      status: "pending",
      address,
      paymentMethod,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/${user?.id}/orders/`,
        newOrder
      );

      toast.success("Order placed successfully!");
      clearCart();

      await fetchUserOrders(user!.id);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    }
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find((product) => product.id === id);
  };

  const addReview = async (
    productId: number,
    rating: number,
    comment: string
  ) => {
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

    try {
      await axios.post(
        `http://127.0.0.1:8000/products/${productId}/reviews/add/`,
        {
          userId: newReview.userId,
          rating: newReview.rating,
          comment: newReview.comment,
          date: newReview.date,
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.id === productId) {
            const updatedReviews = [...product.reviews, newReview];
            return {
              ...product,
              reviews: updatedReviews,
              rating: calculateAverageRating(updatedReviews),
            };
          }
          return product;
        })
      );

      toast.success("Review added successfully");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review. Please try again.");
    }
  };

  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    return parseFloat(average.toFixed(1));
  };

  const value: ShopContextType = {
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
    fetchWishlist,
    login,
    register,
    logout,
    placeOrder,
    fetchUserOrders,
    getProductById,
    addReview,
    cartTotal,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};
