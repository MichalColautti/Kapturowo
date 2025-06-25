import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/Products_grid";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Produkty() {
  const query = useQuery();
  const [products, setProducts] = useState([]);
  const category = query.get("category");
  const audience = query.get("audience");

  const audienceDisplayMap = {
    mezczyzna: "mężczyzna",
    kobieta: "kobieta",
    dziecko: "dziecko",
  };

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await fetch(
          `/api/products/filter?category=${category}&audience=${audience}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Błąd podczas ładowania produktów:", err);
      }
    };

    fetchFilteredProducts();
  }, [category, audience]);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Produkty: {category} - {audienceDisplayMap[audience] || audience}
        </h2>
        {products.length > 0 ? (
          <ProductGrid products={products} title="Wyniki wyszukiwania" />
        ) : (
          <p>Brak produktów do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
}

export default Produkty;
