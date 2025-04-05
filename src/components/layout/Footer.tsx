
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, BadgeIndianRupee } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <BadgeIndianRupee size={24} className="text-white" />
              <span className="text-xl font-bold text-white">RupeeShop</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Your one-stop destination for the best products at affordable prices. Shop with confidence for all your needs.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-300">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="text-gray-400 hover:text-white transition-colors duration-300">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="text-gray-400 hover:text-white transition-colors duration-300">Fashion</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen" className="text-gray-400 hover:text-white transition-colors duration-300">Home & Kitchen</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-300">Register</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white transition-colors duration-300">Orders</Link></li>
              <li><Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors duration-300">Wishlist</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <address className="text-gray-400 not-italic">
              123 Shopping Avenue<br />
              Mumbai, Maharashtra 400001<br />
              India
            </address>
            <p className="text-gray-400 mt-2">
              <strong>Email:</strong> info@rupeeshop.com
            </p>
            <p className="text-gray-400 mt-1">
              <strong>Phone:</strong> +91 9876543210
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 RupeeShop. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Refund Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
