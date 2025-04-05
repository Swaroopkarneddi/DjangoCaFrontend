
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIndianRupee, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useShop();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    navigate("/");
  }
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        navigate("/");
      }
    } catch (err) {
      setErrors({
        form: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                  <BadgeIndianRupee size={24} className="text-brand-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-gray-500" />
                        ) : (
                          <Eye size={16} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I accept the{" "}
                      <Link to="/terms" className="text-brand-600 hover:text-brand-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-brand-600 hover:text-brand-700">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                  )}
                  
                  {errors.form && (
                    <div className="text-red-500 text-sm">{errors.form}</div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <span className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                  Log in
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
