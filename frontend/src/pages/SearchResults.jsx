import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Products_grid";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("name");

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
    <div className="container mt-5">
      <h3 className="mb-4">Wyniki dla: "{query}"</h3>
      {results.length > 0 ? (
        <ProductGrid products={results} title="Wyniki wyszukiwania" />
      ) : (
        <p>Brak wyników.</p>
      )}
    </div>
  );
}

export default SearchResults;
