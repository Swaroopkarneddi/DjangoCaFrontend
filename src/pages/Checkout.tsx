import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeIndianRupee,
  CreditCard,
  Landmark,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/utils/toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, user, cartTotal, placeOrder, isAuthenticated } = useShop();
  
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/checkout" } });
  }
  
  const shippingCost = cartTotal >= 499 ? 0 : (cartTotal > 0 ? 50 : 0);
  const totalWithShipping = cartTotal + shippingCost;
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
    saveInfo: true,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveInfo: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone should be 10 digits";
    
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "PIN code should be 6 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please check the form for errors");
      return;
    }
    
    setProcessing(true);
    
    setTimeout(() => {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`;
      placeOrder(fullAddress, formData.paymentMethod);
      
      navigate("/order-success");
      setProcessing(false);
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  Enter your details for shipping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleSelectChange("state", value)}
                    >
                      <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? "border-red-500" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-500">{errors.pincode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveInfo" 
                      checked={formData.saveInfo}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="saveInfo">
                      Save this information for next time
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => handleSelectChange("paymentMethod", "cod")}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="cod" className="flex-1 flex items-center">
                      <BadgeIndianRupee size={24} className="mr-2 text-gray-600" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={() => handleSelectChange("paymentMethod", "card")}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="card" className="flex-1 flex items-center">
                      <CreditCard size={24} className="mr-2 text-gray-600" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === "upi"}
                      onChange={() => handleSelectChange("paymentMethod", "upi")}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="upi" className="flex-1 flex items-center">
                      <Landmark size={24} className="mr-2 text-gray-600" />
                      <div>
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-gray-500">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex justify-between">
                      <div className="flex">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                          <img
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium price">
                        <span className="rupee-symbol">₹</span>
                        {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium price">
                      <span className="rupee-symbol">₹</span>
                      {cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium price">
                      {shippingCost > 0 ? (
                        <><span className="rupee-symbol">₹</span>{shippingCost.toLocaleString('en-IN')}</>
                      ) : (
                        <span className="text-green-600">Free</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold text-brand-700 price">
                      <span className="rupee-symbol">₹</span>
                      {totalWithShipping.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing || cart.length === 0}
                  className="w-full bg-brand-600 hover:bg-brand-700"
                  size="lg"
                >
                  {processing ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
