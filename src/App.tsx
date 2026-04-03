/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Booking from "./pages/Booking";
import AIChat from "./pages/AIChat";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="booking" element={<Booking />} />
            <Route path="ai-assistant" element={<AIChat />} />
            <Route path="auth" element={<Auth />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  );
}
