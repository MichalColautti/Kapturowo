import React, { useEffect, useState } from "react";
import Products_grid from "../components/Products_grid";

function New_Products() {
    const [latestProducts, setLatestProducts] = useState([]);
  
    useEffect(() => {
      // Najnowsze produkty
      fetch('/api/products/latest')
        .then(res => res.json())
        .then(data => setLatestProducts(data))
        .catch(err => console.error('Błąd pobierania najnowszych produktów:', err));
    }, []);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Nowości
        </h2>
      </div>
      <Products_grid products={latestProducts} />
    </div>
  );
}

export default New_Products;
