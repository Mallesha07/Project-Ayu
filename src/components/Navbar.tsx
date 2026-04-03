import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Leaf, MessageSquare, Calendar, Menu, X, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { cn } from "../lib/utils";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, totalItems, removeItem } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Garden Services", path: "/booking" },
    { name: "AI Assistant", path: "/ai-assistant" },
    { name: "Support", path: "/support" },
  ];

  const cartSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#2D5A43] p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#1A2E24]">
            Project Ayu
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#2D5A43]",
                location.pathname === link.path
                  ? "text-[#2D5A43]"
                  : "text-[#5C7166]"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user?.email === "7760mallesh@gmail.com" && (
            <Link
              to="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#2D5A43]",
                location.pathname === "/admin"
                  ? "text-[#2D5A43]"
                  : "text-[#5C7166]"
              )}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="p-2 hover:bg-[#E8F3ED] rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-[#1A2E24]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#2D5A43] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-[#E8F3ED] overflow-hidden flex flex-col z-50"
                >
                  <div className="p-4 border-b border-[#E8F3ED] flex items-center justify-between bg-[#F4F9F6]">
                    <h3 className="font-bold text-[#1A2E24]">Your Cart</h3>
                    <span className="text-sm text-[#5C7166]">{totalItems} items</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                      <div className="text-center py-8 text-[#5C7166]">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Your cart is empty</p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-[#F4F9F6]" />
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-[#1A2E24] line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-[#5C7166]">Qty: {item.quantity}</p>
                            <p className="font-bold text-[#2D5A43] text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-4 border-t border-[#E8F3ED] bg-[#F4F9F6]">
                      <div className="flex justify-between mb-4">
                        <span className="font-bold text-[#5C7166]">Subtotal</span>
                        <span className="font-bold text-[#1A2E24]">₹{cartSubtotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate("/cart");
                        }}
                        className="w-full bg-[#2D5A43] text-white py-3 rounded-xl font-bold hover:bg-[#234735] transition-all flex items-center justify-center gap-2"
                      >
                        Checkout <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to={user ? "/profile" : "/auth"}
            className="flex items-center gap-2 bg-[#2D5A43] text-white px-5 py-2.5 rounded-full hover:bg-[#234735] transition-all hover:scale-105 active:scale-95"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-semibold">{user ? "Profile" : "Sign In"}</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#1A2E24]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white overflow-hidden border-t border-[#E8F3ED] mt-4 rounded-2xl shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium py-2",
                    location.pathname === link.path
                      ? "text-[#2D5A43]"
                      : "text-[#5C7166]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8F3ED]">
                {user?.email === "7760mallesh@gmail.com" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-[#2D5A43] font-bold"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-[#1A2E24]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({totalItems})</span>
                </Link>
                <Link
                  to={user ? "/profile" : "/auth"}
                  onClick={() => setIsOpen(false)}
                  className="bg-[#2D5A43] text-white px-6 py-2 rounded-full"
                >
                  {user ? "Profile" : "Sign In"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
