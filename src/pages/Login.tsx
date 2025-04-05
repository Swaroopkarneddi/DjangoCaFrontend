
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIndianRupee, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useShop();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // If user is already authenticated, redirect to home page or previous page
  if (isAuthenticated) {
    const from = location.state?.from || "/";
    navigate(from);
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirect to previous page or home
        const from = location.state?.from || "/";
        navigate(from);
      } else {
        setError("Invalid credentials. Try test@example.com with password 'password'");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
              <CardTitle className="text-2xl text-center">Log in to RupeeShop</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <p className="text-gray-500">
                  For demo purposes, use:<br />
                  Email: test@example.com<br />
                  Password: password
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <span className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
                  Sign up
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
