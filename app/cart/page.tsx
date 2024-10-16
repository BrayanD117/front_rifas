"use client";

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div>
      <h2>Carrito</h2>
      {cartItems.map((item, index) => (
        <div key={index}>
          <p>Rifa: {item.raffleName}</p>
          <p>Número Jugado: {item.number}</p>
          <p>Total: {item.totalValue}</p>
        </div>
      ))}
    </div>
  );
};

export default CartPage;