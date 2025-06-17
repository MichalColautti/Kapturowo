import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Products_grid";
import ProductSlider from "../components/Products_slider";
function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("name");

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
    if (query) {
      fetch(`/api/products/search?name=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Błąd podczas wyszukiwania:", err);
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) return <p className="text-center mt-5">Ładowanie...</p>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Wyniki dla: "{query}"
        </h2>
        {results.length > 0 ? (
          <ProductGrid products={results} title="Wyniki wyszukiwania" />
        ) : (
          <>
            <p>Brak wyników wyszukiwania dla "{query}".</p>
            <ProductSlider products={products} title="Zobacz inne produkty" />
            <ProductSlider
              products={latestProducts}
              title="Najnowsze produkty"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
