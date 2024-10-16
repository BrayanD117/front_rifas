"use client";

import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Importa el tipo del estado global

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items); // Obtener los ítems del carrito desde Redux

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index}>
            <p>Rifa: {item.raffleName}</p>
            <p>Número: {item.number}</p>
            <p>Total: {item.totalValue}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;