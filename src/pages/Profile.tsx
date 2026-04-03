import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserIcon, ShoppingBag, Calendar, Settings, LogOut, ArrowRight, Package, CalendarDays, MapPin, Phone, Mail, Shield, CheckCircle2, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: any[];
}

interface Booking {
  id: string;
  date: string;
  status: string;
  package: string;
  address: any;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch orders
        const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
        const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
          const ordersList = snapshot.docs.map(doc => ({
            id: doc.id,
            date: doc.data().createdAt?.toDate().toLocaleDateString() || "Recent",
            ...doc.data()
          })) as Order[];
          setUserOrders(ordersList);
        });

        // Fetch bookings
        const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
          const bookingsList = snapshot.docs.map(doc => ({
            id: doc.id,
            date: doc.data().createdAt?.toDate().toLocaleDateString() || "Recent",
            ...doc.data()
          })) as Booking[];
          setUserBookings(bookingsList);
          setLoading(false);
        });

        return () => {
          unsubscribeOrders();
          unsubscribeBookings();
        };
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { icon: "👋" });
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const tabs = [
    { id: "orders", name: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "bookings", name: "Bookings", icon: <Calendar className="w-5 h-5" /> },
    { id: "settings", name: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    if (!address) return 'N/A';
    const parts = [address.street, address.lane, address.village, address.city, address.landmark].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#F4F9F6] rounded-[3rem] p-10 border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5 text-center space-y-6">
              <div className="w-32 h-32 bg-[#2D5A43] text-white rounded-full flex items-center justify-center mx-auto text-4xl font-bold border-4 border-white shadow-xl">
                {userData?.name?.charAt(0) || "U"}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#1A2E24]">{userData?.name || "User"}</h2>
                <p className="text-[#5C7166] text-sm font-medium">{userData?.email || "Email"}</p>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#2D5A43]/10 text-[#2D5A43] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                {userData?.role === "admin" ? "Administrator" : "Premium Member"}
              </div>
              <div className="pt-6 border-t border-[#E8F3ED] flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                      activeTab === tab.id
                        ? "bg-[#2D5A43] text-white shadow-lg shadow-[#2D5A43]/20"
                        : "text-[#5C7166] hover:bg-white hover:text-[#1A2E24]"
                    )}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-[#1A2E24] rounded-[2.5rem] p-8 text-white space-y-4 relative overflow-hidden">
              <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
              <h4 className="text-xl font-bold">Green Impact</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                You have planted {userOrders.length} trees through your orders. Keep growing!
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-[#A7D7C5]">
                My Impact <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#F4F9F6] rounded-[3rem] p-10 md:p-16 border border-[#E8F3ED] shadow-2xl shadow-[#2D5A43]/5 min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-3xl font-bold text-[#1A2E24]">Order History</h3>
                      <Link to="/shop" className="text-[#2D5A43] font-bold text-sm hover:underline">
                        Shop More
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {userOrders.length === 0 ? (
                        <div className="text-center py-12 text-[#5C7166]">No orders yet.</div>
                      ) : (
                        userOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-8 bg-white rounded-[2.5rem] border border-[#E8F3ED] hover:border-[#2D5A43] transition-all group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#F4F9F6] rounded-2xl flex items-center justify-center text-[#2D5A43] border border-[#E8F3ED]">
                                  <Package className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-bold text-[#1A2E24]">{order.id}</h4>
                                  <p className="text-[#5C7166] text-sm font-medium">{order.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <span className="text-sm font-bold text-[#5C7166] uppercase tracking-widest block mb-1">Total</span>
                                  <span className="text-xl font-bold text-[#1A2E24]">₹{order.total.toFixed(2)}</span>
                                </div>
                                <div className={cn(
                                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
                                  order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                )}>
                                  {order.status}
                                </div>
                                <button className="p-3 bg-[#F4F9F6] rounded-xl hover:bg-[#2D5A43] hover:text-white transition-all">
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#E8F3ED] flex gap-4">
                              {order.items.map((item: any, i: number) => (
                                <span key={i} className="text-sm font-bold text-[#5C7166] bg-[#F4F9F6] px-3 py-1 rounded-lg border border-[#E8F3ED]">
                                  {item.name} (x{item.quantity})
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "bookings" && (
                  <motion.div
                    key="bookings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-3xl font-bold text-[#1A2E24]">Garden Bookings</h3>
                      <Link to="/booking" className="text-[#2D5A43] font-bold text-sm hover:underline">
                        New Booking
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {userBookings.length === 0 ? (
                        <div className="text-center py-12 text-[#5C7166]">No bookings yet.</div>
                      ) : (
                        userBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-8 bg-white rounded-[2.5rem] border border-[#E8F3ED] hover:border-[#2D5A43] transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#F4F9F6] rounded-2xl flex items-center justify-center text-[#2D5A43] border border-[#E8F3ED]">
                                  <CalendarDays className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-bold text-[#1A2E24] capitalize">{booking.package}</h4>
                                  <p className="text-[#5C7166] text-sm font-medium">{booking.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
                                  {booking.status}
                                </div>
                                <button className="p-3 bg-[#F4F9F6] rounded-xl hover:bg-[#2D5A43] hover:text-white transition-all">
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#E8F3ED] flex items-center gap-6 text-[#5C7166] text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#2D5A43] shrink-0" />
                                <span className="truncate max-w-xs" title={formatAddress(booking.address)}>
                                  {formatAddress(booking.address)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#2D5A43]" />
                                Professional Gardener Assigned
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <h3 className="text-3xl font-bold text-[#1A2E24]">Account Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-[#1A2E24]">Personal Information</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#1A2E24] uppercase tracking-widest ml-4">Full Name</label>
                            <input
                              type="text"
                              defaultValue={userData?.name || ""}
                              className="w-full bg-white border border-[#E8F3ED] rounded-2xl py-4 px-6 focus:outline-none focus:border-[#2D5A43] transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#1A2E24] uppercase tracking-widest ml-4">Email Address</label>
                            <input
                              type="email"
                              defaultValue={userData?.email || ""}
                              readOnly
                              className="w-full bg-white border border-[#E8F3ED] rounded-2xl py-4 px-6 focus:outline-none focus:border-[#2D5A43] transition-all opacity-70 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-[#1A2E24]">Security</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#1A2E24] uppercase tracking-widest ml-4">Current Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full bg-white border border-[#E8F3ED] rounded-2xl py-4 px-6 focus:outline-none focus:border-[#2D5A43] transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#1A2E24] uppercase tracking-widest ml-4">New Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full bg-white border border-[#E8F3ED] rounded-2xl py-4 px-6 focus:outline-none focus:border-[#2D5A43] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-[#E8F3ED] flex justify-end">
                      <button className="bg-[#2D5A43] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#234735] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#2D5A43]/20">
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
