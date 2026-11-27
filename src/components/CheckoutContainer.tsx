import { useCartSync } from '../hooks/useCartSync';
import { CartItemRow } from './CartItemRow';
import { PromoPanel } from './PromoPanel';

export function CheckoutContainer() {
  const { quote, isSyncing, error, updateQuantity, applyPromo } = useCartSync();
  const hasItems = quote.items.some((item) => item.quantity > 0);

  return (
    <section aria-label="Checkout Summary">
      <div>
        {quote.items.map((item) => (
          <CartItemRow key={item.id} item={item} onUpdateQuantity={updateQuantity} />
        ))}
      </div>

      <PromoPanel
        activePromo={quote.promoCode}
        promoMessage={quote.promoMessage}
        onApplyPromo={applyPromo}
      />

      {error && (
        <p role="alert" style={{ color: '#dc2626' }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: '1.25rem', borderTop: '2px solid #0f172a', paddingTop: '0.75rem' }}>
        <div>Subtotal: ${quote.subtotal.toFixed(2)}</div>
        <div>Discount: -${quote.discount.toFixed(2)}</div>
        <div>Tax (8%): ${quote.tax.toFixed(2)}</div>
        <div>
          <strong>Total: ${quote.total.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button type="button" disabled={!hasItems || isSyncing}>
          {isSyncing ? 'Syncing Cart...' : 'Place Order'}
        </button>
      </div>
    </section>
  );
}