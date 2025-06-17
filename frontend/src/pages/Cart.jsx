import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    country: "",
    city: "",
    postalCode: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: ""
  });
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

    const data = {
      cartItems,
      userId,
      address
    };

    fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(({ sessionId }) => {
      if (sessionId) {
        stripe.redirectToCheckout({ sessionId });
      }
    })
    .catch(err => console.error(err));
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

          {/* 🏠 Adres dostawy */}
          <div className="mt-4">
            <h4>Adres dostawy</h4>
            <div className="row">
              <div className="col-md-6">
                <input type="text" className="form-control mb-2" placeholder="Kraj"
                  value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                <input type="text" className="form-control mb-2" placeholder="Miasto"
                  value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input type="text" className="form-control mb-2" placeholder="Kod pocztowy"
                  value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control mb-2" placeholder="Ulica"
                  value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                <input type="text" className="form-control mb-2" placeholder="Numer budynku"
                  value={address.buildingNumber} onChange={(e) => setAddress({ ...address, buildingNumber: e.target.value })} />
                <input type="text" className="form-control mb-2" placeholder="Numer mieszkania"
                  value={address.apartmentNumber} onChange={(e) => setAddress({ ...address, apartmentNumber: e.target.value })} />
              </div>
            </div>
          </div>

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
