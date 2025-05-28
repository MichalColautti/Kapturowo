import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const userId = user?.id;

  const sizeMap = {
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
    35: 5,
    36: 6,
    37: 7,
    38: 8,
    39: 9,
    40: 10,
    41: 11,
    42: 12,
  };


  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Błąd ładowania szczegółów produktu:", err));
  }, [id]);

  useEffect(() => {
    fetch(`/api/products/${id}/sizes`)
      .then(res => res.json())
      .then(data => {
        setSizes(data);
        if (data.length > 0) {
          setSelectedSize(data[0].size); 
        }
      })
      .catch(err => console.error("Błąd ładowania rozmiarów:", err));
  }, [id]);

  const addToCart = async () => {
    if (!userId) {
      alert("Musisz być zalogowany, aby dodać do koszyka.");
      return;
    }

    if (!selectedSize) {
      alert("Wybierz rozmiar.");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: parseInt(id), 
          sizeId: sizeMap[selectedSize],
          quantity: parseInt(quantity),
        }),
      });

      if (response.ok) {
        alert("Dodano do koszyka!");
      } else {
        const errorData = await response.json();
        console.error("Błąd dodawania do koszyka:", errorData);
        alert("Nie udało się dodać do koszyka.");
      }
    } catch (err) {
      console.error("Błąd dodawania do koszyka:", err);
      alert("Wystąpił błąd podczas dodawania do koszyka.");
    }
  };

  if (!product) return <div>Ładowanie...</div>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} style={{ width: "100%", maxWidth: 400 }} />
      <p>Cena: {product.price} zł</p>
      <p>Dla: {product.target_audience || "Dla każdego"}</p>

      <div className="mt-3">
        <label className="form-label">Rozmiar:</label>
        <select
          className="form-select"
          value={selectedSize}
          onChange={e => setSelectedSize(e.target.value)}
        >
          {sizes.map(({ size }) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="form-label">Ilość:</label>
        <input
          type="number"
          className="form-control"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{ maxWidth: 100 }}
        />
      </div>

      <button className="btn btn-primary mt-3" onClick={addToCart}>
        Dodaj do koszyka
      </button>
    </div>
  );
}

export default ProductDetails;
