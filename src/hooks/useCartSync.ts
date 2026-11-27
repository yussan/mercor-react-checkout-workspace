import { useState, useCallback } from 'react';
import {
  CartItem,
  PricingQuoteResponse,
  calculateQuoteSync,
  fetchPricingQuote,
} from '../api/mockPricingApi';

const INITIAL_ITEMS: CartItem[] = [
  { id: 'kb-75', name: '75% Mechanical Keyboard', unitPrice: 120, quantity: 1 },
  { id: 'ms-pro', name: 'Wireless Ergonomic Mouse', unitPrice: 60, quantity: 1 },
];

export function useCartSync(initialItems: CartItem[] = INITIAL_ITEMS) {
  const [quote, setQuote] = useState<PricingQuoteResponse>(() =>
    calculateQuoteSync({ items: initialItems, promoCode: '' })
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncWithServer = useCallback(
    async (nextItems: CartItem[], nextPromo: string) => {
      setIsSyncing(true);
      setError(null);
      try {
        // BUG 1: No AbortController and no monotonic request sequence guard.
        // An older, slower response will silently overwrite a newer response.
        const latest = await fetchPricingQuote({
          items: nextItems,
          promoCode: nextPromo,
        });
        setQuote(latest);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sync cart');
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      // BUG 2: Captures stale `quote` from closure if called rapidly before re-render.
      const nextItems = quote.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      );
      void syncWithServer(nextItems, quote.promoCode);
    },
    [quote, syncWithServer]
  );

  const applyPromo = useCallback(
    (code: string) => {
      // BUG 2: Also reads stale `quote.items` if triggered while a quantity request is in-flight.
      void syncWithServer(quote.items, code);
    },
    [quote.items, syncWithServer]
  );

  return {
    quote,
    isSyncing,
    error,
    updateQuantity,
    applyPromo,
  };
}