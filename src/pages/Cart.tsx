import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, ShoppingCart, ArrowRight, BadgeIndianRupee } from "lucide-react";
import { toast } from "@/utils/toast";

const Cart = () => {
  const { cart, updateCartItemQuantity, removeFromCart, cartTotal, isAuthenticated } = useShop();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate shipping cost
  const shippingCost = cartTotal >= 499 ? 0 : (cartTotal > 0 ? 50 : 0);
  
  // Calculate total with shipping
  const totalWithShipping = cartTotal + shippingCost;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setIsUpdating(true);
    updateCartItemQuantity(productId, newQuantity);
    setTimeout(() => {
      setIsUpdating(false);
    }, 300);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to proceed to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    
    navigate("/checkout");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow mb-4">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.product.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                          <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link to={`/product/${item.product.id}`} className="hover:text-brand-600">
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.product.brand}
                              </p>
                            </div>
                            
                            <div className="mt-2 sm:mt-0 text-lg font-semibold text-brand-700 price">
                              <span className="rupee-symbol">₹</span>
                              {(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={isUpdating}
                                className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>
                              
                              <span className="mx-3 text-gray-700">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={isUpdating || item.quantity >= item.product.stock}
                                className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="mt-3 sm:mt-0 text-red-500 hover:text-red-700 flex items-center"
                            >
                              <Trash size={16} className="mr-1" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <Link to="/products" className="text-brand-600 hover:text-brand-700 flex items-center">
                  <ShoppingCart size={18} className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                    <span className="font-medium price">
                      <span className="rupee-symbol">₹</span>
                      {cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium price">
                      {shippingCost > 0 ? (
                        <><span className="rupee-symbol">₹</span>{shippingCost.toLocaleString('en-IN')}</>
                      ) : (
                        <span className="text-green-600">Free</span>
                      )}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && cartTotal > 0 && (
                    <div className="text-sm text-gray-500 italic pb-4">
                      Add <span className="font-medium price"><span className="rupee-symbol">₹</span>{(499 - cartTotal).toLocaleString('en-IN')}</span> more to get FREE shipping
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold text-brand-700 price">
                      <span className="rupee-symbol">₹</span>
                      {totalWithShipping.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-brand-600 hover:bg-brand-700 mt-4"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                  
                  <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                    <BadgeIndianRupee size={16} className="mr-1" />
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-brand-600 hover:bg-brand-700">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
