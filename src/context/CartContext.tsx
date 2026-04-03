import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const pendingCart = sessionStorage.getItem("pendingCartItem");
        if (pendingCart) {
          try {
            const item = JSON.parse(pendingCart);
            setItems((prev) => {
              const existing = prev.find((i) => i.id === item.id);
              if (existing) {
                return prev.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
              }
              return [...prev, { ...item, quantity: item.quantity }];
            });
            toast.success(`${item.name} added to cart!`, { icon: "🛒" });
            sessionStorage.removeItem("pendingCartItem");
          } catch (e) {
            console.error("Error parsing pending cart item", e);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        toast.success(`Added another ${item.name} to cart`);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.error("Item removed from cart");
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeItem, updateQuantity, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
