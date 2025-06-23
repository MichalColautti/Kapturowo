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

  const audienceDisplayMap = {
    mezczyzna: "Mężczyzna",
    kobieta: "Kobieta",
    dziecko: "Dziecko",
  };

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) =>
        console.error("Błąd ładowania szczegółów produktu:", err)
      );
  }, [id]);

  useEffect(() => {
    fetch(`/api/products/${id}/sizes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSizes(data);
        if (data.length > 0) {
          setSelectedSize(data[0].size);
        }
      })
      .catch((err) => console.error("Błąd ładowania rozmiarów:", err));
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
        alert(`Nie udało się dodać do koszyka: ${errorData.message || ""}`);
      }
    } catch (err) {
      console.error("Błąd dodawania do koszyka:", err);
      alert("Wystąpił błąd podczas dodawania do koszyka.");
    }
  };

  if (!product)
    return (
      <div className="text-center text-light my-5">Ładowanie produktu...</div>
    );

  return (
    <div className="container my-5 p-4 rounded-3 shadow-lg bg-dark text-light">
      {" "}
      {/* bg-dark for dark background, text-light for light text */}
      <div className="row">
        {/* Product Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded-3 shadow-sm product-image-max-width" // Custom class for max-width
          />
        </div>

        {/* Product Info Section */}
        <div className="col-md-6">
          <h1 className="display-4 fw-bold mb-3 text-white">{product.name}</h1>{" "}
          {/* Larger, bolder title */}
          <p className="fs-3 fw-semibold mb-2 text-info">
            {product.price} zł
          </p>{" "}
          {/* text-info for a subtle color highlight */}
          <p className="fs-5 mb-3 text-muted">
            Dla: {audienceDisplayMap[product.target_audience] || "Dla każdego"}
          </p>
          <p className="lead mb-4">
            {product.description || "Brak opisu produktu."}
          </p>{" "}
          {/* lead for slightly larger text */}
          {/* Size Selection */}
          <div className="mb-3">
            <label htmlFor="size-select" className="form-label fs-5">
              Rozmiar:
            </label>
            <select
              id="size-select"
              className="form-select form-select-lg bg-secondary text-light border-secondary" // Darker background for select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.length > 0 ? (
                sizes.map(({ size }) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))
              ) : (
                <option value="">Brak dostępnych rozmiarów</option>
              )}
            </select>
          </div>
          {/* Quantity Input */}
          <div className="mb-4">
            <label htmlFor="quantity-input" className="form-label fs-5">
              Ilość:
            </label>
            <input
              id="quantity-input"
              type="number"
              className="form-control form-control-lg bg-secondary text-light border-secondary w-25" // Darker background, fixed width
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          {/* Add to Cart Button */}
          <button
            className="btn btn-primary btn-lg w-100 dark-theme-button"
            onClick={addToCart}
          >
            {" "}
            {/* Custom class for specific color */}
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
