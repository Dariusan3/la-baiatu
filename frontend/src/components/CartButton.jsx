import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-40 bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
      data-testid="cart-button"
    >
      <span className="font-bold text-lg">Coș</span>
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-[#5b9bd5] text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
        {totalItems}
      </span>
    </button>
  );
}
