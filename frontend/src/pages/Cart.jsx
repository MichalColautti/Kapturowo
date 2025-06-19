import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Cart() {
  const { user } = useAuth();
  const userId = user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    country: "",
    city: "",
    postalCode: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error("Błąd pobierania koszyka:", err));
  }, [userId]);

  const validate = () => {
    const newErrors = {};
    if (!address.country) newErrors.country = "Wymagane";
    if (!address.city) newErrors.city = "Wymagane";
    if (!address.postalCode) newErrors.postalCode = "Wymagane";
    if (!address.street) newErrors.street = "Wymagane";
    if (!address.buildingNumber) newErrors.buildingNumber = "Wymagane";
    if (!address.apartmentNumber) newErrors.apartmentNumber = "Wymagane";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!validate()) return;

    const stripe = await stripePromise;

    fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cartItems, address }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.sessionId) {
          stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else if (data.error) {
          alert(data.error);
        }
      })
      .catch(err => console.error("Błąd płatności:", err));
  };

  const handleRemoveItem = (productId, sizeId) => {
    fetch(`/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId }),
    })
    .then(res => {
      if (!res.ok) throw new Error("Nie udało się usunąć produktu");
      setCartItems(prevItems =>
        prevItems.filter(
          item => !(item.product_id === productId && item.size_id === sizeId)
        )
      );
    })
    .catch(err => alert(err.message));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!userId) {
    return <p>Musisz być zalogowany, aby zobaczyć koszyk.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
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
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveItem(item.product_id, item.size_id)}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3>Adres dostawy</h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              handlePayment();
            }}
            noValidate
          >
            {[
              { label: "Kraj", name: "country" },
              { label: "Miasto", name: "city" },
              { label: "Kod pocztowy", name: "postalCode" },
              { label: "Ulica", name: "street" },
              { label: "Numer budynku", name: "buildingNumber" },
              { label: "Numer mieszkania", name: "apartmentNumber" },
            ].map(({ label, name }) => (
              <div key={name} className="mb-2">
                <label className="form-label">{label}</label>
                <input
                  type="text"
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  name={name}
                  value={address[name]}
                  onChange={handleInputChange}
                  required
                />
                {errors[name] && (
                  <div className="invalid-feedback">{errors[name]}</div>
                )}
              </div>
            ))}

            <div className="text-end mt-3">
              <strong>Łącznie: {total.toFixed(2)} zł</strong>
              <br />
              <button type="submit" className="btn btn-primary mt-2">
                Przejdź do płatności
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Cart;
