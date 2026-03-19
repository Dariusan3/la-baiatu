import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [menuRes, catRes, revRes, infoRes] = await Promise.all([
        axios.get(`${API}/menu`),
        axios.get(`${API}/menu/categories`),
        axios.get(`${API}/reviews`),
        axios.get(`${API}/restaurant-info`),
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
      setReviews(revRes.data);
      setRestaurantInfo(infoRes.data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="loading-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-foreground">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background" data-testid="app-container">
        <Toaster position="top-right" />
        <Navbar />
        <HeroSection info={restaurantInfo} />
        <AboutSection info={restaurantInfo} />
        <MenuSection items={menuItems} categories={categories} />
        <GallerySection />
        <ReviewsSection reviews={reviews} />
        <ContactSection info={restaurantInfo} />
        <Footer info={restaurantInfo} />
        <CartButton />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
