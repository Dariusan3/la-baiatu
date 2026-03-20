import React, { createContext, useContext, useState, useCallback } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code, discount_percent, description }
  const [orderStatus, setOrderStatus] = useState(null); // null | "loading" | "success" | "error"
  const [orderError, setOrderError] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  const addItem = useCallback((menuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const validateCoupon = useCallback(async (code) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code, discount_percent: data.discount_percent, description: data.description });
        return { valid: true, description: data.description };
      }
      setCoupon(null);
      return { valid: false, message: data.message };
    } catch {
      return { valid: false, message: "Eroare de conexiune." };
    }
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = coupon ? subtotal * (coupon.discount_percent / 100) : 0;
  const totalPrice = subtotal - discountAmount;

  const placeOrder = useCallback(async ({ deliveryMethod, address, phone, notes }) => {
    setOrderStatus("loading");
    setOrderError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          delivery_method: deliveryMethod,
          address,
          coupon_code: coupon?.code || null,
          phone,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Eroare la plasarea comenzii.");
      }
      const order = await res.json();
      setLastOrder(order);
      setOrderStatus("success");
      setItems([]);
      setCoupon(null);
      return order;
    } catch (e) {
      setOrderError(e.message);
      setOrderStatus("error");
      return null;
    }
  }, [items, coupon]);

  const resetOrderStatus = useCallback(() => {
    setOrderStatus(null);
    setOrderError("");
    setLastOrder(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
        coupon,
        validateCoupon,
        removeCoupon,
        placeOrder,
        orderStatus,
        orderError,
        lastOrder,
        resetOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
