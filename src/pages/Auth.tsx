import { useState } from "react";
import { motion } from "motion/react";
import { Leaf, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import toast from "react-hot-toast";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "User",
          email: user.email,
          role: "client",
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Welcome to Project Ayu!", { icon: "🌿" });
      navigate("/");
    } catch (err: any) {
      console.error("Google Sign In error:", err);
      toast.error(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6 bg-[#F9FBFA]">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block space-y-12"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2D5A43]/10 text-[#2D5A43] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Secure Green-Tech Platform
            </div>
            <h1 className="text-6xl font-bold text-[#1A2E24] leading-tight tracking-tight">
              Join the <br />
              <span className="text-[#2D5A43]">Green Revolution.</span>
            </h1>
            <p className="text-xl text-[#5C7166] leading-relaxed max-w-md">
              Create an account to track your orders, manage your garden
              bookings, and get personalized AI plant care advice.
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Exclusive access to rare medicinal plants",
              "Priority booking for garden services",
              "Personalized AI plant diagnosis history",
              "Early access to new green-tech features",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-lg font-medium text-[#1A2E24]">
                <div className="w-8 h-8 bg-[#2D5A43] text-white rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5"
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-[#2D5A43] p-2 rounded-xl">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[#1A2E24]">Project Ayu</span>
          </div>

          <div className="space-y-2 mb-12">
            <h2 className="text-4xl font-bold text-[#1A2E24]">
              Welcome
            </h2>
            <p className="text-[#5C7166]">
              Sign in to access your account.
            </p>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-[#E8F3ED] text-[#1A2E24] py-5 rounded-2xl font-bold text-xl hover:bg-[#F9FBFA] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E8F3ED] text-center">
            <p className="text-[#5C7166] text-sm">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
