import React, { useEffect, useState } from "react";
import Products_grid from "../components/Products_grid";
import { useAuth } from "../AuthContext";
import ProductSlider from "../components/Products_slider";
function Favorites({}) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;
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
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`/api/get-favorites/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd pobierania ulubionych");
        }
        return res.json();
      })
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (!userId) {
    return <p>Zaloguj się, aby zobaczyć ulubione produkty.</p>;
  }

  if (loading) {
    return <p>Ładowanie ulubionych...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  if (favorites.length === 0) {
    return (
      <div className="container mt-4">
        <div className="mb-4">
          <h2
            className="text-start border-bottom pb-2"
            style={{ fontWeight: 400 }}
          >
            Ulubione
          </h2>
        </div>
        <p>Brak ulubionych produktów.</p>
        <p>
          Dodaj produkty do ulubionych, klikając ikonę serca na stronie
          produktu.
        </p>
        <ProductSlider products={products} title="Zobacz inne produkty" />
        <ProductSlider products={latestProducts} title="Najnowsze produkty" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Ulubione
        </h2>
      </div>
      <Products_grid products={favorites} />
    </div>
  );
}

export default Favorites;
