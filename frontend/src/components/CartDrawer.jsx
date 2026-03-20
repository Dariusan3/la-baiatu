import React, { useState } from "react";
import { Trash2, Plus, Minus, X, Clock, MapPin, ChevronRight, Info, Check, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const MIN_ORDER = 25;

export default function CartDrawer() {
  const {
    items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart,
    subtotal, discountAmount, totalPrice, coupon, validateCoupon, removeCoupon,
    placeOrder, orderStatus, orderError, lastOrder, resetOrderStatus,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("livrare");
  const [address, setAddress] = useState({ strada: "", numar: "", oras: "" });
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const remaining = MIN_ORDER - totalPrice;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    const result = await validateCoupon(couponCode.trim());
    setCouponLoading(false);
    if (!result.valid) {
      setCouponError(result.message);
    } else {
      setCouponError("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ro`
          );
          const data = await res.json();
          if (data.address) {
            setAddress({
              strada: data.address.road || data.address.street || "",
              numar: data.address.house_number || "",
              oras: data.address.city || data.address.town || data.address.village || "",
            });
          }
        } catch {
          // silently fail
        }
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 10000 }
    );
  };

  const handleCheckout = async () => {
    await placeOrder({
      deliveryMethod,
      address: deliveryMethod === "livrare" ? address : null,
      phone,
      notes,
    });
  };

  const handleClose = () => {
    if (orderStatus === "success") resetOrderStatus();
    setIsOpen(false);
  };

  // Success screen
  if (orderStatus === "success" && lastOrder) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md bg-[#1a2332] text-white border-r-0 p-0 flex flex-col"
        >
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <SheetTitle className="text-white text-2xl font-bold mb-3">Comanda a fost plasată!</SheetTitle>
            <p className="text-white/60 mb-2">Nr. comandă: #{lastOrder.id.slice(0, 8)}</p>
            <p className="text-white/60 mb-6">Total: {lastOrder.total.toFixed(2)} RON</p>
            <p className="text-white/50 text-sm mb-8">
              După plasarea comenzii, veți vedea un ceas care indică timpul estimat de pregătire.
            </p>
            <Button
              onClick={handleClose}
              className="bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white px-8 h-12"
            >
              Înapoi la meniu
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[#5b9bd5] hover:text-[#4a8ac4] text-sm underline transition-colors"
              >
                Șterge
              </button>
            )}
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
                        {item.quantity === 1 ? (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white/60" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-white/60" />
                          </button>
                        )}
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
                {coupon ? (
                  <div className="flex items-center gap-2 mt-2 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-400 text-sm font-medium">{coupon.code}</p>
                      <p className="text-green-400/70 text-xs">{coupon.description}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-white/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : !showCoupon ? (
                  <button
                    onClick={() => setShowCoupon(true)}
                    className="text-[#5b9bd5] text-sm underline hover:text-[#4a8ac4] transition-colors"
                  >
                    Introduceți codul cuponului
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        placeholder="Cod cupon"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9"
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white h-9"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplică"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-xs mt-1.5">{couponError}</p>
                    )}
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
                      <input
                        type="radio"
                        name="delivery"
                        value={method.id}
                        checked={deliveryMethod === method.id}
                        onChange={() => setDeliveryMethod(method.id)}
                        className="sr-only"
                      />
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
                  <button
                    onClick={handleGeolocate}
                    disabled={geoLoading}
                    className="flex items-center gap-2 text-[#5b9bd5] text-sm mb-4 hover:text-[#4a8ac4] transition-colors disabled:opacity-50"
                  >
                    {geoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
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

              {/* Phone & notes */}
              <div className="px-5 py-4 border-b border-white/10">
                <div className="mb-3">
                  <Label className="text-white/60 text-xs mb-1 block">Telefon</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs mb-1 block">Notă pentru bucătărie (opțional)</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: fără ceapă, alergii..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10"
                  />
                </div>
              </div>

              {/* Price summary */}
              {coupon && (
                <div className="px-5 py-3 border-b border-white/10 space-y-1">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} RON</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Reducere ({coupon.discount_percent}%)</span>
                    <span>-{discountAmount.toFixed(2)} RON</span>
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
            {orderError && (
              <div className="bg-red-500/90 text-white text-xs font-medium px-5 py-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {orderError}
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
                onClick={handleCheckout}
                disabled={remaining > 0 || orderStatus === "loading"}
                className="flex-1 bg-[#5b9bd5] hover:bg-[#4a8ac4] text-white font-bold h-12 disabled:opacity-50"
              >
                {orderStatus === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>La casă {totalPrice.toFixed(2)} RON</>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
