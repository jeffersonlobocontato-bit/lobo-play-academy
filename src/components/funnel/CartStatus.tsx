import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CartWindow {
  id: string;
  name: string | null;
  open_at: string;
  close_at: string;
  is_active: boolean;
}

interface CartStatusResult {
  isOpen: boolean;
  isLoading: boolean;
  cartWindow: CartWindow | null;
  timeUntilOpen: Date | null;
  timeUntilClose: Date | null;
  refetch: () => Promise<void>;
}

export const useCartStatus = (funnelId?: string): CartStatusResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartWindow, setCartWindow] = useState<CartWindow | null>(null);

  const fetchCartStatus = async () => {
    try {
      setIsLoading(true);
      const now = new Date().toISOString();

      // Build query
      let query = supabase
        .from("cart_windows")
        .select("*")
        .eq("is_active", true)
        .order("open_at", { ascending: true });

      // If funnel ID provided, filter by it
      if (funnelId) {
        query = query.eq("funnel_id", funnelId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching cart status:", error);
        return;
      }

      if (!data || data.length === 0) {
        setCartWindow(null);
        return;
      }

      // Find currently open window or next upcoming
      const nowDate = new Date();
      
      // First, check if any window is currently open
      const openWindow = data.find(
        (w) => new Date(w.open_at) <= nowDate && new Date(w.close_at) >= nowDate
      );

      if (openWindow) {
        setCartWindow(openWindow);
        return;
      }

      // Find the next upcoming window
      const nextWindow = data.find((w) => new Date(w.open_at) > nowDate);
      
      if (nextWindow) {
        setCartWindow(nextWindow);
      } else {
        // No open or upcoming windows
        setCartWindow(null);
      }
    } catch (error) {
      console.error("Error in fetchCartStatus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartStatus();

    // Refresh every minute
    const interval = setInterval(fetchCartStatus, 60000);
    return () => clearInterval(interval);
  }, [funnelId]);

  const now = new Date();
  const isOpen = cartWindow
    ? new Date(cartWindow.open_at) <= now && new Date(cartWindow.close_at) >= now
    : false;

  const timeUntilOpen =
    cartWindow && new Date(cartWindow.open_at) > now
      ? new Date(cartWindow.open_at)
      : null;

  const timeUntilClose =
    cartWindow && isOpen ? new Date(cartWindow.close_at) : null;

  return {
    isOpen,
    isLoading,
    cartWindow,
    timeUntilOpen,
    timeUntilClose,
    refetch: fetchCartStatus,
  };
};
