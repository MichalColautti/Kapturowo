import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = 1; 

  const fetchCart = () => {
    fetch(`/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error("Błąd pobierania koszyka:", err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = (productId, sizeId) => {
    fetch(`/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId })
    })
      .then(() => {
        fetchCart();
      })
      .catch(err => console.error("Błąd usuwania z koszyka:", err));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const handlePayment = async () => {
  const stripe = await stripePromise;

  fetch("/api/payment/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      }
    })
    .catch(err => console.error("Błąd płatności:", err));
};

  return (
    <div className="container mt-4">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <div>
          <ul className="list-group">
            {cartItems.map((item) => (
              <li
                key={`${item.product_id}-${item.size_id}`}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong> — {item.price} zł x {item.quantity}
                  <br />
                  <small>Rozmiar: {item.size}</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-3">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.product_id, item.size_id)}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-end">
            <strong>Łącznie: {total.toFixed(2)} zł</strong>
            <br />
            <button className="btn btn-primary mt-2" onClick={handlePayment}>
              Przejdź do płatności
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
