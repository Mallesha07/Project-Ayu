import { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Package, Leaf, CheckCircle2, Trash2, Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== "7760mallesh@gmail.com") {
        navigate("/");
        toast.error("Unauthorized access");
      }
    });

    const qBookings = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qProducts = collection(db, "products");
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubBookings();
      unsubProducts();
    };
  }, [navigate]);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2D5A43]" />
      </div>
    );
  }

  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    if (!address) return 'N/A';
    const parts = [address.street, address.lane, address.village, address.city, address.landmark].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold text-[#1A2E24] mb-8">Admin Dashboard</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#1A2E24] mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#2D5A43]" />
                Recent Bookings
              </h2>
              <div className="bg-[#F4F9F6] rounded-[2rem] border border-[#E8F3ED] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#E8F3ED] border-b border-[#E8F3ED]">
                      <tr>
                        <th className="p-6 font-bold text-[#1A2E24]">Customer</th>
                        <th className="p-6 font-bold text-[#1A2E24]">Package</th>
                        <th className="p-6 font-bold text-[#1A2E24]">Address</th>
                        <th className="p-6 font-bold text-[#1A2E24]">Status</th>
                        <th className="p-6 font-bold text-[#1A2E24]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8F3ED]">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white transition-colors">
                          <td className="p-6">
                            <div className="font-bold text-[#1A2E24]">{booking.name}</div>
                            <div className="text-sm text-[#5C7166]">{booking.phone}</div>
                          </td>
                          <td className="p-6 capitalize text-[#5C7166]">{booking.package}</td>
                          <td className="p-6 text-[#5C7166] max-w-xs truncate" title={formatAddress(booking.address)}>
                            {formatAddress(booking.address)}
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'processing')}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                title="Mark Processing"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                title="Mark Completed"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-[#5C7166]">No bookings yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1A2E24] mb-6 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-[#2D5A43]" />
                Manage Plants
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-[#F4F9F6] p-4 rounded-2xl border border-[#E8F3ED] flex flex-col">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-4" />
                    <h3 className="font-bold text-[#1A2E24] mb-1">{product.name}</h3>
                    <p className="text-[#5C7166] text-sm mb-4">₹{product.price}</p>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
