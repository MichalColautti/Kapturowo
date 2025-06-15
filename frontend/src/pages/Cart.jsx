import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import ProductSlider from "../components/Products_slider";
import "bootstrap/dist/css/bootstrap.min.css"; // Upewnij się, że to jest zaimportowane gdzieś globalnie w Twojej aplikacji

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = 1; // Zastąp to rzeczywistym ID użytkownika z kontekstu użytkownika/autoryzacji

  const fetchCart = () => {
    fetch(`/api/cart/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCartItems(data))
      .catch((err) => {
        console.error("Błąd pobierania koszyka:", err);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (productId, sizeId, delta) => {
    const currentItem = cartItems.find(
      (item) => item.product_id === productId && item.size_id === sizeId
    );

    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);

    // Optymistyczna aktualizacja UI
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId && item.size_id === sizeId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Wysyłanie żądania do API
    fetch(`/api/cart/update-quantity`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId, newQuantity }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Błąd aktualizacji ilości na backendzie:", res.status);
          fetchCart();
        }
      })
      .catch((err) => {
        console.error("Błąd sieci podczas aktualizacji ilości:", err);
        fetchCart();
      });
  };

  const removeFromCart = (productId, sizeId) => {
    // Optymistyczne usunięcie z UI
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product_id === productId && item.size_id === sizeId)
      )
    );

    fetch(`/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Błąd usuwania z koszyka na backendzie:", res.status);
          fetchCart();
        }
      })
      .catch((err) => {
        console.error("Błąd sieci podczas usuwania z koszyka:", err);
        fetchCart();
      });
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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Brak URL w odpowiedzi sesji Stripe:", data);
        }
      })
      .catch((err) => console.error("Błąd płatności:", err));
  };

  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Błąd pobierania produktów:", err));

    fetch("/api/products/latest")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setLatestProducts(data))
      .catch((err) =>
        console.error("Błąd pobierania najnowszych produktów:", err)
      );
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-3 mb-4"
          style={{ fontWeight: 400 }}
        >
          Koszyk
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead mb-4">
              Koszyk wygląda na pusty? Zobacz naszą kolekcję.
            </p>
            {/* Przekazuję propsy imageHeight i imageAspectRatio do ProductSlider,
                jeśli ProductSlider ich potrzebuje do stylizacji obrazków */}
            <ProductSlider
              products={products}
              title="Zobacz inne produkty"
              imageHeight="250px" // Przykładowa wysokość, dostosuj
              imageAspectRatio="3/4" // Przykładowy aspect ratio, dostosuj
            />
            <ProductSlider
              products={latestProducts}
              title="Najnowsze produkty"
              imageHeight="250px" // Przykładowa wysokość, dostosuj
              imageAspectRatio="3/4" // Przykładowy aspect ratio, dostosuj
            />
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={`${item.product_id}-${item.size_id}`}
                className="d-flex align-items-start py-4 border-bottom"
              >
                {/* Lewa kolumna: Obrazek */}
                <div
                  className="flex-shrink-0 me-4"
                  style={{ width: "110px", height: "160px" }}
                >
                  {/* TUTAJ ZMIANA: Używam item.imageUrl, tak jak w komponencie Product */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl} // Zmieniono na item.imageUrl
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}
                </div>

                {/* Środkowa kolumna: Nazwa, Rozmiar, Ilość */}
                <div className="flex-grow-1 d-flex flex-column justify-content-start pt-1">
                  <h3 className="fs-5 fw-bold text-uppercase mb-2 text-dark">
                    {item.name}
                  </h3>
                  <p className="text-muted small mb-1">
                    Rozmiar: <span className="fw-semibold">{item.size}</span>
                  </p>
                  <div className="d-flex align-items-center mt-2">
                    <span className="small text-muted me-2">Ilość:</span>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      onClick={() =>
                        updateQuantity(item.product_id, item.size_id, -1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-2 fw-semibold text-dark">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      onClick={() =>
                        updateQuantity(item.product_id, item.size_id, 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="btn btn-link text-danger text-decoration-none ms-3 small"
                      onClick={() =>
                        removeFromCart(item.product_id, item.size_id)
                      }
                    >
                      Usuń
                    </button>
                  </div>
                </div>

                {/* Prawa kolumna: Cena */}
                <div className="flex-shrink-0 d-flex flex-column align-items-end ms-auto ps-4">
                  <span className="fs-5 fw-bold text-dark">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                </div>
              </div>
            ))}

            {/* Suma i przycisk płatności */}
            <div className="d-flex flex-column align-items-end mt-4 pt-3">
              <div className="fs-5 fw-bold text-dark mb-3">
                Łącznie: {total.toFixed(2)} zł
              </div>
              <button className="btn btn-dark btn-lg" onClick={handlePayment}>
                Przejdź do płatności
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
