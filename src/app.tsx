import { CheckoutContainer } from './components/CheckoutContainer';

export default function App() {
  return (
    <main style={{ maxWidth: '640px', margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Order Checkout</h1>
      <CheckoutContainer />
    </main>
  );
}