import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;

  const addToCart = () => {
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: id }),
    })
      .then(res => {
        if (res.ok) alert("Dodano do koszyka!");
        else throw new Error("Nie udało się dodać do koszyka.");
      })
      .catch(err => console.error("Błąd dodawania do koszyka:", err));
  };

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Błąd ładowania szczegółów produktu:", err));
  }, [id]);

  if (!product) return <div>Ładowanie...</div>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} style={{ width: "100%", maxWidth: 400 }} />
      <p>Cena: {product.price}</p>
      <p>Dla: {product.target_audience || "Dla kazdego."}</p>
      <button className="btn btn-primary mt-3" onClick={addToCart}>
        Dodaj do koszyka
      </button>
    </div>
  );
}

export default ProductDetails;
