import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    fetch(`/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error("Błąd pobierania koszyka:", err));
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <div>
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong> — {item.price} zł x {item.quantity}
                </div>
                <span>{(item.price * item.quantity).toFixed(2)} zł</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-end">
            <strong>Łącznie: {total.toFixed(2)} zł</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
