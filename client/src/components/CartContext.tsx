import { BookProps } from '../pages/Catalog';
import React, { createContext, useState } from 'react';

export type CartValue = {
  cart: BookProps[];
  addToCart: (product: BookProps) => void;
};

const defaultCartValue: CartValue = {
  cart: [],
  addToCart: () => undefined,
};

export const CartContext = createContext(defaultCartValue);

type Props = {
  children: React.ReactNode;
};

export function CartProvider({ children }: Props) {
  const [cart, setCart] = useState<BookProps[]>([]);

  function addToCart(item: BookProps): void {
    setCart([...cart, item]);
  }
  const cartContextValues = {
    cart,
    addToCart,
  };
  return (
    <CartContext.Provider value={cartContextValues}>
      {children}
    </CartContext.Provider>
  );
}
