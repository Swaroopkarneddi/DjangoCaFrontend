
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ShoppingCart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const OrderSuccess = () => {
  const { orders, isAuthenticated } = useShop();
  const navigate = useNavigate();
  
  // If no orders or not authenticated, redirect to home
  useEffect(() => {
    if (!isAuthenticated || orders.length === 0) {
      navigate("/");
    }
  }, [isAuthenticated, orders, navigate]);
  
  // Get the most recent order
  const latestOrder = orders[orders.length - 1];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          
          {latestOrder && (
            <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">#{latestOrder.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(latestOrder.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium price">
                    <span className="rupee-symbol">₹</span>
                    {latestOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {latestOrder.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : latestOrder.paymentMethod === "card"
                      ? "Credit/Debit Card"
                      : "UPI Payment"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Address:</span>
                  <span className="font-medium max-w-xs text-right">
                    {latestOrder.address}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/orders">
              <Button variant="outline" className="flex items-center">
                <Package size={18} className="mr-2" />
                View My Orders
              </Button>
            </Link>
            
            <Link to="/products">
              <Button className="bg-brand-600 hover:bg-brand-700 flex items-center">
                <ShoppingCart size={18} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccess;
