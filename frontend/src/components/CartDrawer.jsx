import React, { useState } from "react";
import { Trash2, Plus, X, Clock, MapPin, ChevronRight, Info } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const MIN_ORDER = 25;

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("livrare");
  const [address, setAddress] = useState({ strada: "", numar: "", oras: "" });

  const remaining = MIN_ORDER - totalPrice;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md bg-[#1a2332] text-white border-r-0 p-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <SheetTitle className="text-white font-bold text-xl">Coș</SheetTitle>
            <button
              onClick={clearCart}
              className="text-[#5b9bd5] hover:text-[#4a8ac4] text-sm underline transition-colors"
            >
              Șterge
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-white/50">
              <p className="text-lg mb-2">Coșul este gol</p>
              <p className="text-sm">Adaugă preparate din meniu</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="p-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-white/10 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-white text-sm flex-1">{item.name}</h4>
                      <span className="text-[#5b9bd5] font-bold text-sm whitespace-nowrap">
                        {(item.price * item.quantity).toFixed(2)} RON
                      </span>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                      <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-white/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white/60" />
                        </button>
                        <span className="px-4 text-sm font-medium text-white min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon section */}
              <div className="px-5 pb-4 border-b border-white/10">
                <p className="text-white/60 text-sm mb-1">Ai un cupon promoțional?</p>
                {!showCoupon ? (
                  <button
                    onClick={() => setShowCoupon(true)}
                    className="text-[#5b9bd5] text-sm underline hover:text-[#4a8ac4] transition-colors"
                  >
                    Introduceți codul cuponului
                  </button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cod cupon"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9"
                    />
                    <Button size="sm" className="bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white h-9">
                      Aplică
                    </Button>
                  </div>
                )}
              </div>

              {/* Delivery options */}
              <div className="px-5 py-4 border-b border-white/10">
                <h4 className="font-bold text-white mb-3">Opțiuni de livrare</h4>

                {/* ASAP option */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/60 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">Cât mai curând posibil</p>
                    <p className="text-white/50 text-xs">
                      După plasarea comenzii, veți vedea un ceas care indică timpul estimat de pregătire.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 shrink-0" />
                </div>

                {/* Delivery method */}
                <p className="text-white/60 text-sm mb-2">Metoda de realizare a comenzii</p>
                <div className="space-y-2">
                  {[
                    { id: "livrare", label: "Livrare" },
                    { id: "ridicare", label: "Ridicare personală" },
                    { id: "restaurant", label: "Servește în restaurant" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        deliveryMethod === method.id
                          ? "bg-white/10 border border-[#5b9bd5]"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deliveryMethod === method.id
                            ? "border-[#5b9bd5]"
                            : "border-white/40"
                        }`}
                      >
                        {deliveryMethod === method.id && (
                          <div className="w-2 h-2 rounded-full bg-[#5b9bd5]" />
                        )}
                      </div>
                      <span className="text-white text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Address form (only for delivery) */}
              {deliveryMethod === "livrare" && (
                <div className="px-5 py-4 border-b border-white/10">
                  <button className="flex items-center gap-2 text-[#5b9bd5] text-sm mb-4 hover:text-[#4a8ac4] transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span className="underline">Localizați-mă</span>
                  </button>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="col-span-2">
                      <Label className="text-white/60 text-xs mb-1 block">Strada</Label>
                      <Input
                        value={address.strada}
                        onChange={(e) => setAddress((a) => ({ ...a, strada: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs mb-1 block">Numărul</Label>
                      <Input
                        value={address.numar}
                        onChange={(e) => setAddress((a) => ({ ...a, numar: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white h-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs mb-1 block">Orașul</Label>
                    <Input
                      value={address.oras}
                      onChange={(e) => setAddress((a) => ({ ...a, oras: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white h-10"
                    />
                  </div>

                  <div className="bg-[#5b9bd5]/20 border border-[#5b9bd5]/30 rounded-lg p-3 mt-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#5b9bd5] shrink-0" />
                    <p className="text-white/70 text-xs">
                      Introduceți adresa dvs. pentru a afla costul de livrare.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10">
            {remaining > 0 && (
              <div className="bg-orange-500/90 text-white text-xs font-medium px-5 py-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Valoarea minimă a comenzii lipsește {remaining.toFixed(2)} RON
              </div>
            )}
            <div className="p-4 flex gap-3">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white h-12"
              >
                Continuă cumpărăturile
              </Button>
              <Button
                disabled={remaining > 0}
                className="flex-1 bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white font-bold h-12 disabled:opacity-50"
              >
                La casă {totalPrice.toFixed(2)} RON
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
