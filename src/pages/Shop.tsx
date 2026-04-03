import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Search, Filter, ArrowRight, Star, Leaf, Heart, Database, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where, addDoc, getDocs, writeBatch, doc } from "firebase/firestore";
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

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const { addToCart } = useCart();

  const isAdmin = auth.currentUser?.email === "7760mallesh@gmail.com";

  const seedStore = async () => {
    setSeeding(true);
    try {
      // Clear existing products first
      const querySnapshot = await getDocs(collection(db, "products"));
      const deleteBatch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });
      await deleteBatch.commit();

      const plants = [
        { name: "Tulsi (Holy Basil)", price: 499, category: "medicinal", image: "https://images.unsplash.com/photo-1615485240384-552e400a9c24?auto=format&fit=crop&q=80&w=800", description: "Revered for its medicinal and spiritual properties. A powerful adaptogen.", benefits: ["Stress Relief", "Immunity Boost"], care: "Full sun, water when dry." },
        { name: "Aloe Vera", price: 350, category: "low-maintenance", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800", description: "Widely used for skin healing and digestive health.", benefits: ["Skin Healing", "Digestive Aid"], care: "Bright indirect light, minimal water." },
        { name: "Ashwagandha", price: 650, category: "medicinal", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e59?auto=format&fit=crop&q=80&w=800", description: "Ancient herb known for reducing stress and increasing energy.", benefits: ["Stress Reduction", "Energy Boost"], care: "Warm climate, sandy soil." },
        { name: "Neem", price: 550, category: "medicinal", image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=800", description: "Powerful antimicrobial and blood purifier.", benefits: ["Skin Health", "Detoxification"], care: "Full sun, drought tolerant." },
        { name: "Turmeric", price: 420, category: "trending", image: "https://images.unsplash.com/photo-1615485974055-618825838524?auto=format&fit=crop&q=80&w=800", description: "Known for its anti-inflammatory and antioxidant properties.", benefits: ["Anti-inflammatory", "Antioxidant"], care: "Partial shade, moist soil." },
        { name: "Ginger", price: 299, category: "medicinal", image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800", description: "Excellent for digestion and nausea relief.", benefits: ["Digestive Aid", "Nausea Relief"], care: "Partial shade, rich soil." },
        { name: "Peppermint", price: 250, category: "low-maintenance", image: "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=800", description: "Cooling herb great for digestion and headaches.", benefits: ["Digestive Health", "Headache Relief"], care: "Partial shade, moist soil." },
        { name: "Lavender", price: 599, category: "trending", image: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?auto=format&fit=crop&q=80&w=800", description: "Famous for its calming fragrance and sleep benefits.", benefits: ["Sleep Aid", "Anxiety Reduction"], care: "Full sun, well-draining soil." },
        { name: "Rosemary", price: 380, category: "low-maintenance", image: "https://images.unsplash.com/photo-1594314015069-628260913883?auto=format&fit=crop&q=80&w=800", description: "Improves memory and concentration.", benefits: ["Memory Boost", "Hair Health"], care: "Full sun, minimal water." },
        { name: "Calendula", price: 320, category: "medicinal", image: "https://images.unsplash.com/photo-1589123053646-4e892d54472c?auto=format&fit=crop&q=80&w=800", description: "Soothing for skin irritations and wounds.", benefits: ["Skin Soothing", "Wound Healing"], care: "Full sun, moderate water." },
        { name: "Chamomile", price: 399, category: "medicinal", image: "https://images.unsplash.com/photo-1556801712-76c8205673d8?auto=format&fit=crop&q=80&w=800", description: "Promotes relaxation and better sleep.", benefits: ["Relaxation", "Sleep Aid"], care: "Full sun to partial shade." },
        { name: "Echinacea", price: 620, category: "trending", image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&q=80&w=800", description: "Popular for boosting the immune system.", benefits: ["Immunity Boost", "Cold Relief"], care: "Full sun, well-drained soil." },
        { name: "Lemon Balm", price: 340, category: "low-maintenance", image: "https://images.unsplash.com/photo-1628156382170-1372580a65c9?auto=format&fit=crop&q=80&w=800", description: "Reduces stress and anxiety, improves sleep.", benefits: ["Stress Relief", "Sleep Aid"], care: "Partial shade, moist soil." },
        { name: "Sage", price: 370, category: "medicinal", image: "https://images.unsplash.com/photo-1606228399515-5c128c74d812?auto=format&fit=crop&q=80&w=800", description: "Improves brain function and memory.", benefits: ["Memory Boost", "Antioxidant"], care: "Full sun, well-drained soil." },
        { name: "Thyme", price: 280, category: "low-maintenance", image: "https://images.unsplash.com/photo-1588613254041-032014022798?auto=format&fit=crop&q=80&w=800", description: "Great for respiratory health and immunity.", benefits: ["Respiratory Health", "Immunity"], care: "Full sun, minimal water." },
        { name: "Stevia", price: 450, category: "trending", image: "https://images.unsplash.com/photo-1596434300655-e48d3ff3dddd?auto=format&fit=crop&q=80&w=800", description: "Natural sweetener with zero calories.", benefits: ["Natural Sweetener", "Blood Sugar Control"], care: "Full sun, moist soil." },
        { name: "Brahmi", price: 480, category: "medicinal", image: "https://images.unsplash.com/photo-1611078813350-205128790ce4?auto=format&fit=crop&q=80&w=800", description: "Renowned brain tonic for memory and focus.", benefits: ["Memory Boost", "Focus"], care: "Partial shade, very moist soil." },
        { name: "Giloy", price: 430, category: "medicinal", image: "https://images.unsplash.com/photo-1605640840469-80d091e98851?auto=format&fit=crop&q=80&w=800", description: "Universal herb that boosts immunity and treats fever.", benefits: ["Immunity Boost", "Fever Relief"], care: "Full sun, climbing support." },
        { name: "Shatavari", price: 720, category: "medicinal", image: "https://images.unsplash.com/photo-1615485974055-618825838524?auto=format&fit=crop&q=80&w=800", description: "Supports female reproductive health and hormonal balance.", benefits: ["Hormonal Balance", "Vitality"], care: "Partial shade, rich soil." },
        { name: "Amla", price: 580, category: "trending", image: "https://images.unsplash.com/photo-1582657118090-af35e8c208c9?auto=format&fit=crop&q=80&w=800", description: "Richest source of Vitamin C, great for hair and skin.", benefits: ["Vitamin C Source", "Hair Health"], care: "Full sun, deep soil." },
        { name: "Hibiscus", price: 520, category: "low-maintenance", image: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?auto=format&fit=crop&q=80&w=800", description: "Great for heart health and hair care.", benefits: ["Heart Health", "Hair Growth"], care: "Full sun, regular watering." },
        { name: "Curry Leaves", price: 240, category: "low-maintenance", image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&q=80&w=800", description: "Essential for Indian cooking and hair health.", benefits: ["Digestive Health", "Hair Care"], care: "Full sun, well-drained soil." },
        { name: "Lemongrass", price: 360, category: "low-maintenance", image: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&q=80&w=800", description: "Refreshing herb for tea and stress relief.", benefits: ["Stress Relief", "Detoxification"], care: "Full sun, regular watering." },
        { name: "Garlic", price: 199, category: "medicinal", image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&q=80&w=800", description: "Powerful antibiotic and heart health booster.", benefits: ["Heart Health", "Antibiotic"], care: "Full sun, well-drained soil." },
        { name: "Gotu Kola", price: 460, category: "medicinal", image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800", description: "Herb of longevity, great for skin and brain.", benefits: ["Skin Healing", "Brain Function"], care: "Partial shade, moist soil." },
        { name: "Snake Plant", price: 899, category: "low-maintenance", image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=800", description: "Excellent air purifier that thrives in low light.", benefits: ["Air Purification", "Low Maintenance"], care: "Indirect light, water every 2-3 weeks." },
        { name: "Spider Plant", price: 450, category: "low-maintenance", image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800", description: "Classic indoor plant known for its air-cleaning abilities.", benefits: ["Air Purification", "Safe for Pets"], care: "Bright indirect light, regular watering." },
        { name: "Monstera Deliciosa", price: 1200, category: "trending", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800", description: "Famous for its natural leaf holes, a stunning statement plant.", benefits: ["Air Purification", "Aesthetic Appeal"], care: "Bright indirect light, water weekly." },
        { name: "ZZ Plant", price: 750, category: "low-maintenance", image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800", description: "Virtually indestructible plant with glossy, dark green leaves.", benefits: ["Air Purification", "Drought Tolerant"], care: "Low to bright indirect light, water sparingly." },
        { name: "Peace Lily", price: 550, category: "trending", image: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&q=80&w=800", description: "Elegant white blooms and excellent air-purifying qualities.", benefits: ["Air Purification", "Beautiful Blooms"], care: "Low to medium light, keep soil moist." }
      ];

      const batch = writeBatch(db);
      plants.forEach((plant) => {
        const newDocRef = doc(collection(db, "products"));
        batch.set(newDocRef, plant);
      });

      await batch.commit();
      toast.success("Store seeded with 30 plants!", { icon: "🌱" });
    } catch (err) {
      console.error("Seeding error:", err);
      toast.error("Failed to seed store.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const q = collection(db, "products");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      if (productList.length === 0) {
        // Fallback to static list if Firestore is empty
        const fallbackPlants: Product[] = [
          { id: "1", name: "Tulsi (Holy Basil)", price: 499, category: "medicinal", image: "https://images.unsplash.com/photo-1615485240384-552e400a9c24?auto=format&fit=crop&q=80&w=800", description: "Revered for its medicinal and spiritual properties. A powerful adaptogen.", benefits: ["Stress Relief", "Immunity Boost"], care: "Full sun, water when dry." },
          { id: "2", name: "Aloe Vera", price: 350, category: "low-maintenance", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800", description: "Widely used for skin healing and digestive health.", benefits: ["Skin Healing", "Digestive Aid"], care: "Bright indirect light, minimal water." },
          { id: "3", name: "Ashwagandha", price: 650, category: "medicinal", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e59?auto=format&fit=crop&q=80&w=800", description: "Ancient herb known for reducing stress and increasing energy.", benefits: ["Stress Reduction", "Energy Boost"], care: "Warm climate, sandy soil." },
          { id: "4", name: "Neem", price: 550, category: "medicinal", image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=800", description: "Powerful antimicrobial and blood purifier.", benefits: ["Skin Health", "Detoxification"], care: "Full sun, drought tolerant." },
          { id: "5", name: "Turmeric", price: 420, category: "trending", image: "https://images.unsplash.com/photo-1615485974055-618825838524?auto=format&fit=crop&q=80&w=800", description: "Known for its anti-inflammatory and antioxidant properties.", benefits: ["Anti-inflammatory", "Antioxidant"], care: "Partial shade, moist soil." },
          { id: "6", name: "Ginger", price: 299, category: "medicinal", image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800", description: "Excellent for digestion and nausea relief.", benefits: ["Digestive Aid", "Nausea Relief"], care: "Partial shade, rich soil." },
          { id: "7", name: "Peppermint", price: 250, category: "low-maintenance", image: "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=800", description: "Cooling herb great for digestion and headaches.", benefits: ["Digestive Health", "Headache Relief"], care: "Partial shade, moist soil." },
          { id: "8", name: "Lavender", price: 599, category: "trending", image: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?auto=format&fit=crop&q=80&w=800", description: "Famous for its calming fragrance and sleep benefits.", benefits: ["Sleep Aid", "Anxiety Reduction"], care: "Full sun, well-draining soil." },
          { id: "9", name: "Rosemary", price: 380, category: "low-maintenance", image: "https://images.unsplash.com/photo-1594314015069-628260913883?auto=format&fit=crop&q=80&w=800", description: "Improves memory and concentration.", benefits: ["Memory Boost", "Hair Health"], care: "Full sun, minimal water." },
          { id: "10", name: "Calendula", price: 320, category: "medicinal", image: "https://images.unsplash.com/photo-1589123053646-4e892d54472c?auto=format&fit=crop&q=80&w=800", description: "Soothing for skin irritations and wounds.", benefits: ["Skin Soothing", "Wound Healing"], care: "Full sun, moderate water." },
          { id: "11", name: "Chamomile", price: 399, category: "medicinal", image: "https://images.unsplash.com/photo-1556801712-76c8205673d8?auto=format&fit=crop&q=80&w=800", description: "Promotes relaxation and better sleep.", benefits: ["Relaxation", "Sleep Aid"], care: "Full sun to partial shade." },
          { id: "12", name: "Echinacea", price: 620, category: "trending", image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&q=80&w=800", description: "Popular for boosting the immune system.", benefits: ["Immunity Boost", "Cold Relief"], care: "Full sun, well-drained soil." },
          { id: "13", name: "Lemon Balm", price: 340, category: "low-maintenance", image: "https://images.unsplash.com/photo-1628156382170-1372580a65c9?auto=format&fit=crop&q=80&w=800", description: "Reduces stress and anxiety, improves sleep.", benefits: ["Stress Relief", "Sleep Aid"], care: "Partial shade, moist soil." },
          { id: "14", name: "Sage", price: 370, category: "medicinal", image: "https://images.unsplash.com/photo-1606228399515-5c128c74d812?auto=format&fit=crop&q=80&w=800", description: "Improves brain function and memory.", benefits: ["Memory Boost", "Antioxidant"], care: "Full sun, well-drained soil." },
          { id: "15", name: "Thyme", price: 280, category: "low-maintenance", image: "https://images.unsplash.com/photo-1588613254041-032014022798?auto=format&fit=crop&q=80&w=800", description: "Great for respiratory health and immunity.", benefits: ["Respiratory Health", "Immunity"], care: "Full sun, minimal water." },
          { id: "16", name: "Stevia", price: 450, category: "trending", image: "https://images.unsplash.com/photo-1596434300655-e48d3ff3dddd?auto=format&fit=crop&q=80&w=800", description: "Natural sweetener with zero calories.", benefits: ["Natural Sweetener", "Blood Sugar Control"], care: "Full sun, moist soil." },
          { id: "17", name: "Brahmi", price: 480, category: "medicinal", image: "https://images.unsplash.com/photo-1611078813350-205128790ce4?auto=format&fit=crop&q=80&w=800", description: "Renowned brain tonic for memory and focus.", benefits: ["Memory Boost", "Focus"], care: "Partial shade, very moist soil." },
          { id: "18", name: "Giloy", price: 430, category: "medicinal", image: "https://images.unsplash.com/photo-1605640840469-80d091e98851?auto=format&fit=crop&q=80&w=800", description: "Universal herb that boosts immunity and treats fever.", benefits: ["Immunity Boost", "Fever Relief"], care: "Full sun, climbing support." },
          { id: "19", name: "Shatavari", price: 720, category: "medicinal", image: "https://images.unsplash.com/photo-1615485974055-618825838524?auto=format&fit=crop&q=80&w=800", description: "Supports female reproductive health and hormonal balance.", benefits: ["Hormonal Balance", "Vitality"], care: "Partial shade, rich soil." },
          { id: "20", name: "Amla", price: 580, category: "trending", image: "https://images.unsplash.com/photo-1582657118090-af35e8c208c9?auto=format&fit=crop&q=80&w=800", description: "Richest source of Vitamin C, great for hair and skin.", benefits: ["Vitamin C Source", "Hair Health"], care: "Full sun, deep soil." },
          { id: "21", name: "Hibiscus", price: 520, category: "low-maintenance", image: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?auto=format&fit=crop&q=80&w=800", description: "Great for heart health and hair care.", benefits: ["Heart Health", "Hair Growth"], care: "Full sun, regular watering." },
          { id: "22", name: "Curry Leaves", price: 240, category: "low-maintenance", image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&q=80&w=800", description: "Essential for Indian cooking and hair health.", benefits: ["Digestive Health", "Hair Care"], care: "Full sun, well-drained soil." },
          { id: "23", name: "Lemongrass", price: 360, category: "low-maintenance", image: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&q=80&w=800", description: "Refreshing herb for tea and stress relief.", benefits: ["Stress Relief", "Detoxification"], care: "Full sun, regular watering." },
          { id: "24", name: "Garlic", price: 199, category: "medicinal", image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&q=80&w=800", description: "Powerful antibiotic and heart health booster.", benefits: ["Heart Health", "Antibiotic"], care: "Full sun, well-drained soil." },
          { id: "25", name: "Gotu Kola", price: 460, category: "medicinal", image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800", description: "Herb of longevity, great for skin and brain.", benefits: ["Skin Healing", "Brain Function"], care: "Partial shade, moist soil." },
          { id: "26", name: "Snake Plant", price: 899, category: "low-maintenance", image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=800", description: "Excellent air purifier that thrives in low light.", benefits: ["Air Purification", "Low Maintenance"], care: "Indirect light, water every 2-3 weeks." },
          { id: "27", name: "Spider Plant", price: 450, category: "low-maintenance", image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800", description: "Classic indoor plant known for its air-cleaning abilities.", benefits: ["Air Purification", "Safe for Pets"], care: "Bright indirect light, regular watering." },
          { id: "28", name: "Monstera Deliciosa", price: 1200, category: "trending", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800", description: "Famous for its natural leaf holes, a stunning statement plant.", benefits: ["Air Purification", "Aesthetic Appeal"], care: "Bright indirect light, water weekly." },
          { id: "29", name: "ZZ Plant", price: 750, category: "low-maintenance", image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800", description: "Virtually indestructible plant with glossy, dark green leaves.", benefits: ["Air Purification", "Drought Tolerant"], care: "Low to bright indirect light, water sparingly." },
          { id: "30", name: "Peace Lily", price: 550, category: "trending", image: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&q=80&w=800", description: "Elegant white blooms and excellent air-purifying qualities.", benefits: ["Air Purification", "Beautiful Blooms"], care: "Low to medium light, keep soil moist." }
        ];
        setProducts(fallbackPlants);
      } else {
        setProducts(productList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // featured (default order)
    });

  const categories = [
    { id: "all", name: "All Plants" },
    { id: "medicinal", name: "Medicinal" },
    { id: "low-maintenance", name: "Low Maintenance" },
    { id: "trending", name: "Trending" },
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-[#1A2E24]">
              Our Plant <span className="text-[#2D5A43]">Store.</span>
            </h1>
            <p className="text-[#5C7166] text-lg max-w-md">
              Discover a wide range of medicinal and decorative plants for your
              home and garden.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {(isAdmin || products.length === 0) && (
              <button
                onClick={seedStore}
                disabled={seeding}
                className="flex items-center gap-2 bg-[#1A2E24] text-white px-6 py-4 rounded-full font-bold hover:bg-[#2D5A43] transition-all disabled:opacity-50"
              >
                {seeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                Seed Store
              </button>
            )}
            <div className="relative group flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C7166] group-focus-within:text-[#2D5A43] transition-colors" />
              <input
                type="text"
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E8F3ED] rounded-full py-4 pl-12 pr-6 focus:outline-none focus:border-[#2D5A43] focus:ring-4 focus:ring-[#2D5A43]/5 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold transition-all",
                  category === cat.id
                    ? "bg-[#2D5A43] text-white shadow-lg shadow-[#2D5A43]/20"
                    : "bg-white text-[#5C7166] border border-[#E8F3ED] hover:border-[#2D5A43] hover:text-[#2D5A43]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-2 bg-white border border-[#E8F3ED] rounded-full px-4 py-2 hover:border-[#2D5A43] transition-all">
            <ArrowUpDown className="w-4 h-4 text-[#5C7166]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#5C7166] font-bold text-sm focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 space-y-6 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-[2rem]" />
                <div className="h-6 bg-gray-100 rounded-full w-2/3" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                <div className="flex justify-between items-center pt-4">
                  <div className="h-8 bg-gray-100 rounded-full w-20" />
                  <div className="h-12 bg-gray-100 rounded-full w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white rounded-[2.5rem] p-6 border border-[#E8F3ED] hover:border-[#2D5A43] hover:shadow-2xl hover:shadow-[#2D5A43]/5 transition-all flex flex-col"
                >
                  <Link to={`/shop/${product.id}`} className="block relative aspect-square mb-6 overflow-hidden rounded-[2rem]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="p-3 bg-white/80 backdrop-blur-md rounded-full text-[#1A2E24] hover:bg-white hover:text-red-500 transition-all shadow-sm">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-[#2D5A43] uppercase tracking-wider">
                        {product.category.replace('-', ' ')}
                      </span>
                    </div>
                  </Link>

                  <div className="space-y-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/shop/${product.id}`} className="hover:text-[#2D5A43] transition-colors">
                        <h3 className="text-xl font-bold text-[#1A2E24] line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-yellow-500 shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">4.8</span>
                      </div>
                    </div>
                    <p className="text-[#5C7166] text-sm line-clamp-2 leading-relaxed flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#E8F3ED]">
                      <span className="text-2xl font-bold text-[#1A2E24]">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image
                        })}
                        className="bg-[#2D5A43] text-white p-4 rounded-2xl hover:bg-[#234735] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#2D5A43]/20"
                      >
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-[#F9FBFA] rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-[#5C7166]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A2E24]">No plants found</h3>
            <p className="text-[#5C7166]">Try adjusting your search or category filters.</p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setSortBy("featured"); }}
              className="text-[#2D5A43] font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
