import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Shield, CheckCircle2, Leaf, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export default function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to complete your purchase.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        status: "processing",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      
      clearCart();
      toast.success("Order placed successfully!", { icon: "🌿" });
      navigate("/profile");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 text-center space-y-8 bg-white min-h-screen">
        <div className="w-24 h-24 bg-[#F4F9F6] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-[#5C7166]" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[#1A2E24]">Your cart is empty</h1>
          <p className="text-[#5C7166] text-lg">Looks like you haven't added any plants yet.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#2D5A43] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#234735] transition-all"
        >
          Start Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-[#1A2E24]">
            Checkout
          </h1>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-[#5C7166] hover:text-[#2D5A43] transition-colors font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#F4F9F6] rounded-[2.5rem] p-6 md:p-8 border border-[#E8F3ED] flex flex-col md:flex-row gap-8 items-center group hover:border-[#2D5A43] transition-all"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#1A2E24]">{item.name}</h3>
                    <p className="text-[#5C7166] font-medium">Medicinal Plant</p>
                    <div className="text-xl font-bold text-[#2D5A43] pt-2">
                      ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-white border border-[#E8F3ED] rounded-full p-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F4F9F6] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F4F9F6] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-4 text-[#5C7166] hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl bg-white"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-8">
            <div className="bg-[#F4F9F6] rounded-[3rem] p-10 border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5 space-y-8">
              <h2 className="text-3xl font-bold text-[#1A2E24]">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg text-[#5C7166]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1A2E24]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg text-[#5C7166]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#1A2E24]">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-[#E8F3ED] flex justify-between text-2xl font-bold text-[#1A2E24]">
                  <span>Total</span>
                  <span className="text-[#2D5A43]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#2D5A43] text-white py-6 rounded-2xl font-bold text-xl hover:bg-[#234735] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-[#2D5A43]/20 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Confirm Order
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm font-bold text-[#5C7166] uppercase tracking-widest">
                  <Shield className="w-5 h-5 text-[#2D5A43]" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[#5C7166] uppercase tracking-widest">
                  <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
                  Eco-friendly Packaging
                </div>
              </div>
            </div>

            <div className="bg-[#1A2E24] rounded-[2.5rem] p-8 text-white space-y-4 relative overflow-hidden">
              <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
              <h4 className="text-xl font-bold">Plant a Tree</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                For every order placed, we plant a tree in your name. Join our
                mission to reforest the planet.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-[#A7D7C5]">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
