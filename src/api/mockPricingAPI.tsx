export interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface PricingQuoteRequest {
  items: CartItem[];
  promoCode: string;
}

export interface PricingQuoteResponse {
  items: CartItem[];
  promoCode: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoMessage: string | null;
}

const VALID_PROMOS: Record<string, { rate: number; minSubtotal: number }> = {
  SAVE10: { rate: 0.1, minSubtotal: 50 },
  SAVE20: { rate: 0.2, minSubtotal: 150 },
};

function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateQuoteSync(req: PricingQuoteRequest): PricingQuoteResponse {
  const subtotal = roundCents(
    req.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );

  const normalizedCode = req.promoCode.trim().toUpperCase();
  let discount = 0;
  let promoMessage: string | null = null;

  if (normalizedCode) {
    const rule = VALID_PROMOS[normalizedCode];
    if (!rule) {
      promoMessage = `Promo code "${normalizedCode}" is invalid or expired.`;
    } else if (subtotal < rule.minSubtotal) {
      promoMessage = `Minimum order of $${rule.minSubtotal.toFixed(2)} required for ${normalizedCode}.`;
    } else {
      discount = roundCents(subtotal * rule.rate);
      promoMessage = `Applied ${normalizedCode} (-$${discount.toFixed(2)})`;
    }
  }

  const taxable = Math.max(0, roundCents(subtotal - discount));
  const tax = roundCents(taxable * 0.08);
  const total = roundCents(taxable + tax);

  return {
    items: req.items,
    promoCode: normalizedCode,
    subtotal,
    discount,
    tax,
    total,
    promoMessage,
  };
}

export async function fetchPricingQuote(
  req: PricingQuoteRequest,
  signal?: AbortSignal
): Promise<PricingQuoteResponse> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      resolve(calculateQuoteSync(req));
    }, 30);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Request aborted', 'AbortError'));
    });
  });
}