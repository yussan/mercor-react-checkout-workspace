import { CartItem } from '../api/mockPricingApi';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity }: CartItemRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div>
        <strong>{item.name}</strong>
        <div>${item.unitPrice.toFixed(2)} each</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onUpdateQuantity(item.id, -1)}
          disabled={item.quantity === 0}
        >
          -
        </button>
        <span aria-label={`Quantity for ${item.name}`}>{item.quantity}</span>
        <button
          type="button"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onUpdateQuantity(item.id, 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}