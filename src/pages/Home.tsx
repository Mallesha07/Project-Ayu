import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Leaf, Shield, Heart, Star, ShoppingBag, Calendar, MessageSquare } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Medicinal Plants",
      desc: "Curated selection of healing herbs for your home.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Garden Services",
      desc: "Expert care and setup for your urban green space.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Plant Assistant",
      desc: "Instant diagnosis and care tips from our AI expert.",
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2070"
            alt="Lush green garden"
            className="w-full h-full object-cover brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E24]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight">
              Bring Nature <br />
              <span className="text-[#A7D7C5]">Home.</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
              Project Ayu combines ancient wisdom with modern tech to help you
              cultivate a thriving medicinal garden in any space.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-[#2D5A43] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#234735] transition-all flex items-center gap-2 group"
              >
                Shop Plants
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/booking"
                className="bg-white text-[#1A2E24] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Book Service
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-[#1A2E24]">
              Everything Your Garden Needs
            </h2>
            <p className="text-[#5C7166] text-lg">
              We provide a complete ecosystem for urban gardening, from the
              plants themselves to expert care and AI-powered advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-10 rounded-[2.5rem] bg-[#F9FBFA] border border-[#E8F3ED] hover:border-[#2D5A43] hover:shadow-2xl hover:shadow-[#2D5A43]/5 transition-all group"
              >
                <div className="w-14 h-14 bg-[#2D5A43] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1A2E24]">
                  {feature.title}
                </h3>
                <p className="text-[#5C7166] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-[#1A2E24] rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1000"
              alt="Plant detail"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to start your <br />
              <span className="text-[#A7D7C5]">green journey?</span>
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Join thousands of urban gardeners who have transformed their
              homes with Project Ayu.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-[#2D5A43] text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-[#234735] transition-all hover:scale-105 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
