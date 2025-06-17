import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Products_grid";
import ProductSlider from "../components/Products_slider";
function Sale() {
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

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Wyprzedaż
        </h2>
        <p>Aktualnie nie ma żadnych wyprzedaży</p>
        <ProductSlider products={products} title="Zobacz inne produkty" />
        <ProductSlider products={latestProducts} title="Najnowsze produkty" />
      </div>
    </div>
  );
}

export default Sale;
