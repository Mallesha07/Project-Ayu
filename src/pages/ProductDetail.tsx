import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, ArrowLeft, Star, Leaf, Shield, Heart, Plus, Minus, CheckCircle2 } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { cn } from "../lib/utils";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  benefits: string[];
  care: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setProduct({ id: snapshot.id, ...snapshot.data() } as Product);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching product:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!auth.currentUser) {
      sessionStorage.setItem("pendingCartItem", JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }));
      toast("Please sign in to add items to cart.", { icon: "🔒" });
      navigate("/auth");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  if (loading) return <div className="pt-40 text-center">Loading...</div>;
  if (!product) return <div className="pt-40 text-center">Product not found.</div>;

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#5C7166] hover:text-[#2D5A43] transition-colors mb-12 font-bold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-[#F4F9F6] border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#E8F3ED] hover:border-[#2D5A43] transition-all cursor-pointer bg-[#F4F9F6]">
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2D5A43] font-bold text-sm uppercase tracking-widest">
                <Leaf className="w-4 h-4" />
                <span>{product.category}</span>
              </div>
              <h1 className="text-5xl font-bold text-[#1A2E24] tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-[#5C7166] font-medium">(128 Reviews)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-[#1A2E24]">
              ₹{product.price.toFixed(2)}
            </div>

            <p className="text-lg text-[#5C7166] leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-4 bg-[#F4F9F6] border border-[#E8F3ED] rounded-full p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-[#2D5A43] text-white py-5 rounded-full font-bold text-xl hover:bg-[#234735] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-[#2D5A43]/20"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <button className="p-5 bg-[#F4F9F6] border border-[#E8F3ED] rounded-full text-[#1A2E24] hover:bg-white transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="pt-12">
              <div className="flex gap-8 border-b border-[#E8F3ED] mb-8">
                {["description", "benefits", "care"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 text-lg font-bold capitalize transition-all relative",
                      activeTab === tab
                        ? "text-[#2D5A43]"
                        : "text-[#5C7166] hover:text-[#1A2E24]"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D5A43] rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {activeTab === "description" && (
                  <p className="text-[#5C7166] leading-relaxed text-lg">
                    {product.description} Our plants are grown with love and
                    care, ensuring you receive the healthiest specimen for your
                    home. Each plant is hand-selected and inspected before
                    shipping.
                  </p>
                )}
                {activeTab === "benefits" && (
                  <ul className="space-y-4">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#5C7166] text-lg">
                        <CheckCircle2 className="w-6 h-6 text-[#2D5A43]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "care" && (
                  <div className="bg-[#F4F9F6] p-8 rounded-3xl border border-[#E8F3ED] space-y-4">
                    <h4 className="text-xl font-bold text-[#1A2E24]">Care Instructions</h4>
                    <p className="text-[#5C7166] leading-relaxed text-lg">
                      {product.care}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-white p-4 rounded-2xl border border-[#E8F3ED]">
                        <span className="text-xs font-bold text-[#5C7166] uppercase tracking-wider">Watering</span>
                        <p className="font-bold text-[#1A2E24]">Once a week</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-[#E8F3ED]">
                        <span className="text-xs font-bold text-[#5C7166] uppercase tracking-wider">Sunlight</span>
                        <p className="font-bold text-[#1A2E24]">Bright Indirect</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
