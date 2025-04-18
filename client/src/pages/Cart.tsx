import { useCart } from '../components/useCart';
import { BookProps } from './Catalog';

export function Cart() {
  const { cart } = useCart();
  if (cart.length === 0) {
    return <p>Your cart is empty</p>;
  }
  return (
    <>
      <h1>Your Cart</h1>
      <ul>
        {cart.map((book: BookProps, index: number) => (
          <li key={index}>
            <img className="cart-image" src={book.imageUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <h4>{book.author}</h4>
            <p className="margin-bottom-2">$20</p>
          </li>
        ))}
      </ul>
      <p>Total ${cart.length * 20}</p>
      <button>Checkout</button>
    </>
  );
}
