import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../AuthContext";
import ProductSlider from "../components/Products_slider";

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

  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    console.log("Fetching general products for slider...");
    fetch("/api/products")
      .then((res) => {
        if (!res.ok)
          throw new Error("Network response for products was not ok");
        return res.json();
      })
      .then((data) => {
        // Konwertuj price na liczbę dla produktów w sliderach też, jeśli jest taka potrzeba
        const processedProducts = data.map((product) => ({
          ...product,
          price: parseFloat(product.price), // Użyj parseFloat
        }));
        setProducts(processedProducts);
        console.log("Fetched products:", processedProducts);
      })
      .catch((err) => console.error("Błąd pobierania produktów:", err));

    console.log("Fetching latest products for slider...");
    fetch("/api/products/latest")
      .then((res) => {
        if (!res.ok)
          throw new Error("Network response for latest products was not ok");
        return res.json();
      })
      .then((data) => {
        // Konwertuj price na liczbę dla najnowszych produktów w sliderach
        const processedLatestProducts = data.map((product) => ({
          ...product,
          price: parseFloat(product.price), // Użyj parseFloat
        }));
        setLatestProducts(processedLatestProducts);
        console.log("Fetched latest products:", processedLatestProducts);
      })
      .catch((err) =>
        console.error("Błąd pobierania najnowszych produktów:", err)
      );
  }, []);

  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      console.log("User not logged in, cart cleared.");
      return;
    }

    console.log(`Fetching cart for user ID: ${userId}`);
    fetch(`/api/cart/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response for cart was not ok");
        return res.json();
      })
      .then((data) => {
        // TUTAJ JEST KLUCZOWA ZMIANA: Konwersja item.price i item.quantity na liczby
        const processedCartItems = data.map((item) => ({
          ...item,
          price: parseFloat(item.price), // Konwertuj cenę na liczbę zmiennoprzecinkową
          quantity: parseInt(item.quantity, 10), // Konwertuj ilość na liczbę całkowitą
        }));
        setCartItems(processedCartItems);
        console.log("Fetched and processed cart items:", processedCartItems);
      })
      .catch((err) => console.error("Błąd pobierania koszyka:", err));
  }, [userId]);

  const validate = () => {
    const newErrors = {};
    if (!address.country) newErrors.country = "Wymagane";
    if (!address.city) newErrors.city = "Wymagane";
    if (!address.postalCode) newErrors.postalCode = "Wymagane";
    if (!address.street) newErrors.street = "Wymagane";
    if (!address.buildingNumber) newErrors.buildingNumber = "Wymagane";
    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    console.log(`Address input changed: ${name}=${value}`);
  };

  const handlePayment = async () => {
    console.log("Attempting payment...");
    if (!validate()) {
      console.log("Validation failed.");
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      console.error(
        "Stripe nie został załadowany poprawnie. Sprawdź klucz VITE_STRIPE_PUBLIC_KEY."
      );
      alert("Błąd inicjalizacji płatności. Spróbuj ponownie.");
      return;
    }

    console.log("Sending payment request to backend...");
    fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cartItems, address }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(
              errData.error ||
                "Network response for checkout session was not ok"
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Checkout session response:", data);
        if (data.sessionId) {
          stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else if (data.error) {
          alert(data.error);
        }
      })
      .catch((err) => {
        console.error("Błąd płatności:", err);
        alert("Wystąpił błąd podczas przetwarzania płatności: " + err.message);
      });
  };

  const handleRemoveItem = (productId, sizeId) => {
    console.log(
      `Attempting to remove item: Product ID ${productId}, Size ID ${sizeId}`
    );
    fetch(`/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, sizeId }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.message || "Nie udało się usunąć produktu");
          });
        }
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) =>
              !(item.product_id === productId && item.size_id === sizeId)
          )
        );
        console.log("Item removed successfully.");
      })
      .catch((err) => {
        console.error("Błąd usuwania z koszyka:", err);
        alert(err.message);
      });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, // Tutaj już item.price i item.quantity będą liczbami
    0
  );

  if (!userId) {
    return (
      <div className="container my-5 p-4 rounded-3 shadow-lg bg-light text-dark text-center">
        <p className="fs-5 text-muted">
          Musisz być zalogowany, aby zobaczyć koszyk.
        </p>
      </div>
    );
  }

  return (
    <div className="container my-5 p-4 rounded-3 shadow-lg bg-light text-dark">
      <h2 className="display-4 fw-bold mb-4 text-dark text-center">Koszyk</h2>
      <hr className="my-4" />

      {cartItems.length === 0 ? (
        <div className="text-center mt-4">
          <p className="fs-5 text-muted">Brak produktów w koszyku.</p>
          <p className="fs-6 text-muted mb-4">
            Zobacz nasze produkty i dodaj coś do koszyka!
          </p>
          {products.length > 0 && (
            <ProductSlider products={products} title="Zobacz inne produkty" />
          )}
          {latestProducts.length > 0 && (
            <ProductSlider
              products={latestProducts}
              title="Najnowsze produkty"
            />
          )}
          {products.length === 0 && latestProducts.length === 0 && (
            <p className="text-muted mt-3">
              Ładowanie produktów lub brak produktów do wyświetlenia.
            </p>
          )}
        </div>
      ) : (
        <>
          <h3 className="fs-4 fw-bold mb-3 text-dark">Twoje produkty:</h3>
          <ul className="list-group mb-4">
            {cartItems.map((item) => (
              <li
                key={`${item.product_id}-${item.size_id}`}
                className="list-group-item d-flex justify-content-between align-items-center py-3 px-3 shadow-sm rounded mb-2"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold">{item.name}</h5>
                    <small className="text-muted">Rozmiar: {item.size}</small>
                    <p className="mb-0">
                      Cena: {item.price.toFixed(2)} zł x {item.quantity}
                    </p>{" "}
                    {/* TERAZ item.price jest liczbą */}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="fs-5 fw-bold mb-2">
                    {(item.price * item.quantity).toFixed(2)} zł{" "}
                    {/* TERAZ item.price i item.quantity są liczbami */}
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

          <h3 className="fs-4 fw-bold mb-3 text-dark">Adres dostawy</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
            noValidate
            className="needs-validation"
          >
            <div className="row">
              {[
                { label: "Kraj", name: "country", col: "col-md-6" },
                { label: "Miasto", name: "city", col: "col-md-6" },
                { label: "Kod pocztowy", name: "postalCode", col: "col-md-6" },
                { label: "Ulica", name: "street", col: "col-md-6" },
                {
                  label: "Numer budynku",
                  name: "buildingNumber",
                  col: "col-md-6",
                },
                {
                  label: "Numer mieszkania (opcjonalnie)",
                  name: "apartmentNumber",
                  optional: true,
                  col: "col-md-6",
                },
              ].map(({ label, name, optional, col }) => (
                <div key={name} className={`${col} mb-3`}>
                  <label htmlFor={name} className="form-label">
                    {label}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors[name] ? "is-invalid" : ""
                    }`}
                    id={name}
                    name={name}
                    value={address[name]}
                    onChange={handleInputChange}
                    required={!optional}
                  />
                  {errors[name] && (
                    <div className="invalid-feedback">{errors[name]}</div>
                  )}
                </div>
              ))}
            </div>

            <hr className="my-4" />
            <div className="d-flex justify-content-end align-items-center">
              <h4 className="me-3 mb-0">
                <strong>Łącznie: {total.toFixed(2)} zł</strong>
              </h4>
              <button
                type="submit"
                className="btn btn-primary btn-lg light-theme-button"
              >
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
