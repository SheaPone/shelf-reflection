import { FormEvent } from 'react';
import { useCart } from '../components/useCart';
import { BookProps } from './Catalog';

export function Cart() {
  const { cart } = useCart();
  if (cart.length === 0) {
    return <p className="margin-top-4">Your cart is empty :(</p>;
  }

  async function checkout(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      };
      const res = await fetch('/api/create-checkout-session', req);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  return (
    <>
      <h1 className="margin-bottom-3">Your Cart</h1>
      <ul>
        {cart.map((book: BookProps, index: number) => (
          <li key={index}>
            <img className="cart-image" src={book.imageUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <h4>{book.author}</h4>
            <p className="margin-bottom-4">$20</p>
          </li>
        ))}
      </ul>
      <p className="margin-bottom-1 bold">Total ${cart.length * 20}</p>
      <form onSubmit={checkout}>
        <button type="submit">Checkout</button>
      </form>
    </>
  );
}
