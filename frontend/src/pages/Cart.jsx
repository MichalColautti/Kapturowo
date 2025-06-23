import React, { useEffect, useState } from "react"; // Poprawka: Usunięto podwójny import
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../AuthContext";
import ProductSlider from "../components/Products_slider"; // Pamiętaj, aby ścieżka była poprawna

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
    apartmentNumber: "",
  });
  const [errors, setErrors] = useState({});

  // Dodanie stanów i logiki pobierania produktów/najnowszych produktów
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Produkty
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Błąd pobierania produktów:", err));

    // Najnowsze produkty
    fetch("/api/products/latest")
      .then((res) => res.json())
      .then((data) => setLatestProducts(data))
      .catch((err) =>
        console.error("Błąd pobierania najnowszych produktów:", err)
      );
  }, []); // Pusta tablica zależności, uruchomi się tylko raz po zamontowaniu komponentu

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Błąd pobierania koszyka:", err));
  }, [userId]);

  const validate = () => {
    const newErrors = {};
    if (!address.country) newErrors.country = "Wymagane";
    if (!address.city) newErrors.city = "Wymagane";
    if (!address.postalCode) newErrors.postalCode = "Wymagane";
    if (!address.street) newErrors.street = "Wymagane";
    if (!address.buildingNumber) newErrors.buildingNumber = "Wymagane";
    // Poprawka: apartmentNumber jest teraz opcjonalny
    // if (!address.apartmentNumber) newErrors.apartmentNumber = "Wymagane";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!validate()) return;

    const stripe = await stripePromise;

    fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cartItems, address }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionId) {
          stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else if (data.error) {
          alert(data.error);
        }
      })
      .catch((err) => console.error("Błąd płatności:", err));
  };

  const handleRemoveItem = (productId, sizeId) => {
    fetch(`/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się usunąć produktu");
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) =>
              !(item.product_id === productId && item.size_id === sizeId)
          )
        );
      })
      .catch((err) => alert(err.message));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!userId) {
    return (
      <p className="text-center mt-5">
        Musisz być zalogowany, aby zobaczyć koszyk.
      </p>
    );
  }

  return (
    <div className="container mt-4">
      {/* Usunięto zbędny nagłówek, który pojawiał się podwójnie w pustym koszyku */}
      {cartItems.length === 0 ? (
        // Renderowanie zawartości identycznej jak w Favorites, gdy koszyk jest pusty
        <div className="container mt-4">
          <div className="mb-4">
            <h2
              className="text-start border-bottom pb-2"
              style={{ fontWeight: 400 }}
            >
              Koszyk
            </h2>
          </div>
          <p>Brak produktów w koszyku.</p>
          <p>Zobacz nasze produkty i dodaj coś do koszyka!</p>
          <ProductSlider products={products} title="Zobacz inne produkty" />
          <ProductSlider products={latestProducts} title="Najnowsze produkty" />
        </div>
      ) : (
        // Normalny widok koszyka, gdy są w nim przedmioty
        <>
          <div className="mb-4">
            {" "}
            {/* Dodany nagłówek dla niepustego koszyka */}
            <h2
              className="text-start border-bottom pb-2"
              style={{ fontWeight: 400 }}
            >
              Koszyk
            </h2>
          </div>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                key={`${item.product_id}-${item.size_id}`}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong> — {item.price} zł x{" "}
                  {item.quantity}
                  <br />
                  <small>Rozmiar: {item.size}</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-3">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleRemoveItem(item.product_id, item.size_id)
                    }
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3>Adres dostawy</h3>
          <form
            onSubmit={(e) => {
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
              {
                label: "Numer mieszkania",
                name: "apartmentNumber",
                optional: true,
              }, // Dodano flagę opcjonalności
            ].map(({ label, name, optional }) => (
              <div key={name} className="mb-2">
                <label className="form-label">{label}</label>
                <input
                  type="text"
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  name={name}
                  value={address[name]}
                  onChange={handleInputChange}
                  required={!optional} // Ustawiamy required tylko jeśli nie jest opcjonalne
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
