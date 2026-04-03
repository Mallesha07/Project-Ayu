import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Phone, User, Home, CheckCircle2, ArrowRight, Shield, Star, Leaf, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export default function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    lane: "",
    village: "",
    city: "",
    landmark: "",
    spaceType: "balcony",
    package: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingBooking");
    if (pending && auth.currentUser) {
      setFormData((prev) => ({ ...prev, package: pending }));
      setIsModalOpen(true);
      sessionStorage.removeItem("pendingBooking");
    }
  }, []);

  const packages = [
    {
      id: "basic",
      name: "Basic Setup",
      price: 99,
      features: ["3 Medicinal Plants", "Soil & Pots", "Basic Consultation"],
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      id: "standard",
      name: "Standard Garden",
      price: 249,
      features: ["8 Medicinal Plants", "Premium Pots", "Automated Watering", "1 Month Care Support"],
      icon: <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Oasis",
      price: 499,
      features: ["15+ Medicinal Plants", "Custom Planters", "Smart Monitoring", "3 Months Care Support", "Free AI Assistant Pro"],
      icon: <Shield className="w-6 h-6 text-[#2D5A43]" />,
    },
  ];

  const handleSelectPackage = (pkgId: string) => {
    if (!auth.currentUser) {
      sessionStorage.setItem("pendingBooking", pkgId);
      toast("Please sign in to book a service.", { icon: "🔒" });
      navigate("/auth");
      return;
    }
    setFormData({ ...formData, package: pkgId });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please sign in to book a service.");
      return;
    }
    setLoading(true);
    try {
      const fullAddress = `${formData.street}, ${formData.lane}, ${formData.village}, ${formData.city}, ${formData.landmark}`;
      await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser.uid,
        name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        spaceType: formData.spaceType,
        package: formData.package,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Booking request sent! We'll contact you soon.", {
        icon: "🌿",
        style: {
          borderRadius: "1rem",
          background: "#1A2E24",
          color: "#fff",
        },
      });
      setFormData({
        name: "",
        phone: "",
        street: "",
        lane: "",
        village: "",
        city: "",
        landmark: "",
        spaceType: "balcony",
        package: "standard",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1A2E24]">
            Transform Your <span className="text-[#2D5A43]">Space.</span>
          </h1>
          <p className="text-xl text-[#5C7166] leading-relaxed">
            Our expert gardeners will help you design and setup your dream
            medicinal garden, regardless of your space size.
          </p>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -10 }}
              className={cn(
                "p-10 rounded-[3rem] border-2 transition-all relative overflow-hidden",
                formData.package === pkg.id
                  ? "border-[#2D5A43] bg-[#F4F9F6] shadow-2xl shadow-[#2D5A43]/10"
                  : "border-[#E8F3ED] bg-[#F4F9F6] hover:border-[#2D5A43]/30"
              )}
            >
              {pkg.popular && (
                <div className="absolute top-6 right-6 bg-[#2D5A43] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-[#E8F3ED]">
                {pkg.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#1A2E24]">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-[#1A2E24]">${pkg.price}</span>
                <span className="text-[#5C7166]">/setup</span>
              </div>
              <ul className="space-y-4 mb-10">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#5C7166] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPackage(pkg.id)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all",
                  formData.package === pkg.id
                    ? "bg-[#2D5A43] text-white"
                    : "bg-white text-[#2D5A43] border border-[#E8F3ED] hover:bg-[#2D5A43] hover:text-white"
                )}
              >
                Select Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-12 relative overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#2D5A43] text-white rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A2E24]">Book Your Consultation</h2>
                    <p className="text-[#5C7166]">Fill in your details and we'll get back to you.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1A2E24] uppercase tracking-wider ml-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C7166]" />
                        <input
                          required
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1A2E24] uppercase tracking-wider ml-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C7166]" />
                        <input
                          required
                          type="tel"
                          maxLength={10}
                          pattern="\d{10}"
                          placeholder="10-digit number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-[#1A2E24] uppercase tracking-wider ml-2">Detailed Address</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="Street"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 px-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Lane"
                        value={formData.lane}
                        onChange={(e) => setFormData({ ...formData, lane: e.target.value })}
                        className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 px-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Village/Area"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 px-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 px-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Landmark"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full md:col-span-2 bg-[#F4F9F6] border border-[#E8F3ED] rounded-xl py-3 px-4 focus:outline-none focus:border-[#2D5A43] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1A2E24] uppercase tracking-wider ml-2">Type of Space</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["balcony", "terrace", "indoor"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, spaceType: type })}
                          className={cn(
                            "py-3 rounded-xl font-bold capitalize transition-all border text-sm",
                            formData.spaceType === type
                              ? "bg-[#2D5A43] text-white border-[#2D5A43]"
                              : "bg-[#F4F9F6] text-[#5C7166] border-[#E8F3ED] hover:border-[#2D5A43]"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#1A2E24] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2D5A43] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-[#1A2E24]/10 disabled:opacity-50 mt-4"
                  >
                    {loading ? "Processing..." : "Confirm Booking"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
