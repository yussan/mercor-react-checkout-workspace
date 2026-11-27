import { useState, FormEvent } from 'react';

interface PromoPanelProps {
  activePromo: string;
  promoMessage: string | null;
  onApplyPromo: (code: string) => void;
}

export function PromoPanel({ activePromo, promoMessage, onApplyPromo }: PromoPanelProps) {
  const [codeInput, setCodeInput] = useState(activePromo);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApplyPromo(codeInput);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <label htmlFor="promo-code-input" style={{ display: 'block', marginBottom: '0.25rem' }}>
        Promo Code
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          id="promo-code-input"
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="Enter SAVE10 or SAVE20"
        />
        <button type="submit">Apply Promo</button>
      </div>
      {promoMessage && (
        <p role="status" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {promoMessage}
        </p>
      )}
    </form>
  );
}